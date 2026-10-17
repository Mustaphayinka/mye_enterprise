import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Logo, useTitle } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { api, DEMO_PASSWORD } from "../lib/api";
import { isDemo } from "../lib/supabase";
import { Notice } from "./AdminLayout";

export default function Login() {
  useTitle("Owner login");
  const { ready, isAdmin } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";
  if (ready && isAdmin) return <Navigate to={from.startsWith("/admin") ? from : "/admin"} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-5 p-7 shadow-sm">
        <Logo />
        <div>
          <h1 className="text-xl font-bold">Store owner login</h1>
          <p className="mt-1 text-sm text-stone-500">Manage your products, orders and store details.</p>
        </div>
        {isDemo && <Notice kind="success">Demo mode: use any email and the password <b>{DEMO_PASSWORD}</b>.</Notice>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="input" /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="input" /></div>
        {error && <Notice kind="error">{error}</Notice>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3">{busy ? "Logging in..." : "Log in"}</button>
      </form>
    </div>
  );
}
