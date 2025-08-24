import "./style.css";
import p5 from "p5";
import { preload, setup, draw , setPlayers } from "./game.js";
import { startbg, initPlayers} from "./game.js";
import { resetState, state } from "./state.js";

const player1Stat = document.getElementById("player1Stat");
const player2Stat = document.getElementById("player2Stat");

const sketch = (p) => {
  p.preload = () => {
  preload(p);
  };

  p.setup = () => {
    setup(p);
  };

  p.draw = () => {
    if (!startButton.clicked) {
      drawStartScreen(p); // показываем экран начала
    } else {
      draw(p, player1Stat, player2Stat); // обычный геймплей
    }
  };

  p.mousePressed = () => {
    mousePressedOnButton(p);
    p.mousePressed = () => {
  if (!startButton.clicked) {
    mousePressedOnButton(p); // выбор персонажей и старт
  } else if (state.gameOver) {
    // Menu
    if (
      p.mouseX > endButtons.menu.x && p.mouseX < endButtons.menu.x + endButtons.menu.w &&
      p.mouseY > endButtons.menu.y && p.mouseY < endButtons.menu.y + endButtons.menu.h
    ) {
      startButton.clicked = false;
      resetState();

      document.getElementById("fight-title").style.display = "none";
      document.getElementById("special1").style.display = "none";
      document.getElementById("special2").style.display = "none";
    }

    // Retry
    if (
      p.mouseX > endButtons.retry.x && p.mouseX < endButtons.retry.x + endButtons.retry.w &&
      p.mouseY > endButtons.retry.y && p.mouseY < endButtons.retry.y + endButtons.retry.h
    ) {
      state.gameOver = false;
      initPlayers(p); // заново с текущими персонажами
    }
  } else {
    mousePressedOnButton(p); // клик по игре
  }
};

  };
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

const characters = ["Thief", "Knight", "Mage", "Archer", "Spearman"];

function drawStartScreen(p) {
  p.background(0);
  p.image(startbg, 0, 0, p.width, p.height);

  // кнопка старта
  drawButton(p, startButton);

  // кнопки выбора персонажей
  characters.forEach((c, i) => {
    drawCharacterButton(
      p,
      50, 120 + i*80, 200, 60, c, 1,
      selectedPlayer1 === c
    );
    drawCharacterButton(
      p,
      350, 120 + i*80, 200, 60, c, 2,
      selectedPlayer2 === c
    );
  });
}

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


// функция для кнопок выбора персонажей
function drawCharacterButton(p, x, y, w, h, text, playerNum, selected) {
  // если этот персонаж выбран, подсветим
  if (selected) {
    p.fill(120, 200, 120); // подсветка выбранного
  } else {
    p.fill(100, 100, 200); // обычный цвет
  }

  p.stroke(50);
  p.strokeWeight(2);
  p.rect(x, y, w, h, 10);

  p.textSize(24);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(255);
  p.noStroke();
  p.text(text, x + w/2, y + h/2);

  // эффект при наведении
  if (
    p.mouseX > x && p.mouseX < x + w &&
    p.mouseY > y && p.mouseY < y + h
  ) {
    p.noFill();
    p.stroke(255, 255, 0);
    p.strokeWeight(3);
    p.rect(x, y, w, h, 10);
  }
}

function mousePressedOnButton(p) {
  // проверка клика по кнопкам выбора персонажей
  characters.forEach((c, i) => {
    // Player 1
    if (
      p.mouseX > 50 && p.mouseX < 250 &&
      p.mouseY > 100 + i*80 && p.mouseY < 160 + i*80
    ) {
      selectedPlayer1 = c;
    }

    // Player 2
    if (
      p.mouseX > 350 && p.mouseX < 550 &&
      p.mouseY > 100 + i*80 && p.mouseY < 160 + i*80
    ) {
      selectedPlayer2 = c;
    }
  });

  // проверка клика по кнопке "Start Fight"
  if (
    p.mouseX > startButton.x &&
    p.mouseX < startButton.x + startButton.w &&
    p.mouseY > startButton.y &&
    p.mouseY < startButton.y + startButton.h
  ) {
     setPlayers(selectedPlayer1, selectedPlayer2);
    initPlayers(p);
    startButton.clicked = true;
        const title = document.getElementById("fight-title");
    title.style.display = "inline-flex";
        const spec1 = document.getElementById("special1");
    spec1.style.display = "inline-block";
        const spec2 = document.getElementById("special2");
    spec2.style.display = "inline-block";
  }
}