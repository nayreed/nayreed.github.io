import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-ink">
      <div className="text-center px-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-mute mb-3">Error</p>
        <h1 className="font-display text-6xl font-bold mb-4">404</h1>
        <p className="text-fade mb-8">This page does not exist.</p>
        <a href="/" className="pill-primary">
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
