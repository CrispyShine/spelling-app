// Screens: Start, Practice, Summary + shared UI bits

const { useState, useEffect, useRef, useMemo } = React;

// ---- Shared primitives ----

const Card = ({ children, style, ...rest }) => (
  <div
    style={{
      background: "var(--bg-2)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--line)",
      padding: 48,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const ChunkyButton = ({ children, variant = "primary", onClick, disabled, style, icon, ...rest }) => {
  const palette = {
    primary: { bg: "var(--accent)", ink: "white", shadow: "color-mix(in oklch, var(--accent) 60%, black)" },
    secondary: { bg: "var(--bg-2)", ink: "var(--ink)", shadow: "var(--line-strong)" },
    success: { bg: "var(--mint)", ink: "var(--mint-ink)", shadow: "color-mix(in oklch, var(--mint) 60%, black)" },
    ghost: { bg: "transparent", ink: "var(--ink-soft)", shadow: "transparent" },
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: palette.bg,
        color: palette.ink,
        border: variant === "secondary" ? "2px solid var(--line-strong)" : "none",
        padding: "16px 28px",
        fontSize: 19,
        fontWeight: 800,
        fontFamily: "var(--font-ui)",
        borderRadius: 16,
        boxShadow: variant === "ghost" ? "none" : `0 4px 0 ${palette.shadow}`,
        transform: "translateY(0)",
        transition: "transform 0.1s, box-shadow 0.1s, background 0.15s",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        letterSpacing: "0.01em",
        ...style,
      }}
      onMouseDown={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(3px)";
        e.currentTarget.style.boxShadow = `0 1px 0 ${palette.shadow}`;
      }}
      onMouseUp={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = variant === "ghost" ? "none" : `0 4px 0 ${palette.shadow}`;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = variant === "ghost" ? "none" : `0 4px 0 ${palette.shadow}`;
      }}
      {...rest}
    >
      {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
      {children}
    </button>
  );
};

const Stars = ({ earned, total }) => (
  <div style={{ display: "inline-flex", gap: 6 }}>
    {Array.from({ length: total }).map((_, i) => (
      <Star key={i} filled={i < earned} />
    ))}
  </div>
);

const Star = ({ filled, size = 28, delay = 0 }) => (
  <div
    style={{
      width: size, height: size,
      background: filled ? "var(--butter)" : "var(--line)",
      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      animation: filled ? `pop 0.5s ease-out ${delay}s both` : "none",
      filter: filled ? `drop-shadow(0 2px 0 color-mix(in oklch, var(--butter) 60%, black))` : "none",
    }}
  />
);

// ---- Start screen ----

const StartScreen = ({ childName, onStart, weeks, session }) => {
  const [selectedWeek, setSelectedWeek] = useState("latest");
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div style={{
      maxWidth: 920, margin: "0 auto", padding: "80px 40px 40px",
      animation: "fadeIn 0.5s ease-out",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px", minWidth: 300 }}>
          <div style={{
            fontSize: 16, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "var(--accent-ink)",
            marginBottom: 12,
          }}>
            {greeting}
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(48px, 6vw, 76px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
            color: "var(--ink)",
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
          }}>
            Ready to spell,<br/>
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>{childName}?</span>
          </h1>
          <p style={{
            fontSize: 20, color: "var(--ink-soft)",
            lineHeight: 1.5, margin: "0 0 36px", maxWidth: 460,
          }}>
            Listen to each word, then type it carefully. You can always tap <b>hear word</b> to listen again.
          </p>

          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 14, fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.14em", color: "var(--ink-faint)",
              marginBottom: 14,
            }}>
              Pick a week
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <WeekChip
                label="This week"
                sub="latest"
                active={selectedWeek === "latest"}
                onClick={() => setSelectedWeek("latest")}
              />
              {weeks.map((w) => (
                <WeekChip
                  key={w}
                  label={`Week ${w}`}
                  sub={null}
                  active={selectedWeek === String(w)}
                  onClick={() => setSelectedWeek(String(w))}
                />
              ))}
            </div>
          </div>

          <ChunkyButton onClick={() => onStart(selectedWeek)} icon="▶">
            Start practice · {session} words
          </ChunkyButton>
        </div>

        <div style={{ flex: "0 0 auto", position: "relative" }}>
          <div style={{
            background: "var(--accent-soft)",
            borderRadius: "50%",
            padding: 48,
            position: "relative",
          }}>
            <Mascot state="happy" size={220} accent="var(--accent)" />
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        marginTop: 56,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
      }}>
        <MiniStat label="Practiced" value="132 words" color="var(--coral)" />
        <MiniStat label="Current streak" value="4 days 🔥" color="var(--butter)" />
        <MiniStat label="Best score" value="12 / 12" color="var(--mint)" />
        <MiniStat label="Favourite word" value="whisper" color="var(--sky)" />
      </div>
    </div>
  );
};

