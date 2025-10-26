import React from 'react';
import { MatchWithPrediction } from '../types';
import PredictionDisplay from './PredictionDisplay';
import Loader from './Loader';

interface PredictionCardProps {
  item: MatchWithPrediction;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ item }) => {
  const { matchDetails, dateLocation, prediction, isLoading, error } = item;

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 h-full flex flex-col animate-fade-in">
      <div className="border-b border-slate-700 pb-4 mb-4">
        <h3 className="text-xl font-bold text-white">{matchDetails}</h3>
        <p className="text-sm text-slate-400">{dateLocation}</p>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader />
            <p className="mt-4 text-slate-300">Running prediction model...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 font-semibold mt-3">Prediction Failed</p>
            <p className="text-slate-400 text-sm mt-1">{error}</p>
          </div>
        )}
        {prediction && (
          <PredictionDisplay prediction={prediction} matchDetails={matchDetails} />
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
