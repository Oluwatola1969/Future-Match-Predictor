import React, { useState, useCallback } from 'react';
import { MatchWithPrediction } from './types';
import { getUpcomingMatches, getMatchPrediction } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PredictionCard from './components/PredictionCard';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [league, setLeague] = useState<string>('English Premier League');
  const [predictions, setPredictions] = useState<MatchWithPrediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [noMatchesFound, setNoMatchesFound] = useState<boolean>(false);

  const handleFetchAndPredict = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPredictions([]);
    setNoMatchesFound(false);

    try {
      const matches = await getUpcomingMatches(league);
      
      if (matches.length === 0) {
        setNoMatchesFound(true);
        setIsLoading(false);
        return;
      }
      
      const initialPredictions: MatchWithPrediction[] = matches.map(m => ({
        ...m,
        sport: league,
        prediction: null,
        isLoading: true,
        error: undefined,
      }));
      setPredictions(initialPredictions);
      setIsLoading(false);

      matches.forEach(async (match, index) => {
        try {
          const predictionResult = await getMatchPrediction(match, league);
          setPredictions(prev => {
            const newPredictions = [...prev];
            if (newPredictions[index]) {
                newPredictions[index] = { ...newPredictions[index], prediction: predictionResult, isLoading: false };
            }
            return newPredictions;
          });
        } catch (e) {
          setPredictions(prev => {
            const newPredictions = [...prev];
            if (newPredictions[index]) {
                newPredictions[index] = { ...newPredictions[index], error: e instanceof Error ? e.message : String(e), isLoading: false };
            }
            return newPredictions;
          });
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsLoading(false);
    }
  }, [league]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 mt-8">
          <div className="lg:col-span-1">
            <InputForm 
              league={league}
              setLeague={setLeague}
              onSubmit={handleFetchAndPredict}
              isLoading={isLoading}
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:col-span-2">
             {isLoading && (
              <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg p-8">
                <Loader />
                <p className="mt-4 text-lg text-slate-300">Fetching upcoming matches...</p>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg p-8">
                <div className="text-center">
                  <p className="text-red-400 text-xl font-semibold">Failed to Fetch Matches</p>
                  <p className="text-slate-400 mt-2">{error}</p>
                </div>
              </div>
            )}
            {!isLoading && !error && (
                predictions.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {predictions.map((item, index) => (
                            <PredictionCard key={index} item={item} />
                        ))}
                    </div>
                ) : (
                <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg p-8 text-center border-2 border-dashed border-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="mt-4 text-xl font-semibold text-slate-300">
                    {noMatchesFound ? "No Matches Found" : "Awaiting League Selection"}
                  </h3>
                  <p className="mt-2 text-slate-500">
                     {noMatchesFound ? `Could not find any upcoming matches for "${league}" this week.` : "Enter a league and click 'Fetch & Predict' to see the forecasts."}
                  </p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
