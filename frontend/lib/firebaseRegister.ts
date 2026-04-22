import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "moderator" | "admin" | "ceo";
  rating: number;
}

export type RegisterStep =
  | "idle"
  | "creating_account"
  | "saving_profile"
  | "done"
  | "error";

const googleProvider = new GoogleAuthProvider();

// ── Сохранить профиль локально как запасной вариант ──────────────────────────
function cacheProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`cq_profile_${profile.uid}`, JSON.stringify(profile));
  }
}

function getCachedProfile(uid: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`cq_profile_${uid}`);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

// ── Записать профиль в Firestore ─────────────────────────────────────────────
async function saveToFirestore(profile: UserProfile) {
  try {
    await setDoc(doc(db, "users", profile.uid), {
      ...profile,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore write failed, cached locally:", err);
    cacheProfile(profile);
  }
}

// ── Получить профиль из Firestore или кэша ──────────────────────────────────
async function fetchProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return snap.data() as UserProfile;
  } catch {
    // Firestore unavailable
  }
  return getCachedProfile(uid);
}

// ── Регистрация через email/password ─────────────────────────────────────────
export async function registerUser(
  data: RegisterData,
  onStep?: (step: RegisterStep) => void
): Promise<UserProfile> {
  onStep?.("creating_account");

  const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const user = credential.user;

  try {
    await updateProfile(user, { displayName: data.name });
  } catch {}

  onStep?.("saving_profile");

  const profile: UserProfile = {
    uid: user.uid,
    name: data.name,
    email: data.email,
    avatar: "",
    role: "user",
    rating: 1000,
  };

  await saveToFirestore(profile);
  onStep?.("done");
  return profile;
}

// ── Вход через email/password ─────────────────────────────────────────────────
export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  const profile = await fetchProfile(uid);
  if (profile) return profile;

  // Профиль не найден — создаём из Auth данных
  const fbUser = credential.user;
  const newProfile: UserProfile = {
    uid,
    name: fbUser.displayName ?? email.split("@")[0],
    email: fbUser.email ?? email,
    avatar: fbUser.photoURL ?? "",
    role: "user",
    rating: 1000,
  };
  await saveToFirestore(newProfile);
  return newProfile;
}

function isMobile() {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

// ── Вход через Google ─────────────────────────────────────────────────────────
export async function loginWithGoogle(): Promise<UserProfile | null> {
  if (isMobile()) {
    await signInWithRedirect(auth, googleProvider);
    return null; // redirect — страница перезагрузится
  }
  const credential = await signInWithPopup(auth, googleProvider);
  return buildGoogleProfile(credential.user);
}

export async function getGoogleRedirectResult(): Promise<UserProfile | null> {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return buildGoogleProfile(result.user);
}

async function buildGoogleProfile(user: FirebaseUser): Promise<UserProfile> {
  const existing = await fetchProfile(user.uid);
  if (existing) return existing;

  const profile: UserProfile = {
    uid: user.uid,
    name: user.displayName ?? user.email?.split("@")[0] ?? "Player",
    email: user.email ?? "",
    avatar: user.photoURL ?? "",
    role: "user",
    rating: 1000,
  };
  await saveToFirestore(profile);
  return profile;
}

// ── Выход ─────────────────────────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
