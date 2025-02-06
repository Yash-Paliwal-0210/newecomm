import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../Firebase/Config";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDoc, doc, setDoc } from "firebase/firestore";  // Import Firestore methods
import { db } from "../Firebase/Config";  

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const provider = new GoogleAuthProvider();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigateTo("/");
    }
  }, [isLoggedIn, navigateTo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        login.email,
        login.password
      );
      const user = userCredential.user;
      toast.success("Login successful!");
      setLoading(false);
      navigateTo("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.code === "auth/wrong-password"
          ? "Incorrect password. Please try again."
          : error.code === "auth/user-not-found"
          ? "User not found. Please sign up first."
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Reference to the user document in Firestore
      const userRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        // User doesn't exist, add them to Firestore
        await setDoc(userRef, {
          uid: user.uid,
          username: user.displayName,
          email: user.email,
        //   gender: register.gender,
        //  age: register.age,
         orders: [],
          photoURL: user.photoURL || "",
          createdAt: new Date().toLocaleString(),
        Role: "user",

        });
  
        toast.success("Account created successfully!");
      } else {
        toast.success("Login successful!");
      }
  
      setLoading(false);
      navigateTo("/"); // Redirect to homepage or dashboard
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Unable to login with Google. Please try again.");
      setLoading(false);
    }
  };
  

  return (
    <>
      <ToastContainer />
      <section className="bg-blue-200 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
          {/* Left Section (Welcome Message) */}
          <div
            className="md:w-1/2 hidden md:flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: "url(https://picsum.photos/800/600?random=7)",
            }}
          >
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold">Welcome Back!</h2>
              <p className="mt-2">Sign in to continue to your account.</p>
            </div>
          </div>
          {/* Right Section (Login Form) */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <form className="mt-6" onSubmit={handleLogin}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="name@company.com"
                  required
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                />
              </div>
              {/* Password Field */}
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                  required
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                />
              </div>
              {/* Login Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-700 hover:bg-green-800"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
              {/* Google Login Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in with Google"}
                </button>
              </div>
              {/* Reset Password Link */}
              <div className="mt-4 text-center">
                <Link
                  to="/auth/Reset"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              {/* Sign-Up Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don’t have an account yet?{" "}
                <Link
                  to="/auth/SignUp"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
