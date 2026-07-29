/**
 * Anti-Gravity AI Platform - Firebase Configuration & Initialization
 */

const firebaseConfig = {
  apiKey: "AIzaSyC7HvsW78qlV1JDA0q28TCaPm4veK4cOPI",
  authDomain: "ai-base-resume-8f9de.firebaseapp.com",
  projectId: "ai-base-resume-8f9de",
  storageBucket: "ai-base-resume-8f9de.firebasestorage.app",
  messagingSenderId: "849157977517",
  appId: "1:849157977517:web:0ca75c1980090e78959d24"
};

if (typeof window !== 'undefined') {
  window.FIREBASE_CONFIG = firebaseConfig;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
}
