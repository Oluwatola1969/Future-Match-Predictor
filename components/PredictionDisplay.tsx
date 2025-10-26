import React from 'react';
import { Prediction } from '../types';

interface PredictionDisplayProps {
  prediction: Prediction;
  matchDetails: string;
}

const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (value / 100) * circumference;
    const color = value > 75 ? 'text-emerald-400' : value > 50 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="transform -rotate-90" width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" className="text-slate-700" fill="transparent" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-in-out ${color}`}
                />
            </svg>
            <span className={`absolute text-3xl font-bold ${color}`}>{value}%</span>
        </div>
    );
};

const ProbabilityBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-slate-300">{label}</span>
            <span className={`text-base font-medium ${color}`}>{value}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%`, transition: 'width 1s ease-in-out' }}></div>
        </div>
    </div>
);


const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, matchDetails }) => {
  const [teamAName, teamBName] = matchDetails.split(' vs. ');
  const { predictedOutcome, predictedScore, winProbability, confidenceLevel, keyFactors, futureOutlook } = prediction;

  return (
    <div className="animate-fade-in w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-center md:text-left">
                <p className="text-slate-400">Predicted Outcome</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{predictedOutcome}</p>
                <p className="text-slate-400 mt-2">Predicted Score</p>
                <p className="text-5xl font-bold text-white">{predictedScore}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-slate-400 mb-2">Confidence Level</p>
                <ConfidenceMeter value={confidenceLevel} />
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Win Probability</h3>
            <div className="space-y-4">
                <ProbabilityBar label={teamAName || 'Team A'} value={winProbability.teamA} color="text-blue-400" />
                <ProbabilityBar label="Draw" value={winProbability.draw} color="text-slate-400" />
                <ProbabilityBar label={teamBName || 'Team B'} value={winProbability.teamB} color="text-rose-400" />
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-3">Key Factors</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {keyFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                ))}
            </ul>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-3">Future Outlook</h3>
            <p className="text-slate-300 bg-slate-900/50 p-4 rounded-md border border-slate-700">{futureOutlook}</p>
        </div>
    </div>
  );
};

export default PredictionDisplay;
