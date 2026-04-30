import { db } from "./firebase";
import {
  doc, setDoc, deleteDoc, collection,
  onSnapshot, type Unsubscribe,
} from "firebase/firestore";

// Strip blob: URLs (temporary, not serializable) and very large data: URIs (> 700KB)
// Small base64 images (logos) are kept so they sync to all users
function cleanData(val: unknown): unknown {
  if (typeof val === "string") {
    if (val.startsWith("blob:")) return "";
    if (val.startsWith("data:") && val.length > 716800) return ""; // > 700KB — слишком большой для Firestore
    return val;
  }
  if (Array.isArray(val)) return val.map(cleanData);
  if (val && typeof val === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      out[k] = cleanData(v);
    }
    return out;
  }
  return val;
}

/** Save a single settings document to config/{key} */
export async function saveConfig(key: string, data: object): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await setDoc(doc(db, "config", key), cleanData(data) as object);
  } catch (e) {
    console.warn("saveConfig failed:", key, e);
  }
}

/** Save / overwrite a document in a named collection */
export async function saveItem(collName: string, id: string, data: object): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await setDoc(doc(db, collName, id), cleanData(data) as object);
  } catch (e) {
    console.warn("saveItem failed:", collName, id, e);
  }
}

/** Delete a document from a named collection */
export async function deleteItem(collName: string, id: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await deleteDoc(doc(db, collName, id));
  } catch (e) {
    console.warn("deleteItem failed:", collName, id, e);
  }
}

/** Subscribe to a single config doc */
export function subscribeConfig(
  key: string,
  cb: (data: Record<string, unknown> | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "config", key),
    (snap) => { cb(snap.exists() ? (snap.data() as Record<string, unknown>) : null); },
    (err) => { console.error(`[Firestore] config/${key} read failed: ${err.code} — проверь правила Firestore`); }
  );
}

/** Subscribe to an entire collection, emitting the full array on every change */
export function subscribeCollection<T extends { id: string }>(
  collName: string,
  cb: (items: T[]) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, collName),
    (snap) => { cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as T))); },
    (err) => { console.error(`[Firestore] collection/${collName} read failed: ${err.code} — проверь правила Firestore`); }
  );
}
