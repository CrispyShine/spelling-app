// App: state machine + Tweaks + wiring

const { useState: useAppState, useEffect: useAppEffect, useMemo: useAppMemo } = React;

const LIVE_WEBHOOK = 'https://hook.eu2.make.com/el6ri22zr8f7vldc58a8oradbsspkacb';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "coral",
  "childName": "",
  "mascotOn": true,
  "soundOn": true,
  "sessionLength": 12,
  "dataSource": "mock",
  "liveWeek": "latest"
}/*EDITMODE-END*/;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function levenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) m[i][j] = m[i-1][j-1];
      else m[i][j] = Math.min(m[i-1][j-1] + 1, m[i][j-1] + 1, m[i-1][j] + 1);
    }
  }
  return m[b.length][a.length];
}

// Tiny audio cues via WebAudio
const audioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
  ? new (window.AudioContext || window.webkitAudioContext)()
  : null;

function beep(kind) {
  if (!audioCtx) return;
  const notes = {
    correct: [660, 880, 1100],
    retry: [440, 370],
    reveal: [330, 250],
    tick: [880],
  }[kind] || [440];
  const now = audioCtx.currentTime;
  notes.forEach((f, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0, now + i * 0.09);
    g.gain.linearRampToValueAtTime(0.12, now + i * 0.09 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.22);
    o.connect(g).connect(audioCtx.destination);
    o.start(now + i * 0.09);
    o.stop(now + i * 0.09 + 0.25);
  });
}

