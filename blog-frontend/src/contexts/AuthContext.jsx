import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase.js';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword } from 'firebase/auth';

/* The Context Object */
const AuthContext = React.createContext();

/* Return Context Value */
export function useAuth() {
  return useContext(AuthContext);
}

/* Application Top-Level Component */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  /* Auth State Change */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /* Sign Up */
  async function signup(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error(e);
    }
  }

  /* Log In */
  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.error(e);
    }
  }

  /* Log Out */
  async function logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }

  /* Reset Password */
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.error(e);
    }
  }
  
  /* Update Email */
  async function updateUserEmail(email) {
    try {
      await updateEmail(currentUser, email);
    } catch (e) {
      console.error(e);
    }
  }

  /* Update Password */
  async function updateUserPassword(password) {
    try {
      await updatePassword(currentUser, password);
    } catch (e) {
      console.error(e);
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserEmail,
    updatePassword,
  };

  return (
    /* Provide Context Value + Wrap App In Context */
    <AuthContext.Provider value={value}>
      {/* Don't render children if auth is loading */}
      { !loading && children }
    </AuthContext.Provider>
  );
  
}
