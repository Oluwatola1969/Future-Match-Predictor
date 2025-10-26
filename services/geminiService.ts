import { GoogleGenAI, Type } from "@google/genai";
import { MatchFixture, Prediction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-pro";

const predictionSchema = {
    type: Type.OBJECT,
    properties: {
      predictedOutcome: { type: Type.STRING, description: "The predicted outcome, e.g., 'Team A Win', 'Team B Win', 'Draw'" },
      predictedScore: { type: Type.STRING, description: "The most likely final score, e.g., '2-1'" },
      winProbability: {
        type: Type.OBJECT,
        properties: {
          teamA: { type: Type.NUMBER, description: "Winning probability for Team A (0-100)" },
          draw: { type: Type.NUMBER, description: "Probability of a draw (0-100)" },
          teamB: { type: Type.NUMBER, description: "Winning probability for Team B (0-100)" },
        },
        required: ["teamA", "draw", "teamB"]
      },
      confidenceLevel: { type: Type.NUMBER, description: "Confidence in the prediction (0-100)" },
      keyFactors: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of key factors influencing the prediction."
      },
      futureOutlook: { type: Type.STRING, description: "Projections for the teams' future performance based on this result." },
    },
    required: ["predictedOutcome", "predictedScore", "winProbability", "confidenceLevel", "keyFactors", "futureOutlook"]
};

const matchesSchema = {
    type: Type.OBJECT,
    properties: {
        matches: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    matchDetails: { type: Type.STRING, description: "Match details in 'Team A vs. Team B' format." },
                    dateLocation: { type: Type.STRING, description: "Date and location of the match." },
                },
                required: ["matchDetails", "dateLocation"],
            },
        },
    },
    required: ["matches"],
};


export async function getUpcomingMatches(league: string): Promise<MatchFixture[]> {
    const prompt = `Using Google Search, find the upcoming matches for the current week from livescore.com for the "${league}". Provide a list of matches including the full match details (e.g., 'Team A vs. Team B') and the date and location. If there are no matches, return an empty list.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json",
                responseSchema: matchesSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.matches || [];
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        throw new Error("Failed to fetch upcoming matches. The league might be misspelled or there are no upcoming games this week.");
    }
}


export async function getMatchPrediction(fixture: MatchFixture, league: string): Promise<Prediction> {
  const { matchDetails, dateLocation } = fixture;
  const [teamAName, teamBName] = matchDetails.split(' vs. ');

  const prompt = `
    You are an expert sports data analyst and predictive modeler. Your task is to predict the outcome of the following match:

    - Sport/League: ${league}
    - Match Details: ${matchDetails} (Team A: ${teamAName}, Team B: ${teamBName})
    - Date & Location: ${dateLocation}

    Use Google Search to find the latest available data on:
    - Recent Form for both teams (Last 5 matches).
    - Head-to-Head Record.
    - Known Injuries or Suspensions for key players.
    - Other contextual factors like team morale, stakes of the match, weather, etc.

    Based on your analysis of the searched data, perform the following tasks:
    1. Analyze the input data to identify key strengths, weaknesses, and trends for each team.
    2. Quantify winning probabilities for each possible outcome (Win/Draw/Loss). Ensure probabilities sum to 100.
    3. Provide a confidence level (0–100%) and explain what drives it through the key factors.
    4. Predict the most likely scoreline.
    5. Include a short summary describing your reasoning as part of the 'futureOutlook'.
    6. Generate projections for how both teams might perform in upcoming fixtures based on this result.

    Return the analysis in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const predictionResult = JSON.parse(jsonText);
    
    // Validate that probabilities sum to roughly 100
    const { teamA, draw, teamB } = predictionResult.winProbability;
    const totalProb = teamA + draw + teamB;
    if (Math.abs(totalProb - 100) > 2) { // Allow for small rounding errors
        console.warn(`Probabilities sum to ${totalProb}, not 100. Normalizing.`);
        predictionResult.winProbability.teamA = Math.round((teamA / totalProb) * 100);
        predictionResult.winProbability.teamB = Math.round((teamB / totalProb) * 100);
        predictionResult.winProbability.draw = 100 - predictionResult.winProbability.teamA - predictionResult.winProbability.teamB;
    }

    return predictionResult as Prediction;
  } catch (error) {
    console.error(`Error calling Gemini API for match ${matchDetails}:`, error);
    throw new Error(`Failed to get prediction for ${matchDetails}. The model may have been unable to find sufficient data.`);
  }
}