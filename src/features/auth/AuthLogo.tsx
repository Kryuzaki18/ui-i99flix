/**
 * AuthLogo — mobile-only logo shown on auth pages when the showcase panel
 * is hidden (viewport < 900px). Hidden on desktop via CSS.
 */
export default function AuthLogo() {
  return (
    <div className="auth-panel__logo">
      <img src="/i99flix-logo.png" alt="i99flix logo" width={100} />
    </div>
  );
}
