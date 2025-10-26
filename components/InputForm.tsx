import React from 'react';

interface InputFormProps {
  league: string;
  setLeague: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const popularLeagues = [
  'English Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'UEFA Champions League',
  'NBA',
  'NFL',
  'MLB',
  'Cricket World Cup'
];


const InputForm: React.FC<InputFormProps> = ({ league, setLeague, onSubmit, isLoading }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-semibold text-white mb-2">Select League</h2>
      
      <div>
        <label htmlFor="league" className="block text-sm font-medium text-slate-300 mb-1">
          Choose a league from the list
        </label>
        <select 
            id="league" 
            name="league" 
            value={league} 
            onChange={(e) => setLeague(e.target.value)} 
            className="w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-no-repeat bg-right pr-8"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
            }}
        >
            {popularLeagues.map((l) => (
                <option key={l} value={l}>{l}</option>
            ))}
        </select>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isLoading || !league.trim()}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching Matches...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fetch & Predict Weekly Matches
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;