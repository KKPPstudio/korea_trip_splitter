import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: 請將下方的設定替換為您在 Firebase Console 取得的內容
// 1. 到 https://console.firebase.google.com/ 建立專案
// 2. 新增 Web App
// 3. 複製 firebaseConfig 物件的內容貼到下方
const firebaseConfig = {
  apiKey: "AIzaSyCKs1kbkrr-pYaFcN-TdilYL-EYfKm0JmY",
  authDomain: "korean-revenue-sharing-app.firebaseapp.com",
  projectId: "korean-revenue-sharing-app",
  storageBucket: "korean-revenue-sharing-app.firebasestorage.app",
  messagingSenderId: "792858487467",
  appId: "1:792858487467:web:620487117c3b34fcfc25ee",
  measurementId: "G-YPWDSM0G39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);