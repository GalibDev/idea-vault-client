"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authClient } from "../lib/auth-client.js";

const AuthContext = createContext(null);
const sessionKey = "ideavault-session";
const profilesKey = "ideavault-profiles";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function createDemoToken(email) {
  return `demo-jwt.${btoa(JSON.stringify({ email, issuedAt: Date.now() }))}.signature`;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function getSavedProfile(email) {
  if (!email || typeof window === "undefined") {
    return {};
  }

  const profiles = readJson(profilesKey, {});
  return profiles[email] || {};
}

function mapBetterAuthUser(authUser) {
  const savedProfile = getSavedProfile(authUser?.email);
  const email = authUser?.email || savedProfile.email || "";

  return {
    name: savedProfile.name || authUser?.name || email.split("@")[0] || "IdeaVault User",
    email,
    photo: savedProfile.photo || authUser?.image || "",
  };
}

function saveProfileCache(nextUser) {
  const profiles = readJson(profilesKey, {});
  profiles[nextUser.email] = nextUser;
  localStorage.setItem(profilesKey, JSON.stringify(profiles));
}

async function getServerToken(nextUser) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${apiUrl}/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ email: nextUser.email, name: nextUser.name }),
    });
    const data = await response.json();
    return data.token || createDemoToken(nextUser.email);
  } catch {
    return createDemoToken(nextUser.email);
  } finally {
    window.clearTimeout(timeout);
  }
}

function getAuthError(result, fallback) {
  if (!result?.error) {
    return null;
  }

  return new Error(result.error.message || result.error.statusText || fallback);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const persistSession = useCallback(async (nextUser) => {
    const nextToken = await getServerToken(nextUser);
    setUser(nextUser);
    setToken(nextToken);
    saveProfileCache(nextUser);
    localStorage.setItem(sessionKey, JSON.stringify({ user: nextUser, token: nextToken }));
    return nextUser;
  }, []);

  const refreshSession = useCallback(async ({ clearWhenEmpty = true } = {}) => {
    const result = await authClient.getSession();
    const nextAuthUser = result?.data?.user;

    if (!nextAuthUser?.email) {
      if (clearWhenEmpty) {
        setUser(null);
        setToken(null);
        localStorage.removeItem(sessionKey);
      }
      return null;
    }

    return persistSession(mapBetterAuthUser(nextAuthUser));
  }, [persistSession]);

  useEffect(() => {
    const saved = readJson(sessionKey, null);

    if (saved?.user && saved?.token) {
      setUser(saved.user);
      setToken(saved.token);
    }

    const readyFallback = window.setTimeout(() => {
      setAuthReady(true);
    }, 3000);

    refreshSession({ clearWhenEmpty: !saved?.user })
      .catch(() => {
        if (!saved?.user) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(sessionKey);
        }
      })
      .finally(() => {
        window.clearTimeout(readyFallback);
        setAuthReady(true);
      });

    return () => window.clearTimeout(readyFallback);
  }, [refreshSession]);

  const api = useMemo(() => ({
    user,
    token,
    authReady,
    async login(email, password) {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      const result = await authClient.signIn.email({ email, password });
      const error = getAuthError(result, "Login failed. Please check your email and password.");
      if (error) {
        throw error;
      }

      await refreshSession({ clearWhenEmpty: true });
    },
    async googleLogin() {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
      const error = getAuthError(result, "Google login failed. Check Better Auth Google credentials.");
      if (error) {
        throw error;
      }
    },
    async register({ name, email, photo, password }) {
      if (!name || !email || !password) {
        throw new Error("Name, email, and password are required.");
      }
      if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new Error("Password must be 6 characters with uppercase and lowercase letters.");
      }

      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: photo?.startsWith("http") ? photo : undefined,
      });
      const error = getAuthError(result, "Registration failed. Please try another email.");
      if (error) {
        throw error;
      }

      await persistSession({ name, email, photo });
    },
    async updateProfileData(profile) {
      const nextUser = { ...user, ...profile };

      if (authClient.updateUser) {
        await authClient.updateUser({
          name: nextUser.name,
          image: nextUser.photo?.startsWith("http") ? nextUser.photo : undefined,
        }).catch(() => null);
      }

      await persistSession(nextUser);
    },
    async logout() {
      await authClient.signOut().catch(() => null);
      setUser(null);
      setToken(null);
      localStorage.removeItem(sessionKey);
    },
  }), [authReady, persistSession, refreshSession, token, user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
