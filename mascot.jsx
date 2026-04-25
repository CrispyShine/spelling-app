// Mascot — a simple CSS-shape character that reacts to state
// States: idle, listening, thinking, happy, sad, cheering

const Mascot = ({ state = "idle", size = 180, accent = "var(--coral)" }) => {
  // Eye shape varies by state
  const eyeStyle = (() => {
    switch (state) {
      case "happy":
      case "cheering":
        return { height: 4, borderRadius: 4, transform: "scaleX(1.2)" };
      case "sad":
        return { height: 10, borderRadius: "50% 50% 0 0" };
      case "thinking":
        return { height: 10, width: 10, borderRadius: "50%" };
      case "listening":
        return { height: 12, width: 12, borderRadius: "50%" };
      default:
        return { height: 10, width: 10, borderRadius: "50%" };
    }
  })();

  const mouthStyle = (() => {
    switch (state) {
      case "happy":
      case "cheering":
        return {
          width: 34,
          height: 18,
          borderRadius: "0 0 40px 40px",
          background: "var(--ink)",
          border: "none",
        };
      case "sad":
        return {
          width: 24,
          height: 14,
          borderRadius: "40px 40px 0 0",
          background: "transparent",
          border: "3px solid var(--ink)",
          borderBottom: "none",
        };
      case "thinking":
        return {
          width: 14,
          height: 4,
          borderRadius: 4,
          background: "var(--ink)",
          border: "none",
          marginLeft: 12,
        };
      case "listening":
        return {
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "var(--ink)",
          border: "none",
        };
      default:
        return {
          width: 22,
          height: 10,
          borderRadius: "0 0 40px 40px",
          background: "var(--ink)",
          border: "none",
        };
    }
  })();

  const bodyAnim = (() => {
    switch (state) {
      case "cheering": return "wiggle 0.6s ease-in-out infinite";
      case "listening": return "float 2s ease-in-out infinite";
      case "sad": return "none";
      case "thinking": return "float 3s ease-in-out infinite";
      default: return "float 3.5s ease-in-out infinite";
    }
  })();

  const bodyTilt = state === "sad" ? "rotate(-4deg)" : "none";

  return (
    <div style={{
      width: size, height: size, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Sound pulses when listening */}
      {state === "listening" && (
        <>
          <div style={{
            position: "absolute", width: size * 0.7, height: size * 0.7,
            borderRadius: "50%", color: accent, animation: "pulseRing 1.8s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", width: size * 0.7, height: size * 0.7,
            borderRadius: "50%", color: accent, animation: "pulseRing 1.8s ease-out 0.9s infinite",
          }} />
        </>
      )}

      {/* Body */}
      <div style={{
        width: size * 0.78,
        height: size * 0.78,
        background: accent,
        borderRadius: "50% 50% 46% 46%",
        position: "relative",
        boxShadow: `0 8px 0 color-mix(in oklch, ${accent} 70%, black), 0 18px 40px oklch(0.70 0.02 75 / 0.3)`,
        animation: bodyAnim,
        transform: bodyTilt,
        transition: "transform 0.4s",
      }}>
        {/* Little ears / tufts */}
        <div style={{
          position: "absolute", top: -12, left: "20%",
          width: 22, height: 22, borderRadius: "50%",
          background: accent,
          boxShadow: `0 -2px 0 color-mix(in oklch, ${accent} 85%, black)`,
        }} />
        <div style={{
          position: "absolute", top: -12, right: "20%",
          width: 22, height: 22, borderRadius: "50%",
          background: accent,
          boxShadow: `0 -2px 0 color-mix(in oklch, ${accent} 85%, black)`,
        }} />

        {/* Face panel */}
        <div style={{
          position: "absolute",
          top: "22%", left: "12%", right: "12%", bottom: "15%",
          background: "oklch(0.98 0.01 75)",
          borderRadius: "50%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 8,
        }}>
          {/* Eyes */}
          <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
            <div style={{ width: 10, background: "var(--ink)", ...eyeStyle }} />
            <div style={{ width: 10, background: "var(--ink)", ...eyeStyle }} />
          </div>
          {/* Blush */}
          {(state === "happy" || state === "cheering") && (
            <div style={{
              position: "absolute", top: "52%",
              left: "18%", right: "18%",
              display: "flex", justifyContent: "space-between",
            }}>
              <div style={{ width: 14, height: 8, borderRadius: "50%", background: "var(--coral-soft)", opacity: 0.9 }} />
              <div style={{ width: 14, height: 8, borderRadius: "50%", background: "var(--coral-soft)", opacity: 0.9 }} />
            </div>
          )}
          {/* Mouth */}
          <div style={mouthStyle} />
        </div>

        {/* Thinking bubble */}
        {state === "thinking" && (
          <div style={{
            position: "absolute", top: -18, right: -16,
            background: "white", borderRadius: 16,
            padding: "6px 10px",
            fontSize: 18, fontWeight: 800, color: "var(--ink-soft)",
            boxShadow: "var(--shadow-sm)",
            animation: "pop 0.4s ease-out",
          }}>
            ...
          </div>
        )}

        {/* Star burst when cheering */}
        {state === "cheering" && (
          <>
            <div style={starStyle(-30, -20, "var(--butter)", 0)} />
            <div style={starStyle(90, -10, "var(--mint)", 0.2)} />
            <div style={starStyle(-40, 60, "var(--sky)", 0.4)} />
          </>
        )}
      </div>
    </div>
  );
};

const starStyle = (left, top, color, delay) => ({
  position: "absolute",
  left, top,
  width: 18, height: 18,
  background: color,
  clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  animation: `pop 0.6s ease-out ${delay}s both, float 1.8s ease-in-out ${delay}s infinite`,
});

Object.assign(window, { Mascot });
