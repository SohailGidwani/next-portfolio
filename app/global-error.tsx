"use client"

// Shown only when the root layout itself fails, so neither globals.css nor
// the theme provider has loaded. Styles are self-contained and follow the OS
// setting: the site palette in both themes (ultramarine accent on light,
// teal-blue on dark), with the same fonts' system fallbacks.
const css = `
  :root { --bg: #f6f7f9; --fg: #101114; --muted: #686c75; --border: #d8dbe1; --accent: #1938d7; --on-accent: #ffffff; color-scheme: light; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #07080b; --fg: #eef0f4; --muted: #878b95; --border: #1a1c22; --accent: #35b8d4; --on-accent: #07080b; color-scheme: dark; }
  }
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px;
    background: var(--bg); color: var(--fg); font: 400 16px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 28rem; }
  h1 { margin: 0; font-size: 2rem; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
  p { margin: 12px 0 0; color: var(--muted); }
  pre { margin: 16px 0 0; padding: 12px; overflow: auto; border: 1px solid var(--border); border-radius: 4px; font-size: 13px; text-align: left; }
  button { margin-top: 24px; padding: 10px 16px; border: 0; border-radius: 4px; background: var(--accent); color: var(--on-accent);
    font: 500 15px/1 inherit; cursor: pointer; }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
`

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong | Sohail Gidwani</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <main>
          <h1>Something went wrong</h1>
          <p>The page failed to load. Trying again usually fixes it.</p>
          {process.env.NODE_ENV === "development" && error.message ? <pre>{error.message}</pre> : null}
          <button type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
