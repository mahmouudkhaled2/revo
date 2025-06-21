/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// AuthProvider.jsx (تم تعديل signUp لدعم صورة Base64)
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { createContext, useContext, useEffect, useState } from "react";
  import { auth, db } from "../firebase-config";
  import { doc, setDoc } from "firebase/firestore";
  
  export const authContext = createContext(null);
  
  export default function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(
      localStorage.getItem("userToken") || null
    );
    const [currentUser, setCurrentUsers] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const signUp = async (name, email, password, userType = "user", image = null) => {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCred.user.uid;
  
      await setDoc(doc(db, "users", userId), {
        name,
        email,
        userType,
        image,
        createdAt: new Date(),
        likedPosts: [],
      });
    };
  
    const signIn = async (email, password) => {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (userCred.user.accessToken) {
        setUserToken(userCred.user.accessToken);
        localStorage.setItem("userToken", userCred.user.accessToken);
      }
    };
  
    const logout = async () => {
      await signOut(auth);
      localStorage.removeItem("userToken");
      setUserToken("");
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUsers(user);
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);
  
    return (
      <authContext.Provider
        value={{ userToken, setUserToken, currentUser, signUp, signIn, logout }}
      >
        {!loading && children}
      </authContext.Provider>
    );
  }
  
  export const useAuth = () => useContext(authContext);
  