import './style.css'
import p5 from 'p5'
import { preload, setup, draw, setPlayers } from './game.js'
import { initPlayers } from './game.js'
import { resetState, state } from './state.js'

const player1Stat = document.getElementById('player1Stat')
const player2Stat = document.getElementById('player2Stat')
const endButtonsDiv = document.getElementById('end-buttons')
const menuBtn = document.getElementById('menu-btn')
const retryBtn = document.getElementById('retry-btn')
const mainMenu = document.getElementById('main-menu')
const menuScreen = document.getElementById('menu-screen')
const gameWrapper = document.getElementById('game-wrapper')

// кнопки меню
const vsFriendBtn = document.getElementById('vs-friend-btn')
const vsBotBtn = document.getElementById('vs-bot-btn')
const debtsBtn = document.getElementById('debts-btn')

let selectedPlayer1 = 'Thief'
let selectedPlayer2 = 'Thief'
const characters = [
  'Thief',
  'Knight',
  'Mage',
  'Archer',
  'Spearman',
  'Samurai',
  'Viking',
  'Shielder',
  'Fighter',
  'Ninja',
  'Piper',
]
let pInstance
let startButton = {
  clicked: false,
}
let endButtons = {
  menu: { x: 100, y: 500, w: 180, h: 60, text: 'Menu' },
  retry: { x: 320, y: 500, w: 180, h: 60, text: 'Retry' },
}

YaGames
    .init()
    .then(ysdk => {
        console.log('Yandex SDK initialized');
        window.ysdk = ysdk;
    });


const ysdk = await YaGames.init();

// Сообщаем платформе, что игра загрузилась и можно начинать играть.
ysdk.features.LoadingAPI?.ready()


let player;
let money = 0;
export let isAuthorized = false;  

ysdk.getPlayer({ scopes: false }).then(_player => {
    player = _player;

    if (player.getMode() === "lite") {
        // Игрок НЕ авторизован
        console.log("Анонимный игрок");
        document.getElementById("player-profile").style.display = "none";
        isAuthorized = false;
    } else {
        // Авторизован
        isAuthorized = true;

        // Ник и аватар
        document.getElementById("player-name").textContent = player.getName();
        document.getElementById("player-avatar").src = player.getPhoto('medium');

        // Деньги
        player.getStats(["money"]).then(stats => {
            if (!stats.money) {
                money = 100;
                player.setStats({ money }).then(updateMoneyUI);
            } else {
                money = stats.money;
                updateMoneyUI();
            }
        });
    }
}).catch(err => {
    console.error("Ошибка получения игрока:", err);
});

function updateMoneyUI() {
    document.getElementById("player-money").textContent = `💰 ${money}`;
}

// ✅ Добавление денег
export function addMoney(amount) {
    if (!isAuthorized) {
        console.log("Игрок не авторизован, деньги не сохраняются.");
        return;
    }
    player.incrementStats({ money: amount }).then(() => {
        return player.getStats(["money"]);
    }).then(stats => {
        money = stats.money ?? money; // если вдруг stats пустой
        updateMoneyUI();
    }).catch(err => {
        console.error("Ошибка при добавлении денег:", err);
    });
}

// ✅ Трата денег
export function spendMoney(amount) {
    if (!isAuthorized) {
        console.log("Игрок не авторизован, деньги не сохраняются.");
        return;
    }
    if (money >= amount) {
        player.incrementStats({ money: -amount }).then(() => {
            return player.getStats(["money"]);
        }).then(stats => {
            money = stats.money ?? money;
            updateMoneyUI();
        }).catch(err => {
            console.error("Ошибка при списании денег:", err);
        });
    } else {
        console.log("Недостаточно денег!");
    }
}

export function showEndButtons() {
  endButtonsDiv.style.display = 'block'
}

const sketch = (p) => {
  p.preload = () => preload(p)
  p.setup = () => {
    setup(p)
  }
  p.draw = () => {
    if (startButton.clicked) {
      document.getElementById("player-profile").style.display = "none";
      draw(p, player1Stat, player2Stat)
    }
  }
  p.mousePressed = () => {
    if (!startButton.clicked) {
    } else if (state.gameOver) {
      // При возврате в меню
      menuBtn.onclick = () => {
        endButtonsDiv.style.display = 'none'
        startButton.clicked = false
        if (state.winner === 1 & state.currentMode === "bot" & isAuthorized) {
          addMoney(Math.floor(state.currentBotBet * 1.5));
          state.currentBotBet = 0; // сброс, чтобы не получить награду повторно
        }
        resetState()
        updateMoneyUI();
        document.getElementById('fight-title').style.display = 'none'
        document.getElementById('special1').style.display = 'none'
        document.getElementById('special2').style.display = 'none'
        document.getElementById('menu-screen').style.display = 'flex'
        document.getElementById("player-profile").style.display = "flex";
        document.getElementById('game-wrapper').style.display = 'none'
        ysdk.features.GameplayAPI.stop()
      }

      // retryBtn.onclick = () => {
      //   endButtonsDiv.style.display = 'none'
      //   state.gameOver = false
      //   initPlayers(pInstance)
      // }

    }
  }
  pInstance = p
}

