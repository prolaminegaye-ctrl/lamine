import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App";
import "./index.css";

// ── ErrorBoundary global ────────────────────────────────────────────────────
// Sans ça, toute erreur React = page blanche silencieuse

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[GolléO ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error.message || "Erreur inattendue";
      const stack = this.state.error.stack?.split("\n").slice(0, 5).join("\n") ?? "";
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", background: "#F2EDE3", padding: "2rem",
          fontFamily: "Inter, sans-serif",
        }}>
          <div style={{
            background: "white", borderRadius: "1.5rem", padding: "2.5rem",
            maxWidth: "520px", width: "100%",
            boxShadow: "0 8px 32px rgba(30,58,47,0.1)",
            border: "1px solid rgba(200,150,78,0.2)",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "0.875rem",
              background: "linear-gradient(135deg, #1E3A2F, #2E7D5B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "1.25rem", fontSize: "1.25rem",
            }}>⚠️</div>
            <h2 style={{ color: "#1E3A2F", marginBottom: "0.5rem", fontSize: "1.125rem", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
              Une erreur est survenue
            </h2>
            <p style={{ color: "rgba(30,58,47,0.65)", fontSize: "0.875rem", marginBottom: "1rem", lineHeight: 1.6 }}>
              {msg}
            </p>
            {stack && (
              <pre style={{
                background: "rgba(220,60,60,0.06)", border: "1px solid rgba(220,60,60,0.15)",
                borderRadius: "0.5rem", padding: "0.75rem", fontSize: "0.65rem",
                color: "#c0392b", marginBottom: "1.25rem", overflowX: "auto",
                whiteSpace: "pre-wrap", maxHeight: "140px",
              }}>{stack}</pre>
            )}
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = "/"; }}
              style={{
                background: "linear-gradient(135deg, #C8964E, #B07A35)", color: "white",
                border: "none", borderRadius: "0.75rem", padding: "0.75rem 1.5rem",
                fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", width: "100%",
              }}
            >
              ↩ Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
