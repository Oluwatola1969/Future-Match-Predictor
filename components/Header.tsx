
import React from 'react';
import TrophyIcon from './icons/TrophyIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <TrophyIcon className="h-10 w-10 text-blue-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Match Predictor AI
        </h1>
      </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
        Leverage AI-driven analysis to forecast match outcomes, probabilities, and future performance trends.
      </p>
    </header>
  );
};

export default Header;
