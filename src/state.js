export const state = {
  frame: 0,
  hp1: 100,
  hp2: 100,
  gameOver: false,
  winner: '',
  currentMode: "",
  currentBotBet: 0,
}

export function resetState() {
  state.frame = 0
  state.hp1 = 100
  state.hp2 = 100
  state.gameOver = false
  state.winner = ''
  state.currentMode = ""     
  state.currentBotBet = 0   
}

