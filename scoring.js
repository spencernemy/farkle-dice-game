export function calculateScoring(counts) {
    let score = 0;

    // Straight
    if (counts.every(c => c === 1)) return 1500;
    // 6 of a kind
    if (counts.filter(c => c === 6).length > 0) return 3000;
    // Three pairs
    if (counts.filter(c => c === 2).length === 3) return 1500;
    // Two triplets
    if (counts.filter(c => c === 3).length === 2) return 2500;

    for (let i = 0; i < 6; i++) {
        if (counts[i] === 5) { score += 2000; counts[i] = 0; }
        else if (counts[i] === 4) { score += 1000; counts[i] = 0; }
        else if (counts[i] === 3) { 
            if (i === 0) { score += 1000; }
            else {
                score += 100 * (i + 1);
            }
            counts[i] = 0;
        }
    }

    score += counts[0] * 100; counts[0] = 0;
    score += counts[4] * 50; counts[4] = 0;

    // If leftover values after scoring (dice selected that are invalid/no impact on score)
    if (counts.filter(c => c > 0).length > 0) {
        score = 0;
    }

    return score;
}

export function isFarkle(newRolls) {
    const counts = [0,0,0,0,0,0];
    for (const die of newRolls) counts[die - 1]++;

    // Includes any 1s or 5s
    if (counts[0] > 0 || counts[4] > 0) return false;

    // Three (or more) of a kind
    if (counts.filter(c => c >= 3).length > 0) return false;

    // Straight
    if (counts.every(c => c === 1)) return false;

    // Three pairs - if there are 3 sets of 2 of the same value
    if (counts.filter(c => c === 2).length === 3) return false;

    // Two triplets - if there are 2 sets of 3 of the same value
    if (counts.filter(c => c === 3).length === 2) return false;

    return true;
}
