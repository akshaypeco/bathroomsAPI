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
  setDoc,
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

export async function addUser(uid) {
  const userEntry = {
    username: "",
    uid: uid,
  };
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userEntry);
}

export async function addUsername(uid, username) {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists() || !userSnapshot.data().username) {
    const userEntry = {
      username: username,
      uid: uid,
    };
    await setDoc(userRef, userEntry);
  }
}

export async function submitIssue(uid, issue) {
  const uid_issue = { uid: uid, issue: issue };
  const issuesCollectionRef = collection(db, "issues"); // Reference to the "issues" collection
  await addDoc(issuesCollectionRef, uid_issue); // Automatically generates a document ID
}

export async function getUser(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      // Handle the user data here
      return userData;
    } else {
      // Document does not exist
      console.log("User document does not exist");
    }
  } catch (error) {
    // Handle any errors that occur during the fetching process
    console.error("Error fetching user document:", error);
  }
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

export default app;