const WeekChip = ({ label, sub, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      border: active ? "2px solid var(--accent)" : "2px solid var(--line-strong)",
      background: active ? "var(--accent-soft)" : "var(--bg-2)",
      color: "var(--ink)",
      padding: "10px 18px",
      fontSize: 16,
      fontWeight: 700,
      borderRadius: 999,
      fontFamily: "var(--font-ui)",
      cursor: "pointer",
      transition: "all 0.15s",
      display: "inline-flex", alignItems: "center", gap: 8,
    }}
  >
    {label}
    {sub && (
      <span style={{
        fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        textTransform: "uppercase", padding: "2px 8px",
        background: active ? "var(--accent)" : "var(--line)",
        color: active ? "white" : "var(--ink-soft)",
        borderRadius: 999,
      }}>{sub}</span>
    )}
  </button>
);

const MiniStat = ({ label, value, color }) => (
  <div style={{
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: "16px 18px",
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, bottom: 0, width: 4,
      background: color,
    }} />
    <div style={{
      fontSize: 12, fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.12em", color: "var(--ink-faint)", marginBottom: 4,
    }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>{value}</div>
  </div>
);

// ---- Practice screen ----

const PracticeScreen = ({
  words, wordIndex, feedback, input, setInput,
  onHear, onCheck, onNext, onQuit, soundOn, mascotOn,
  attempts, currentWord,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [wordIndex, feedback?.kind]);

  const mascotState = (() => {
    if (feedback?.kind === "correct") return "cheering";
    if (feedback?.kind === "reveal") return "sad";
    if (feedback?.kind === "retry") return "thinking";
    if (feedback?.kind === "listening") return "listening";
    return "happy";
  })();

  const progress = ((wordIndex) / words.length) * 100;
  const canCheck = feedback?.kind !== "correct" && feedback?.kind !== "reveal";

  return (
    <div style={{
      maxWidth: 1040, margin: "0 auto",
      padding: "40px 40px 60px",
      animation: "fadeIn 0.3s ease-out",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        marginBottom: 28,
      }}>
        <button
          onClick={onQuit}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "2px solid var(--line-strong)", background: "var(--bg-2)",
            color: "var(--ink-soft)", fontSize: 20, fontWeight: 800,
            cursor: "pointer", flexShrink: 0,
          }}
          aria-label="Quit session"
        >×</button>
        <div style={{ flex: 1 }}>
          <div style={{
            height: 14, background: "var(--line)",
            borderRadius: 999, overflow: "hidden",
            border: "1px solid var(--line-strong)",
          }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "var(--accent)",
              borderRadius: 999,
              transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "inset 0 -3px 0 color-mix(in oklch, var(--accent) 60%, black), inset 0 3px 0 color-mix(in oklch, var(--accent) 90%, white)",
            }} />
          </div>
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontWeight: 500,
          fontSize: 14, color: "var(--ink-faint)", minWidth: 48, textAlign: "right",
        }}>
          {wordIndex + 1} / {words.length}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: mascotOn ? "200px 1fr" : "1fr",
        gap: 40,
        alignItems: "start",
      }}>
        {mascotOn && (
          <div style={{
            position: "sticky", top: 40,
            display: "flex", justifyContent: "center",
          }}>
            <Mascot state={mascotState} size={180} accent="var(--accent)" />
          </div>
        )}

        <Card style={{ padding: "48px 56px", position: "relative" }}>
          <div style={{
            fontSize: 13, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--ink-faint)",
            marginBottom: 16,
          }}>
            Word {wordIndex + 1}
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600, fontStyle: "italic",
            fontSize: "clamp(32px, 4vw, 44px)",
            lineHeight: 1.15, letterSpacing: "-0.01em",
            margin: "0 0 32px", color: "var(--ink)",
            fontVariationSettings: "'opsz' 144",
          }}>
            {feedback?.kind === "reveal"
              ? <>The word was <span style={{ color: "var(--coral)", fontStyle: "normal", fontWeight: 900 }}>{currentWord.word}</span>.</>
              : feedback?.kind === "correct"
              ? <>You spelled <span style={{ color: "var(--mint-ink)", fontStyle: "normal", fontWeight: 900 }}>{currentWord.word}</span> perfectly!</>
              : "Listen, then spell the word."}
          </h2>

          {/* Hear word button */}
          <div style={{ marginBottom: 28 }}>
            <button
              onClick={onHear}
              style={{
                display: "inline-flex", alignItems: "center", gap: 14,
                background: "var(--accent-soft)",
                border: "2px solid var(--accent)",
                color: "var(--accent-ink)",
                padding: "14px 24px",
                borderRadius: 999,
                fontFamily: "var(--font-ui)",
                fontWeight: 800, fontSize: 17,
                cursor: "pointer",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <SpeakerIcon />
              Hear the word
            </button>
            <span style={{
              marginLeft: 16, fontSize: 14, color: "var(--ink-faint)",
              fontFamily: "var(--font-mono)",
            }}>
              or press <Kbd>space</Kbd>
            </span>
          </div>

          {/* Input */}
          <div style={{
            position: "relative",
            animation: feedback?.kind === "retry" ? "shake 0.4s ease-in-out" : "none",
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (canCheck) onCheck();
                  else onNext();
                }
                if (e.key === " " && !input) {
                  e.preventDefault();
                  onHear();
                }
              }}
              disabled={!canCheck}
              autoCorrect="off"
              spellCheck={false}
              autoCapitalize="off"
              placeholder="Type the word…"
              style={{
                width: "100%",
                padding: "22px 28px",
                fontSize: 32,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                fontVariationSettings: "'opsz' 144",
                background: feedback?.kind === "correct" ? "var(--mint-soft)"
                          : feedback?.kind === "reveal" ? "var(--coral-soft)"
                          : "var(--bg)",
                color: "var(--ink)",
                border: `3px solid ${
                  feedback?.kind === "correct" ? "var(--mint)"
                  : feedback?.kind === "reveal" ? "var(--coral)"
                  : feedback?.kind === "retry" ? "var(--coral)"
                  : "var(--line-strong)"}`,
                borderRadius: 18,
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s",
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            />
          </div>

          {/* Feedback line */}
          <div style={{
            minHeight: 40, marginTop: 18, display: "flex",
            alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <div style={{
              fontSize: 17, fontWeight: 700,
              color: feedback?.kind === "correct" ? "var(--mint-ink)"
                  : feedback?.kind === "retry" ? "var(--coral-ink)"
                  : feedback?.kind === "reveal" ? "var(--coral-ink)"
                  : "var(--ink-faint)",
              animation: feedback ? "slideUp 0.3s ease-out" : "none",
            }}>
              {feedback?.kind === "correct" && <>✨ Perfect! +1 star earned.</>}
              {feedback?.kind === "retry" && <>Close — have another go.</>}
              {feedback?.kind === "reveal" && <>Off by {feedback.errors} letter{feedback.errors === 1 ? "" : "s"}. You'll get it next time.</>}
              {!feedback && attempts === 0 && <>Take your time. Listen as many times as you need.</>}
            </div>
            {attempts > 0 && canCheck && (
              <div style={{
                fontSize: 12, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.1em", color: "var(--ink-faint)",
              }}>
                Attempt {attempts + 1} of 2
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 28, alignItems: "center", flexWrap: "wrap" }}>
            {canCheck ? (
              <ChunkyButton onClick={onCheck} disabled={!input.trim()}>
                Check spelling ↵
              </ChunkyButton>
            ) : (
              <ChunkyButton onClick={onNext} variant={feedback?.kind === "correct" ? "success" : "primary"}>
                {wordIndex + 1 === words.length ? "See results" : "Next word"} →
              </ChunkyButton>
            )}
            <ChunkyButton variant="ghost" onClick={onHear}>
              <SpeakerIcon small /> Replay
            </ChunkyButton>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SpeakerIcon = ({ small }) => (
  <svg width={small ? 18 : 22} height={small ? 18 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H2v6h4l5 4V5z"/>
    <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
    <path d="M19 5a9 9 0 0 1 0 14"/>
  </svg>
);

const Kbd = ({ children }) => (
  <span style={{
    fontFamily: "var(--font-mono)", fontSize: 12,
    padding: "2px 8px", borderRadius: 6,
    background: "var(--bg-2)", border: "1px solid var(--line-strong)",
    boxShadow: "0 1px 0 var(--line-strong)",
    color: "var(--ink-soft)", margin: "0 2px",
  }}>{children}</span>
);

// ---- Summary screen ----

const Confetti = ({ count = 40 }) => {
  const colors = ["var(--coral)", "var(--mint)", "var(--butter)", "var(--sky)", "var(--lavender)"];
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    color: colors[i % colors.length],
    size: 8 + Math.random() * 8,
    rotate: Math.random() * 360,
  })), [count]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute", top: 0, left: `${p.left}%`,
          width: p.size, height: p.size * 0.4,
          background: p.color,
          borderRadius: 2,
          transform: `rotate(${p.rotate}deg)`,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
};

const SummaryScreen = ({ score, total, history, onReplay, onHome, childName, rewardUnlocked, onPlayReward }) => {
  const pct = Math.round((score / total) * 100);
  const rating = pct >= 90 ? "superstar" : pct >= 70 ? "great" : pct >= 50 ? "good" : "keep going";
  const mascotState = pct >= 70 ? "cheering" : pct >= 50 ? "happy" : "sad";
  const earnedStars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const message = {
    "superstar": "Absolutely brilliant work.",
    "great": "Really strong effort.",
    "good": "Nice — getting there.",
    "keep going": "Every attempt makes it stick.",
  }[rating];

  return (
    <div style={{
      maxWidth: 960, margin: "0 auto", padding: "60px 40px",
      animation: "fadeIn 0.5s ease-out",
    }}>
      {pct >= 70 && <Confetti count={pct >= 90 ? 60 : 30} />}

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Mascot state={mascotState} size={180} accent="var(--accent)" />
        </div>
        <div style={{
          fontSize: 14, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.16em", color: "var(--accent-ink)",
          marginTop: 24, marginBottom: 8,
        }}>
          Session complete
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800, fontSize: "clamp(40px, 5vw, 64px)",
          margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.05,
          fontVariationSettings: "'opsz' 144",
        }}>
          {message}
        </h1>
        <div style={{ marginTop: 20 }}>
          <Stars earned={earnedStars} total={3} />
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, marginBottom: 32,
      }}>
        <BigStat label="Score" value={`${score} / ${total}`} accent="var(--accent)" />
        <BigStat label="Accuracy" value={`${pct}%`} accent="var(--mint)" />
        <BigStat label="First-try" value={`${history.filter(h => h.firstTry).length}`} accent="var(--butter)" />
        <BigStat label="Tricky ones" value={`${history.filter(h => !h.correct).length}`} accent="var(--coral)" />
      </div>

      {/* Word review */}
      <Card style={{ padding: "32px 36px" }}>
        <div style={{
          fontSize: 13, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.14em", color: "var(--ink-faint)",
          marginBottom: 18,
        }}>Your words</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 10,
        }}>
          {history.map((h, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px",
              background: h.correct ? "var(--mint-soft)" : "var(--coral-soft)",
              border: `1px solid ${h.correct ? "var(--mint)" : "var(--coral)"}`,
              borderRadius: 12,
              fontFamily: "var(--font-display)",
              fontSize: 17, fontWeight: 600,
              color: h.correct ? "var(--mint-ink)" : "var(--coral-ink)",
            }}>
              <span style={{ fontSize: 14 }}>{h.correct ? "✓" : "×"}</span>
              <span style={{ fontStyle: "italic" }}>{h.word}</span>
              {h.firstTry && <span style={{
                marginLeft: "auto", fontSize: 10, fontFamily: "var(--font-ui)",
                fontWeight: 800, background: "var(--butter)", color: "var(--butter-ink)",
                padding: "2px 6px", borderRadius: 4, letterSpacing: "0.08em",
              }}>1ST</span>}
            </div>
          ))}
        </div>
      </Card>

      {rewardUnlocked && (
        <div style={{
          marginTop: 32,
          padding: "28px 32px",
          background: "linear-gradient(135deg, var(--butter-soft), var(--accent-soft))",
          border: "3px dashed var(--butter)",
          borderRadius: 24,
          textAlign: "center",
          animation: "pop 0.6s ease-out",
        }}>
          <div style={{
            fontSize: 12, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.16em", color: "var(--butter-ink)", marginBottom: 6,
          }}>★ Reward unlocked ★</div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontStyle: "italic",
            fontSize: 32, margin: "0 0 6px",
            fontVariationSettings: "'opsz' 144",
          }}>Word Finder Fun</h3>
          <div style={{ color: "var(--ink-soft)", marginBottom: 16, fontSize: 15 }}>
            Perfect score! Make as many words as you can from the letters.
          </div>
          <ChunkyButton onClick={onPlayReward} icon="▶">Play now</ChunkyButton>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
        <ChunkyButton onClick={onReplay}>Practice again ↻</ChunkyButton>
        <ChunkyButton variant="secondary" onClick={onHome}>Back home</ChunkyButton>
      </div>
    </div>
  );
};

const BigStat = ({ label, value, accent }) => (
  <div style={{
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    borderRadius: 20,
    padding: "22px 24px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
  }}>
    <div style={{
      position: "absolute", inset: 0, top: "auto", height: 6,
      background: accent,
    }} />
    <div style={{
      fontSize: 12, fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 6,
    }}>{label}</div>
    <div style={{
      fontFamily: "var(--font-display)",
      fontSize: 40, fontWeight: 700, color: "var(--ink)",
      letterSpacing: "-0.01em",
      fontVariationSettings: "'opsz' 144",
    }}>{value}</div>
  </div>
);

Object.assign(window, { StartScreen, PracticeScreen, SummaryScreen, ChunkyButton, Card });
