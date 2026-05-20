"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, hasFirebaseConfig } from "../lib/firebase.js";

const AuthContext = createContext(null);
const sessionKey = "ideavault-session";
const profilesKey = "ideavault-profiles";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function createDemoToken(email) {
  return `demo-jwt.${btoa(JSON.stringify({ email, issuedAt: Date.now() }))}.signature`;
}

function mapFirebaseUser(firebaseUser) {
  const savedProfiles = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(profilesKey) || "{}") : {};
  const savedProfile = savedProfiles[firebaseUser.email] || {};

  return {
    name: savedProfile.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "IdeaVault User",
    email: firebaseUser.email,
    photo: savedProfile.photo || firebaseUser.photoURL || "",
  };
}

function saveProfileCache(nextUser) {
  const profiles = JSON.parse(localStorage.getItem(profilesKey) || "{}");
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const firebaseReady = hasFirebaseConfig();

  useEffect(() => {
    const saved = localStorage.getItem(sessionKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
      setToken(parsed.token);
      setAuthReady(true);
    }

    if (!firebaseReady || !auth) {
      setAuthReady(true);
      return undefined;
    }

    const readyFallback = window.setTimeout(() => {
      setAuthReady(true);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        if (!saved) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(sessionKey);
        }
        setAuthReady(true);
        window.clearTimeout(readyFallback);
        return;
      }

      const nextUser = mapFirebaseUser(firebaseUser);
      const nextToken = await getServerToken(nextUser);
      setUser(nextUser);
      setToken(nextToken);
      localStorage.setItem(sessionKey, JSON.stringify({ user: nextUser, token: nextToken }));
      setAuthReady(true);
      window.clearTimeout(readyFallback);
    });

    return () => {
      window.clearTimeout(readyFallback);
      unsubscribe();
    };
  }, [firebaseReady]);

  const persistDemoSession = async (nextUser) => {
    const nextToken = await getServerToken(nextUser);
    setUser(nextUser);
    setToken(nextToken);
    saveProfileCache(nextUser);
    localStorage.setItem(sessionKey, JSON.stringify({ user: nextUser, token: nextToken }));
  };

  const api = useMemo(() => ({
    user,
    token,
    authReady,
    firebaseReady,
    async login(email, password) {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      if (!firebaseReady || !auth) {
        await persistDemoSession({ name: email.split("@")[0] || "IdeaVault User", email, photo: "" });
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
    },
    async googleLogin() {
      if (!firebaseReady || !auth) {
        await persistDemoSession({ name: "Google Innovator", email: "google.user@ideavault.com", photo: "" });
        return;
      }

      await signInWithPopup(auth, googleProvider);
    },
    async register({ name, email, photo, password }) {
      if (!name || !email || !password) {
        throw new Error("Name, email, and password are required.");
      }
      if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new Error("Password must be 6 characters with uppercase and lowercase letters.");
      }

      if (!firebaseReady || !auth) {
        await persistDemoSession({ name, email, photo });
        return;
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, {
        displayName: name,
        photoURL: photo?.startsWith("http") ? photo : "",
      });
      const nextUser = { name, email, photo };
      const nextToken = await getServerToken(nextUser);
      setUser(nextUser);
      setToken(nextToken);
      saveProfileCache(nextUser);
      localStorage.setItem(sessionKey, JSON.stringify({ user: nextUser, token: nextToken }));
    },
    async updateProfileData(profile) {
      const nextUser = { ...user, ...profile };

      if (firebaseReady && auth?.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: nextUser.name,
          photoURL: nextUser.photo?.startsWith("http") ? nextUser.photo : "",
        });
      }

      await persistDemoSession(nextUser);
    },
    async logout() {
      if (firebaseReady && auth) {
        await signOut(auth);
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem(sessionKey);
    },
  }), [authReady, firebaseReady, token, user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
