import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, "\n");
    // Strip wrapping double quotes if any
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
  }

  console.log("BUILD TIME: Firebase Admin SDK check");
  console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
  console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
  console.log("PRIVATE_KEY defined:", !!process.env.FIREBASE_PRIVATE_KEY);
  console.log("PRIVATE_KEY length:", process.env.FIREBASE_PRIVATE_KEY?.length);

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed:", error);
  }
}

const db = getFirestore();
export { db };
