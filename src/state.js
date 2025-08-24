export const state = {
  hp1: 100,
  hp2: 100,
  gameOver: false,
  winner: ""
};

export function resetState() {
  state.hp1 = 100;
  state.hp2 = 100;
  state.gameOver = false;
  state.winner = "";
}
