"use client";
import React, { useState } from 'react';
import TwitterLogo from './Twitterlogo';
import { Button } from './ui/button';
import Authmodel from './Authmodel';
import { useAuth } from '../context/AuthContext';
import Feed from './Feed';

export default function LandingPage() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
    const { user, logout, googlesignin } = useAuth();

    const openAuthModal = (mode: 'login' | 'signup') => {
        setAuthMode(mode)
        setShowAuthModal(true);
    };

    if(user) {
        return <Feed />
    }

    return (
        <div className='min-h-screen bg-black text-white flex'>
            <div className='flex flex-1 items-center justify-center'>
                <TwitterLogo className="text-white h-80 w-80" />
            </div>

            {/* <div>
                <TwitterLogo />
            </div> */}

            <div className='flex flex-1 flex-col justify-center space-y-12'>
                <div>
                    <h1 className='text-5xl lg:text-6xl font-bold mb-8 leading-tight'>
                        Happening now
                    </h1>
                    <h2 className='text-2xl lg:text-3xl font-bold mb-8'>
                        Join today.
                    </h2>
                </div>

                <div className='space-y-4 max-w-xs'>
                    <Button
                        variant="outline"
                        className="w-full py-3 rounded-full border-gray-600 bg-black text-white font-semibold text-base h-12 flex items-center justify-center"
                        onClick={() => googlesignin()}
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 11.989h10.56c.06.35.1.78.1 1.31 0 4.39-2.94 7.52-7.36 7.52-4.28 0-7.74-3.44-7.74-7.71s3.46-7.71 7.74-7.71c2.09 0 3.84.77 5.09 2.04l-2.08 2.01c-.56-.54-1.53-1.15-3.01-1.15-2.58 0-4.69 2.12-4.69 4.71s2.11 4.71 4.69 4.71c2.99 0 3.9-2.14 4.06-3.24H12v-3.58z" />
                        </svg>
                        Sign Up with Google
                    </Button>

                    <Button
                        variant="outline"
                        className='w-full py-3 rounded-full border-gray-600 bg-black text-white font-semibold text-base h-12'
                        onClick={() => googlesignin()}
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path d="M16.365 1.43c0 1.14-.414 2.06-1.242 2.76-.83.69-1.74 1.07-2.73 1-.06-.14-.1-.31-.12-.51-.02-.2-.03-.36-.03-.51 0-1.1.4-2.04 1.21-2.82.81-.78 1.74-1.18 2.79-1.21.02.13.04.31.06.52.03.21.04.39.04.55zM20.07 17.57c-.28.64-.62 1.23-1.02 1.78-.53.74-1.08 1.48-1.64 2.22-.66.82-1.3 1.39-1.91 1.71-.78.38-1.62.4-2.51.06-.54-.2-1.03-.33-1.47-.38-.46-.05-.97.03-1.53.23-.62.23-1.19.35-1.69.35-.62-.01-1.23-.2-1.82-.57-.59-.38-1.2-.98-1.85-1.82-.8-1.04-1.46-2.25-1.97-3.64C2.5 15.93 2.24 14.8 2.24 13.7c0-1.3.28-2.43.83-3.39.52-.92 1.22-1.67 2.11-2.23.88-.57 1.82-.86 2.81-.88.55 0 1.27.15 2.16.46.88.31 1.45.47 1.7.47.18 0 .76-.18 1.75-.53.94-.33 1.74-.47 2.39-.43 1.77.14 3.11.89 4.03 2.26-1.6 1.03-2.4 2.48-2.4 4.34 0 1.39.52 2.55 1.55 3.47-.13.29-.27.58-.43.88z" />
                        </svg>
                        Sign Up with Apple
                    </Button>

                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t border-gray-600' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-black px-2 text-gray-400'>or</span>
                        </div>
                    </div>

                    <Button
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full text-base h-12'
                        onClick={() => openAuthModal("signup")}
                    >
                        Create Account
                    </Button>

                    <p className='text-xs text-gray-400 leading-relaxed'>
                        By signing up, you agree to the{" "}
                        <a href='#' className='text-blue-400 hover:underline'>
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className='text-blue-400 hover:underline'>
                            Privacy Policy
                        </a>
                        , including{" "}
                        <a href="#" className='text-blue-400 hover:underline'>
                            Cookie Use
                        </a>
                        .
                    </p>

                    <div>
                        <p className='text-gray-400 mb-2'>Already have an account?</p>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-full border-gray-600 text-blue-400 font-semibold text-base hover:bg-[#15202B] transition"
                            onClick={() => openAuthModal("login")}
                        >
                            Log in
                        </Button>
                    </div>
                </div>
            </div>

            <Authmodel
                isopen={showAuthModal}
                onclose={() => setShowAuthModal(false)}
                initialmode={authMode}
            />
        </div>
    );
}
