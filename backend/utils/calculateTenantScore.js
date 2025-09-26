/**
 * Calculate tenant application score (0-100)
 * @param {Object} app - application object
 * @returns {Number} score (0-100)
 */
export const calculateApplicationScore = (app) => {
  let score = 0;

  // --- 1. Fast Track Payment (40%) ---
  if (app.fastTrack?.paid) {
    score += 40;
  }

  // --- 2. Guarantors (35%) ---
  let guarantorScore = 0;
  const guarantorCount = app.guarantorPassportPhotos?.length || 0;

  if (guarantorCount >= 2) guarantorScore = 35;
  else if (guarantorCount === 1) guarantorScore = 18;

  // Relationship adjustment
  if (app.guarantor?.relationship) {
    const rel = app.guarantor.relationship.toLowerCase();
    if (rel === 'friend') guarantorScore -= 5;
    else if (rel === 'sibling') guarantorScore -= 3;
  }

  if (guarantorScore < 0) guarantorScore = 0;
  score += guarantorScore;

  // --- 3. Emergency Contact (25%) ---
  let emergencyScore = 0;
  if (app.emergencyContact && Object.keys(app.emergencyContact).length > 0) {
    emergencyScore = 25;

    const rel = app.emergencyContact.relationship?.toLowerCase();
    if (rel === 'friend') emergencyScore -= 5;
    else if (rel === 'sibling') emergencyScore -= 3;
  }

  if (emergencyScore < 0) emergencyScore = 0;
  score += emergencyScore;

  // --- Clamp score to 0-100 ---
  score = Math.min(100, Math.max(0, score));

  return score;
};
