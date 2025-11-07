// Game state
export const state = {
    dice: [1,2,3,4,5,6],
    selected: [false, false, false, false, false, false],
    kept: [false, false, false, false, false, false],
    rolled: false,
    locked: true, // Dice selectable
    currentRoundScores: [],
    currentRoundTotalScore: 0,
    players: [
        {name: "Player 1", totalScore: 0, consecutiveFarkles: 0},
        {name: "Player 2", totalScore: 0, consecutiveFarkles: 0},
        {name: "Player 3", totalScore: 0, consecutiveFarkles: 0},
        {name: "Player 4", totalScore: 0, consecutiveFarkles: 0}
    ],
    currentPlayerIndex: 0
}

// UI elements
export const ui = {
    initialScreen: document.getElementById("initial-screen"),
    playerSelect: document.getElementById("player-amt-select"),
    playerNameForm: document.getElementById("player-name-form"),
    playerNameLabel: document.getElementById("player-name-label"),
    playerNameInput: document.getElementById("player-name-input"),
    nextBtn: document.getElementById("next"),
    gameScreen: document.getElementById("game-screen"),
    diceBtns: document.querySelectorAll(".dice"),
    rollBtn: document.getElementById("roll"),
    claimBtn: document.getElementById("claim"),
    endBtn: document.getElementById("end-turn"),
    //resetBtn: document.getElementById("reset"),
    currentPlayer: document.getElementById("current-player"),
    currentRoundScore: document.getElementById("current-round-score"),
    p1score: document.getElementById("player1-score"),
    p2score: document.getElementById("player2-score"),
    p3score: document.getElementById("player3-score"),
    p4score: document.getElementById("player4-score"),
    twoPlayers: document.getElementById("two-players"),
    threePlayers: document.getElementById("three-players"),
    fourPlayers: document.getElementById("four-players")
}

// Dice img URLs
export const DIE_URLS = [
    "assets/dice1.png",
    "assets/dice2.png",
    "assets/dice3.png",
    "assets/dice4.png",
    "assets/dice5.png", 
    "assets/dice6.png"
];
