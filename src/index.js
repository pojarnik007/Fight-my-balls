import "./style.css";
import p5 from "p5";
import { preload, setup, draw , setPlayers } from "./game.js";
import { startbg, initPlayers} from "./game.js";
import { resetState, state } from "./state.js";

const player1Stat = document.getElementById("player1Stat");
const player2Stat = document.getElementById("player2Stat");

let pInstance;

const sketch = (p) => {
  p.preload = () => preload(p);

  p.setup = () => {
    setup(p);
  };

  p.draw = () => {
    if (startButton.clicked) {
      draw(p, player1Stat, player2Stat);
    }
  };

  // 👇 обработчик кликов ДОЛЖЕН быть здесь
  p.mousePressed = () => {
    if (!startButton.clicked) {
      // меню выбора (если нужно)
    } else if (state.gameOver) {
      // Menu
      if (
        p.mouseX > endButtons.menu.x && p.mouseX < endButtons.menu.x + endButtons.menu.w &&
        p.mouseY > endButtons.menu.y && p.mouseY < endButtons.menu.y + endButtons.menu.h
      ) {
          startButton.clicked = false;
          resetState();

          // прячем надписи боя
          document.getElementById("fight-title").style.display = "none";
          document.getElementById("special1").style.display = "none";
          document.getElementById("special2").style.display = "none";

          // 👇 возвращаем меню выбора персонажей
          document.getElementById("menu-screen").style.display = "block";
          document.getElementById("game-wrapper").style.display = "none";
        }

      

      // Retry
      if (
        p.mouseX > endButtons.retry.x && p.mouseX < endButtons.retry.x + endButtons.retry.w &&
        p.mouseY > endButtons.retry.y && p.mouseY < endButtons.retry.y + endButtons.retry.h
      ) {
        state.gameOver = false;
        initPlayers(p); // заново запускаем бой
      }
    }
  };

  pInstance = p;
};


new p5(sketch);

let startButton = {
  x: 150,
  y: 20,
  w: 300,
  h: 80,
  text: "Start Fight",
  clicked: false
};

let endButtons = {
  menu: { x: 100, y: 500, w: 180, h: 60, text: "Menu" },
  retry: { x: 320, y: 500, w: 180, h: 60, text: "Retry" }
};

let selectedPlayer1 = "Thief";
let selectedPlayer2 = "Thief";

const characters = ["Thief", "Knight", "Mage", "Archer", "Spearman", "Samurai", "Viking", "Shielder", "Fighter", "Ninja", "Piper"];

function makeCharButtons(container, playerNum) {
  characters.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.classList.add("char-btn");
    btn.onclick = () => {
      if (playerNum === 1) selectedPlayer1 = c;
      else selectedPlayer2 = c;
      // подсветим выбранного
      [...container.children].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
    container.appendChild(btn);
  });
}

// генерим кнопки
makeCharButtons(document.getElementById("char-buttons-p1"), 1);
makeCharButtons(document.getElementById("char-buttons-p2"), 2);

// старт игры
document.getElementById("start-btn").onclick = () => {
  document.getElementById("menu-screen").style.display = "none";
  document.getElementById("game-wrapper").style.display = "block";
     setPlayers(selectedPlayer1, selectedPlayer2);
    initPlayers(pInstance);
    startButton.clicked = true;
        const title = document.getElementById("fight-title");
    title.style.display = "flex";
        const spec1 = document.getElementById("special1");
    spec1.style.display = "inline-block";
        const spec2 = document.getElementById("special2");
    spec2.style.display = "inline-block";
};


export function drawEndButtons(p) {
  drawButton(p, endButtons.menu);
  drawButton(p, endButtons.retry);
}


// универсальная функция для обычных кнопок
function drawButton(p, btn) {
  p.fill(214, 178, 93);         // основной цвет кнопки
  p.stroke(194, 148, 93);       // цвет границы
  p.strokeWeight(3);
  p.rect(btn.x, btn.y, btn.w, btn.h, 20);

  p.textFont('Delicious Handrawn');
  p.textSize(32);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(250, 250, 50);   // текст
  p.noStroke();
  p.text(btn.text, btn.x + btn.w/2, btn.y + btn.h/2);

  // эффект при наведении мыши
  if (
    p.mouseX > btn.x && p.mouseX < btn.x + btn.w &&
    p.mouseY > btn.y && p.mouseY < btn.y + btn.h
  ) {
    p.noFill();
    p.stroke(255, 255, 0);
    p.strokeWeight(4);
    p.rect(btn.x, btn.y, btn.w, btn.h, 20);
  }
}