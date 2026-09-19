import React from 'react';
import { Flower2, Sparkles } from 'lucide-react';

interface YarnTitleAnimationProps {
  storeName: string;
  tagline: string;
  onCategoryReset?: () => void;
}

export const YarnTitleAnimation: React.FC<YarnTitleAnimationProps> = ({
  storeName,
  tagline,
  onCategoryReset
}) => {
  const titleLetters = storeName.split('');

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center py-1 px-6 cursor-pointer select-none group"
      onClick={() => {
        if (onCategoryReset) onCategoryReset();
      }}
      title="The Cozy Loop"
    >
      {/* Animated Wavy Yarn Thread Background */}
      <div className="absolute inset-0 pointer-events-none overflow-visible z-0 flex items-center justify-center">
        <svg
          className="w-[calc(100%+160px)] h-[calc(100%+24px)] overflow-visible"
          viewBox="0 0 600 60"
          fill="none"
        >
          <defs>
            {/* LIGHT MODE - DARK THREAD */}
            <linearGradient
              id="titleWaveLight"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#3f2924"
                stopOpacity="0.85"
              />
              <stop
                offset="50%"
                stopColor="#5b3b35"
                stopOpacity="0.95"
              />
              <stop
                offset="100%"
                stopColor="#8a5a2b"
                stopOpacity="0.85"
              />
            </linearGradient>

            <linearGradient
              id="titleWaveLightReverse"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#8a5a2b"
                stopOpacity="0.85"
              />
              <stop
                offset="50%"
                stopColor="#5b3b35"
                stopOpacity="0.95"
              />
              <stop
                offset="100%"
                stopColor="#3f2924"
                stopOpacity="0.85"
              />
            </linearGradient>

            {/* DARK MODE - BRIGHT THREAD */}
            <linearGradient
              id="titleWaveDark"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#fb7185"
                stopOpacity="0.8"
              />
              <stop
                offset="50%"
                stopColor="#f472b6"
                stopOpacity="0.95"
              />
              <stop
                offset="100%"
                stopColor="#fbbf24"
                stopOpacity="0.85"
              />
            </linearGradient>

            <linearGradient
              id="titleWaveDarkReverse"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#fbbf24"
                stopOpacity="0.85"
              />
              <stop
                offset="50%"
                stopColor="#c084fc"
                stopOpacity="0.95"
              />
              <stop
                offset="100%"
                stopColor="#fb7185"
                stopOpacity="0.8"
              />
            </linearGradient>
          </defs>

          {/* ========================= */}
          {/* LIGHT MODE THREADS         */}
          {/* ========================= */}

          <path
            d="M 0,30 C 150,5 250,55 400,30 T 600,30"
            stroke="url(#titleWaveLight)"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            className="yarn-thread-wave-left"
          />

          <path
            d="M 600,30 C 450,55 350,5 200,30 T 0,30"
            stroke="url(#titleWaveLightReverse)"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            className="yarn-thread-wave-right"
          />

          {/* ========================= */}
          {/* DARK MODE THREADS          */}
          {/* ========================= */}

          <path
            d="M 0,30 C 150,5 250,55 400,30 T 600,30"
            stroke="url(#titleWaveDark)"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            className="yarn-thread-wave-left dark-thread"
          />

          <path
            d="M 600,30 C 450,55 350,5 200,30 T 0,30"
            stroke="url(#titleWaveDarkReverse)"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            className="yarn-thread-wave-right dark-thread"
          />

          {/* Stitch Nodes */}
          <circle
            cx="150"
            cy="18"
            r="3"
            className="yarn-stitch-light animate-ping"
          />

          <circle
            cx="450"
            cy="42"
            r="3"
            className="yarn-stitch-light animate-ping"
            style={{ animationDelay: '0.8s' }}
          />

          <circle
            cx="150"
            cy="18"
            r="3"
            className="yarn-stitch-dark animate-ping"
          />

          <circle
            cx="450"
            cy="42"
            r="3"
            className="yarn-stitch-dark animate-ping"
            style={{ animationDelay: '0.8s' }}
          />
        </svg>

        {/* Floating Craft Background Accents */}
        <span
          className="absolute -left-6 top-0 text-xs animate-bounce opacity-70 pointer-events-none"
          style={{ animationDuration: '3.2s' }}
        >
          🧶
        </span>

        <span
          className="absolute -right-6 top-0 text-xs animate-bounce opacity-70 pointer-events-none"
          style={{
            animationDuration: '3.8s',
            animationDelay: '0.5s'
          }}
        >
          🪡
        </span>

        <span
          className="absolute -left-8 bottom-0 text-xs animate-bounce opacity-60 pointer-events-none"
          style={{
            animationDuration: '4.2s',
            animationDelay: '1s'
          }}
        >
          🌸
        </span>

        <span
          className="absolute -right-8 bottom-0 text-xs animate-bounce opacity-60 pointer-events-none"
          style={{
            animationDuration: '4.5s',
            animationDelay: '1.5s'
          }}
        >
          ✨
        </span>
      </div>

      {/* Main Title */}
      <div className="relative z-10 flex items-center gap-2.5">

        {/* Flower Logo */}
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
          <Flower2 className="w-5 h-5 animate-spin-slow" />
        </div>

        {/* Title Text */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center text-stone-900 dark:text-stone-100">
          {titleLetters.map((char, i) => (
            <span
              key={i}
              className="inline-block transition-transform duration-300 group-hover:scale-110"
              style={{
                animation: 'yarnLetterLoop 3s ease-in-out infinite',
                animationDelay: `${i * 0.12}s`
              }}
            >
              {char === ' ' ? (
                <span className="w-1.5 sm:w-2 inline-block">
                  &nbsp;
                </span>
              ) : (
                <span className="font-black">
                  {char}
                </span>
              )}
            </span>
          ))}
        </h1>

        <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse hidden sm:inline-block" />
      </div>

      {/* Subtitle */}
      <p className="yarn-tagline relative z-10 text-[11px] font-bold tracking-wide mt-0.5 flex items-center gap-1.5 px-3 py-0.5 rounded-full shadow-xs backdrop-blur-md">
        <span
          className="animate-bounce"
          style={{ animationDuration: '2.5s' }}
        >
          🧶
        </span>

        <span className="yarn-tagline-text">
          {tagline}
        </span>

        <span className="animate-pulse">
          ✨
        </span>
      </p>
    </div>
  );
};