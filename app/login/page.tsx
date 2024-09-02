'use client'// pages/login.tsx
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
        <div className="corner-border p-[4px]">
        <div className="min-w-[80vw] sm:min-w-[400px] p-8 bg-gray-900/50 shadow-md">
            <div className="w-full max-w-md">
                <h2 className="text-center text-2xl font-extrabold text-sky-500 mb-10">
                    {isLogin ? "Sign in to your account" : "Create your account"}
                </h2>

                <div className="w-full bg-transparent text-gray-400 border-b-2 border-b-gray-400 flex gap-2 items-center mb-4 px-2 py-1 rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full outline-none"
                        />
                </div>
                <div className="w-full bg-transparent text-gray-400 border-b-2 border-b-gray-400 flex gap-2 items-center mb-4 px-2 py-1 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>   
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full outline-none"
                    />
                </div>
                <button
                    onClick={handleAuth}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                    {isLogin ? "Sign In" : "Sign Up"}
                </button>
                <div className="flex items-center justify-center my-1">
                    <span className="text-gray-400">or</span>
                </div>
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-blue-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                    <img src="/google.png" alt="" />
                    Continue with Google
                </button>
                <div className="text-center mt-2">
                <p className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-sky-500 hover:text-sky-600 focus:outline-none"
                    >
                    {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
                </div>
            </div>
        </div>
        </div>
    </div>

  )
    }
