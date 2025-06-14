/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";

export const authContext = createContext(null);

export default function AuthProvider ({children}) {

    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null);

    const [currentUser, setCurrentUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = async (name, email, password, userType = 'user') => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save user data to Firestore
        const userId = userCred.user.uid;
        await setDoc(doc(db, "users", userId), {
          name,
          email,
          userType,
          createdAt: new Date(),
          likedPosts: [], // Initialize empty array for liked posts
        });
    }

    const signIn = async (email, password) => {

        const userCred = await signInWithEmailAndPassword(auth, email, password);
        console.log("USER DATA: ", userCred.user.accessToken);
        if (userCred.user.accessToken) {
            setUserToken(userCred.user.accessToken);
            localStorage.setItem("userToken", userCred.user.accessToken)
        }
        
    }

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("userToken");
        setUserToken("");
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUsers(user);
            setLoading(false);
        } )

        return () => {
            unsubscribe();
        }
    }, [])

    return (
        <authContext.Provider value={{userToken, setUserToken, currentUser, signUp, signIn, logout}}>
            {!loading && children}
        </authContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(authContext);
}