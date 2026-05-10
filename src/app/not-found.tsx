export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#0a0a0f",
          color: "#ffffff",
          fontFamily:
            'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "6rem",
              fontWeight: "bold",
              background:
                "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              lineHeight: 1,
            }}
          >
            404
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#a1a1aa",
              marginTop: "1rem",
              marginBottom: "2rem",
            }}
          >
            Page not found
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 2rem",
              backgroundColor: "#10b981",
              color: "#fff",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "all 0.2s",
            }}
          >
            ← Back to IQAAN
          </a>
        </div>
      </body>
    </html>
  );
}
