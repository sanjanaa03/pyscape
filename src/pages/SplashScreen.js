import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../images/logo.png'; // your logo path
import BgImage from '../images/bg.png'; // AI/cell background image

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Logo with softer background */}
        <div
          className="p-3 rounded-full shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.6), rgba(59, 130, 246, 0.6))',
          }}
        >
          <img src={Logo} alt="PyScape Logo" className="w-20 h-20 rounded-full" />
        </div>

        {/* Title */}
        <h1
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-cyan-400 leading-tight"
          style={{ lineHeight: 1.1 }}
        >
          PyScape
        </h1>

        {/* Quote */}
        <p className="text-lg italic font-light text-gray-200 max-w-lg drop-shadow-md">
          "Escape the Ordinary, Code the Extraordinary."
        </p>

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/auth')}
          className="bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900 font-semibold px-12 py-3 rounded-lg shadow-lg hover:brightness-110 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
