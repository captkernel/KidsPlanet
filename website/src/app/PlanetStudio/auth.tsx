"use client";

import { useState, useEffect, FormEvent } from "react";
import { Palette, LogIn } from "lucide-react";

const SESSION_KEY = "planet-studio-auth";
const VALID_USERNAME = "kidsplanet";
const VALID_PASSWORD = "KPStudio@2026";

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function setAuthenticated() {
  sessionStorage.setItem(SESSION_KEY, "true");
}

function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Small delay to feel like real auth
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        setAuthenticated();
        onSuccess();
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary-dark">Planet Studio</h1>
          <p className="text-sm text-text-muted mt-1">
            Kids Planet Design Tool
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-primary/20 bg-surface-cream focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
          >
            <LogIn size={16} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Access restricted to Kids Planet staff only.
        </p>
      </div>
    </div>
  );
}

export function useStudioAuth() {
  const [authenticated, setAuth] = useState(false);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  function LoginGate() {
    return <LoginPage onSuccess={() => setAuth(true)} />;
  }

  return { authenticated, LoginGate };
}
