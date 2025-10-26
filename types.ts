export interface MatchFixture {
  matchDetails: string;
  dateLocation: string;
}

export interface Prediction {
  predictedOutcome: string;
  predictedScore: string;
  winProbability: {
    teamA: number;
    draw: number;
    teamB: number;
  };
  confidenceLevel: number;
  keyFactors: string[];
  futureOutlook: string;
}

export interface MatchWithPrediction extends MatchFixture {
    sport: string;
    prediction: Prediction | null;
    isLoading: boolean;
    error?: string;
}