new p5(sketch)

function makeCharButtons(container, playerNum) {
  characters.forEach((c) => {
    const btn = document.createElement('button')
    btn.textContent = c
    btn.classList.add('char-btn')
    btn.onclick = () => {
      if (playerNum === 1) selectedPlayer1 = c
      else selectedPlayer2 = c
      ;[...container.children].forEach((b) => b.classList.remove('selected'))
      btn.classList.add('selected')
    }
    container.appendChild(btn)
  })
}

makeCharButtons(document.getElementById('char-buttons-p1'), 1)
makeCharButtons(document.getElementById('char-buttons-p2'), 2)

document.getElementById('start-btn').onclick = () => {
  if(document.getElementById('char-panel-p2').style.display == 'none'){
    state.currentMode = "bot";
    selectedPlayer2 = characters[Math.floor(Math.random() * characters.length)];
    if (isAuthorized) {
      const bet = parseInt(botBetInput.value, 10);
      if (bet > money) {
        alert("У вас нет столько денег!");
        return;
      }

    state.currentBotBet = bet; // запомним ставку для награды
    spendMoney(state.currentBotBet); 
    }
  } else {
    state.currentBotBet = 0; 
    state.currentMode = "";
  }
  console.log(state.currentMode);
  document.getElementById('menu-screen').style.display = 'none'
  document.getElementById('game-wrapper').style.display = 'block'
  setPlayers(selectedPlayer1, selectedPlayer2)
  initPlayers(pInstance)
  startButton.clicked = true
  const title = document.getElementById('fight-title')
  title.style.display = 'flex'
  const spec1 = document.getElementById('special1')
  spec1.style.display = 'inline-block'
  const spec2 = document.getElementById('special2')
  spec2.style.display = 'inline-block'
}

export function drawEndButtons(p) {
  drawButton(p, endButtons.menu)
  drawButton(p, endButtons.retry)
}

function drawButton(p, btn) {
  p.fill(214, 178, 93)
  p.stroke(194, 148, 93)
  p.strokeWeight(3)
  p.rect(btn.x, btn.y, btn.w, btn.h, 20)

  p.textFont('Delicious Handrawn')
  p.textSize(32)
  p.textAlign(p.CENTER, p.CENTER)
  p.fill(250, 250, 50)
  p.noStroke()
  p.text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2)

  if (
    p.mouseX > btn.x &&
    p.mouseX < btn.x + btn.w &&
    p.mouseY > btn.y &&
    p.mouseY < btn.y + btn.h
  ) {
    p.noFill()
    p.stroke(255, 255, 0)
    p.strokeWeight(4)
    p.rect(btn.x, btn.y, btn.w, btn.h, 20)
  }
}


// --- КНОПКИ ГЛАВНОГО МЕНЮ ---
vsFriendBtn.onclick = () => {              
  mainMenu.style.display = 'none'
  menuScreen.style.display = 'flex'
}

vsBotBtn.onclick = () => {
mainMenu.style.display = 'none';
menuScreen.style.display = 'flex';
document.getElementById('char-panel-p2').style.display = 'none';
enableBotBetting();
};


debtsBtn.onclick = () => {
  if (!isAuthorized) {
    alert("Чтобы делать ставки, войдите в аккаунт Яндекса!");
    return;
  }
  enableBotBetting()
  mainMenu.style.display = 'none';
  document.getElementById('debts-screen').style.display = 'flex';
};

const backBtn = document.getElementById('back-btn')
const debtsBackBtn = document.getElementById('debts-back-btn') // если есть Debts экран


// Назад из экрана выбора персонажей
backBtn.onclick = () => {
  menuScreen.style.display = 'none'
  mainMenu.style.display = 'flex'
  botBetBlock.style.display = "none";
  state.currentBotBet = 0; // сброс
  state.currentMode = "";
  // вернуть выбор второго игрока на место (если был скрыт при VS Bot)
  const p2Panel = document.getElementById('char-panel-p2')
  if (p2Panel) p2Panel.style.display = 'flex'
}

// Назад из Debts
if (debtsBackBtn) {
  debtsBackBtn.onclick = () => {
    document.getElementById('debts-screen').style.display = 'none'
    mainMenu.style.display = 'flex'
  }
}


const botBetBlock = document.getElementById("bot-bet-block");
const botBetInput = document.getElementById("bot-bet-amount");

botBetInput.addEventListener("input", () => {
  // оставляем только цифры
  botBetInput.value = botBetInput.value.replace(/\D/g, "");
});

const botBetError = document.getElementById("bot-bet-error");

function enableBotBetting() {
    if (isAuthorized) {
        botBetBlock.style.display = "block";
        botBetInput.max = money; // ограничение сверху
        botBetInput.addEventListener("input", () => {
            const val = parseInt(botBetInput.value, 10);
            if (val > money) {
                botBetError.style.display = "block";
                botBetError.textContent = "У вас нет столько денег!";
            } else {
                botBetError.style.display = "none";
            }
        });
    } else {
        botBetBlock.style.display = "none";
    }
}
