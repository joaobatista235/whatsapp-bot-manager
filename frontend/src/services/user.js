import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Salvar ou atualizar informações do login no Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        email: user.email,
        lastLogin: serverTimestamp(), // Timestamp do último login
        isLoggedIn: true, // Estado atual
      },
      { merge: true }
    ); // 'merge' evita sobrescrever dados existentes

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is currently logged in");

    // Atualizar informações de logout no Firestore
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      lastLogout: serverTimestamp(), // Timestamp do logout
      isLoggedIn: false, // Atualiza o estado
    });

    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};
