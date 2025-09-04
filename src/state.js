export const state = {
  frame: 0,
  hp1: 100,
  hp2: 100,
  gameOver: false,
  winner: '',
  currentMode: "",
  currentBotBet: 0,
  currentFightBet: 0,
  currentBetCoef: 0,
  currentChoosenWinner: "",
}

export function resetState() {
  state.frame = 0
  state.hp1 = 100
  state.hp2 = 100
  state.gameOver = false
  state.winner = ''
  state.currentMode = ""     
  state.currentBotBet = 0   
  state.currentFightBet = 0
  state.currentBetCoef = 0
  state.currentChoosenWinner = ""
}