function speakFallback(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply theme
  useAppEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
  }, [tweaks.theme]);

  const mockBank = useAppMemo(() => {
    try { return JSON.parse(document.getElementById("mock-words").textContent); }
    catch { return {}; }
  }, []);

  const [screen, setScreen] = useAppState("start"); // start | loading | practice | summary | reward
  const [words, setWords] = useAppState([]);
  const [rewardUnlocked, setRewardUnlocked] = useAppState(false);
  const [wordIndex, setWordIndex] = useAppState(0);
  const [input, setInput] = useAppState("");
  const [feedback, setFeedback] = useAppState(null);
  const [attempts, setAttempts] = useAppState(0);
  const [history, setHistory] = useAppState([]);
  const [score, setScore] = useAppState(0);
  const [errorMsg, setErrorMsg] = useAppState(null);

  const availableWeeks = useAppMemo(() => Object.keys(mockBank).map(Number).sort((a,b)=>a-b), [mockBank]);
  const weekWordCounts = useAppMemo(() => {
    const counts = {};
    Object.keys(mockBank).forEach(k => { counts[k] = mockBank[k].length; });
    return counts;
  }, [mockBank]);

  async function startSession(week) {
    setErrorMsg(null);
    setScreen("loading");
    let pool = [];
    const resolvedWeek = week === "latest" ? String(Math.max(...availableWeeks)) : String(week);

    if (tweaks.dataSource === "live") {
      const weekParam = week === "latest" ? "latest" : resolvedWeek;
      try {
        const r = await fetch(`${LIVE_WEBHOOK}?week=${weekParam}`);
        const data = await r.json();
        pool = data.words || [];
      } catch (e) {
        setErrorMsg("Couldn't reach the word list — using sample words.");
        pool = mockBank[resolvedWeek] || mockBank["1"] || [];
      }
    } else {
      pool = mockBank[resolvedWeek] || mockBank["1"] || [];
    }

    if (!pool.length) {
      setErrorMsg("No words available for this week.");
      setScreen("start");
      return;
    }

    const selected = shuffle(pool).slice(0, tweaks.sessionLength);
    setWords(selected);
    setWordIndex(0);
    setInput("");
    setFeedback(null);
    setAttempts(0);
    setHistory([]);
    setScore(0);
    setRewardUnlocked(false);
    setScreen("practice");
    // auto-play the first word shortly after
    setTimeout(() => hearWord(selected[0]), 350);
  }

  function hearWord(w) {
    const target = w || words[wordIndex];
    if (!target) return;
    if (target.audioUrl) {
      const a = new Audio(target.audioUrl);
      a.play().catch(() => speakFallback(target.word));
    } else {
      speakFallback(target.word);
    }
  }

  function checkSpelling() {
    const current = words[wordIndex];
    const typed = input.trim();
    if (!typed) return;
    const correct = typed.toLowerCase() === current.word.toLowerCase();

    if (correct) {
      if (tweaks.soundOn) beep("correct");
      setScore(s => s + 1);
      setFeedback({ kind: "correct" });
      setHistory(h => [...h, { word: current.word, correct: true, firstTry: attempts === 0 }]);
    } else {
      if (attempts === 0) {
        if (tweaks.soundOn) beep("retry");
        setAttempts(1);
        setInput("");
        setFeedback({ kind: "retry" });
      } else {
        if (tweaks.soundOn) beep("reveal");
        const errors = levenshtein(typed, current.word);
        setFeedback({ kind: "reveal", errors });
        setHistory(h => [...h, { word: current.word, correct: false, firstTry: false }]);
      }
    }
  }

  function nextWord() {
    if (wordIndex + 1 >= words.length) {
      setRewardUnlocked(true);
      setScreen("summary");
      return;
    }
    const next = wordIndex + 1;
    setWordIndex(next);
    setInput("");
    setFeedback(null);
    setAttempts(0);
    setTimeout(() => hearWord(words[next]), 250);
  }

  function quit() {
    setScreen("start");
  }

  const currentWord = words[wordIndex] || { word: "" };

  return (
    <>
      {screen === "start" && (
        <StartScreen
          childName={tweaks.childName}
          onSetName={(v) => setTweak("childName", v)}
          weeks={availableWeeks}
          session={tweaks.sessionLength}
          wordCounts={weekWordCounts}
          onStart={startSession}
          dataSource={tweaks.dataSource}
          liveWeek={tweaks.liveWeek}
        />
      )}

      {screen === "loading" && (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <Mascot state="listening" size={140} accent="var(--accent)" />
            <div style={{ marginTop: 20, fontSize: 18, color: "var(--ink-soft)", fontWeight: 700 }}>
              Gathering your words…
            </div>
          </div>
        </div>
      )}

      {screen === "practice" && words.length > 0 && (
        <PracticeScreen
          words={words}
          wordIndex={wordIndex}
          feedback={feedback}
          input={input}
          setInput={setInput}
          onHear={() => hearWord()}
          onCheck={checkSpelling}
          onNext={nextWord}
          onQuit={quit}
          soundOn={tweaks.soundOn}
          mascotOn={tweaks.mascotOn}
          attempts={attempts}
          currentWord={currentWord}
        />
      )}

      {screen === "summary" && (
        <SummaryScreen
          score={score}
          total={words.length}
          history={history}
          childName={tweaks.childName}
          rewardUnlocked={rewardUnlocked}
          onPlayReward={() => setScreen("reward")}
          onReplay={() => startSession("latest")}
          onHome={() => setScreen("start")}
        />
      )}

      {screen === "reward" && (
        <window.WordFinderFun
          weeklyWords={words.map(w => w.word)}
          childName={tweaks.childName}
          onExit={() => setScreen("start")}
        />
      )}

      {errorMsg && screen !== "start" && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "var(--coral-soft)", border: "1px solid var(--coral)",
          color: "var(--coral-ink)", padding: "10px 16px", borderRadius: 12,
          fontSize: 14, fontWeight: 700, zIndex: 10,
        }}>{errorMsg}</div>
      )}

      <window.TweaksPanel>
        <window.TweakSection label="Appearance">
          <window.TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "coral", label: "Coral" },
              { value: "mint", label: "Mint" },
              { value: "sky", label: "Sky" },
              { value: "butter", label: "Butter" },
            ]}
          />
          <window.TweakToggle
            label="Show mascot"
            value={tweaks.mascotOn}
            onChange={(v) => setTweak("mascotOn", v)}
          />
        </window.TweakSection>

        <window.TweakSection label="Session">
          <window.TweakText
            label="Child's name"
            value={tweaks.childName}
            onChange={(v) => setTweak("childName", v)}
          />
          <window.TweakSlider
            label="Words per session"
            value={tweaks.sessionLength}
            onChange={(v) => setTweak("sessionLength", v)}
            min={4} max={20} step={1}
          />
          <window.TweakToggle
            label="Sound effects"
            value={tweaks.soundOn}
            onChange={(v) => setTweak("soundOn", v)}
          />
        </window.TweakSection>

        <window.TweakSection label="Data">
          <window.TweakRadio
            label="Source"
            value={tweaks.dataSource}
            onChange={(v) => setTweak("dataSource", v)}
            options={[
              { value: "mock", label: "Sample" },
              { value: "live", label: "Live" },
            ]}
          />
          {tweaks.dataSource === "live" && (
            <window.TweakRadio
              label="Week"
              value={tweaks.liveWeek}
              onChange={(v) => setTweak("liveWeek", v)}
              options={[
                { value: "latest", label: "Latest" },
                ...availableWeeks.map(w => ({ value: String(w), label: `Week ${w}` })),
              ]}
            />
          )}
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
