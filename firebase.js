import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmNwysNvrrC4rwOnDbg8yw5qUl-aOLaA4",
  authDomain: "bathrooms-66a88.firebaseapp.com",
  projectId: "bathrooms-66a88",
  storageBucket: "bathrooms-66a88.appspot.com",
  messagingSenderId: "955747464824",
  appId: "1:955747464824:web:3f9b302f4339024eb99f8d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export async function submitReview(review) {
  const res = await addDoc(collection(db, "reviews"), review);
}

export async function getUserReviews(uid) {
  var res = [];
  const reviewsRef = collection(db, "reviews");
  const q = await query(reviewsRef, where("uid", "==", uid));

  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    res.push(doc.data());
  });

  return res;
}

export async function getBathroomReviews(id) {
  var res = [];
  const reviewsRef = collection(db, "reviews");
  const q = await query(reviewsRef, where("id", "==", id));

  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    res.push(doc.data());
  });

  return res;
}
// export async function getUserFavorites(uid) {
//   var res = [];
//   const reviewsRef = collection(db, "favorites");
//   const q = await query(reviewsRef, where("uid", "==", uid));

//   const snapshot = await getDocs(q);
//   snapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     res.push(doc.data());
//   });

//   return res;
// }

export default app;
