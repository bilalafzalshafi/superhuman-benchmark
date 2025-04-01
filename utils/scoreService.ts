export interface Score {
    game: string;
    score: number;
    date: string;
    metric: string;
  }
  
  // Save a new score
  export const saveScore = (game: string, score: number, metric: string = '') => {
    try {
      // Create the score object
      const scoreObj: Score = {
        game,
        score,
        date: new Date().toISOString(),
        metric
      };
      
      // Get existing scores
      const existingScoresJSON = localStorage.getItem('superhuman-scores');
      const existingScores: Score[] = existingScoresJSON ? JSON.parse(existingScoresJSON) : [];
      
      // Add new score
      existingScores.push(scoreObj);
      
      // Save back to localStorage
      localStorage.setItem('superhuman-scores', JSON.stringify(existingScores));
      
      return true;
    } catch (error) {
      console.error('Failed to save score:', error);
      return false;
    }
  };
  
  // Get all scores
  export const getAllScores = (): Score[] => {
    try {
      const scoresJSON = localStorage.getItem('superhuman-scores');
      return scoresJSON ? JSON.parse(scoresJSON) : [];
    } catch (error) {
      console.error('Failed to get scores:', error);
      return [];
    }
  };
  
  // Get scores for a specific game
  export const getGameScores = (game: string): Score[] => {
    try {
      const allScores = getAllScores();
      return allScores.filter(score => score.game === game);
    } catch (error) {
      console.error('Failed to get game scores:', error);
      return [];
    }
  };
  
  // Get best score for a game
  export const getBestScore = (game: string): Score | null => {
    try {
      const gameScores = getGameScores(game);
      
      if (gameScores.length === 0) return null;
      
      // Sort based on the game type (some games lower is better, others higher is better)
      if (game === 'Reaction Time') {
        // For reaction time, lower is better
        return gameScores.sort((a, b) => a.score - b.score)[0];
      } else {
        // For other games, higher is better
        return gameScores.sort((a, b) => b.score - a.score)[0];
      }
    } catch (error) {
      console.error('Failed to get best score:', error);
      return null;
    }
  };
  
  // Clear all scores
  export const clearAllScores = (): boolean => {
    try {
      localStorage.removeItem('superhuman-scores');
      return true;
    } catch (error) {
      console.error('Failed to clear scores:', error);
      return false;
    }
  };