import './style.css'
import p5 from 'p5'
import { preload, setup, draw, setPlayers } from './game.js'
import { initPlayers } from './game.js'
import { resetState, state } from './state.js'

const player1Stat = document.getElementById('player1Stat')
const player2Stat = document.getElementById('player2Stat')
const endButtonsDiv = document.getElementById('end-buttons')
const menuBtn = document.getElementById('menu-btn')

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


// ----------------------------------YANDEX-----------------------------------------

YaGames
    .init()
    .then(ysdk => {
        console.log('Yandex SDK initialized');
        window.ysdk = ysdk;
    });


const ysdk = await YaGames.init();

ysdk.features.LoadingAPI?.ready()


let player;
export let money = 0;
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


export function updateMoneyUI() {
    document.getElementById("player-money").textContent = `💰 ${money}`;
}

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



// ----------------------------------END YANDEX-------------------------------------------

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
        if(state.currentMode === "botvsbot"){
          if (state.winner === 1 && state.currentChoosenWinner === "bot1") {addMoney(Math.floor(state.currentFightBet * state.currentBetCoef));}
          if (state.winner === 2 && state.currentChoosenWinner === "bot2") {addMoney(Math.floor(state.currentFightBet * state.currentBetCoef));}
        }
        updateMoneyUI();
        document.getElementById('fight-title').style.display = 'none'
        document.getElementById('special1').style.display = 'none'
        document.getElementById('special2').style.display = 'none'
        document.getElementById("player-profile").style.display = "flex";
        document.getElementById('game-wrapper').style.display = 'none'

        if(state.currentMode === "botvsbot"){
            document.getElementById('debts-screen').style.display = 'flex';
            setupBotBets()
        } else {
          document.getElementById('menu-screen').style.display = 'flex'
        }
        resetState()
        ysdk.features.GameplayAPI.stop()
      }
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


let startButton = {
  clicked: false,
}
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


let endButtons = {
  menu: { x: 100, y: 500, w: 180, h: 60, text: 'Menu' },
  retry: { x: 320, y: 500, w: 180, h: 60, text: 'Retry' },
}
export function showEndButtons() {
  endButtonsDiv.style.display = 'block'
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



// ---------------------------VS FRIEND-------------------------------------------


const mainMenu = document.getElementById('main-menu')
const menuScreen = document.getElementById('menu-screen')

const vsFriendBtn = document.getElementById('vs-friend-btn')

// --- КНОПКИ ГЛАВНОГО МЕНЮ ---
vsFriendBtn.onclick = () => {              
  mainMenu.style.display = 'none'
  menuScreen.style.display = 'flex'
}

const backBtn = document.getElementById('back-btn')
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



// ---------------------------VS BOT-------------------------------------------


const vsBotBtn = document.getElementById('vs-bot-btn')


vsBotBtn.onclick = () => {
mainMenu.style.display = 'none';
menuScreen.style.display = 'flex';
document.getElementById('char-panel-p2').style.display = 'none';
enableBotBetting();
};

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



// ---------------------------BOT VS BOT-------------------------------------------


const debtsBtn = document.getElementById('debts-btn')

const debtsBackBtn = document.getElementById('debts-back-btn') // если есть Debts экран
// Назад из Debts
if (debtsBackBtn) {
  debtsBackBtn.onclick = () => {
    document.getElementById('debts-screen').style.display = 'none'
    mainMenu.style.display = 'flex'
  }
}

// --- ЭКРАН СТАВОК НА БОТОВ ---

const debtCharacters = [
  'Thief', 'Knight', 'Mage', 'Archer', 'Spearman',
  'Samurai', 'Viking', 'Shielder', 'Fighter', 'Ninja', 'Piper'
];

const betsList = document.getElementById('bets-list');
const debtBetInput = document.getElementById("bet-amount");

// элементы для показа ботов и коэффициентов
let bot1NameEl, bot2NameEl, bot1CoefEl, bot2CoefEl;

// генерация рандомного персонажа
function getRandomChar() {
  return debtCharacters[Math.floor(Math.random() * debtCharacters.length)];
}

function setupBotBets() {
  betsList.innerHTML = ''; // очищаем предыдущие боты

  let bot1 = getRandomChar();
  let bot2 = getRandomChar();
  if (bot1 === bot2) {
    bot2 = getRandomChar();
  }

  let coef1 = (1 + Math.random() * 2).toFixed(2);
  let coef2 = (1 + Math.random() * 2).toFixed(2);

  // сохраняем в state для доступа позже
  state.currentBot1 = bot1;
  state.currentBot2 = bot2;
  state.currentCoef1 = parseFloat(coef1);
  state.currentCoef2 = parseFloat(coef2);

  // --- Левый блок игрока ---
  const leftDiv = document.createElement('div');
  leftDiv.style.display = 'flex';
  leftDiv.style.flexDirection = 'column';
  leftDiv.style.alignItems = 'center';
  leftDiv.style.flex = '1';
  leftDiv.style.background = 'rgba(0, 0, 0, 0.15)';
  leftDiv.style.padding = '2vh 2vw';
  leftDiv.style.border = '0.3vw solid #d4b25d'
  leftDiv.style.borderRadius = '10px';
  leftDiv.style.marginRight = '5vw';
  leftDiv.style.backdropFilter = 'blur(1vw)';   // 🔹 добавил blur
  leftDiv.style.webkitBackdropFilter = 'blur(1vw)'; // для Safari

  bot1NameEl = document.createElement('p');
  bot1NameEl.textContent = bot1;
  bot1NameEl.style.color = 'rgb(73, 143, 247)';
  bot1NameEl.style.fontFamily = "'Delicious Handrawn', cursive";
  bot1NameEl.style.fontSize = '3vw';
  bot1CoefEl = document.createElement('p');
  bot1CoefEl.textContent = `x${coef1}`;
  bot1CoefEl.style.color = 'rgb(250, 250, 50)';
  bot1CoefEl.style.fontFamily = "'Delicious Handrawn', cursive";
  bot1CoefEl.style.fontSize = '1.8vw';
  bot1CoefEl.style.marginTop = '-2vh';
  leftDiv.appendChild(bot1NameEl);
  leftDiv.appendChild(bot1CoefEl);

  // --- Правый блок игрока ---
  const rightDiv = document.createElement('div');
  rightDiv.style.display = 'flex';
  rightDiv.style.flexDirection = 'column';
  rightDiv.style.alignItems = 'center';
  rightDiv.style.flex = '1';
  rightDiv.style.background = 'rgba(0, 0, 0, 0.15)';
  rightDiv.style.padding = '2vh 2vw';
  rightDiv.style.border = '0.3vw solid #d4b25d'
  rightDiv.style.borderRadius = '10px';
  rightDiv.style.marginLeft = '5vw';
  rightDiv.style.backdropFilter = 'blur(1vw)';
  rightDiv.style.webkitBackdropFilter = 'blur(1vw)';

  bot2NameEl = document.createElement('p');
  bot2NameEl.textContent = bot2;
  bot2NameEl.style.color = 'rgb(245, 64, 47)';
  bot2NameEl.style.fontFamily = "'Delicious Handrawn', cursive";
  bot2NameEl.style.fontSize = '3vw';
  bot2CoefEl = document.createElement('p');
  bot2CoefEl.textContent = `x${coef2}`;
  bot2CoefEl.style.color = 'rgb(250, 250, 50)';
  bot2CoefEl.style.fontFamily = "'Delicious Handrawn', cursive";
  bot2CoefEl.style.fontSize = '1.8vw';
  bot2CoefEl.style.marginTop = '-2vh';
  rightDiv.appendChild(bot2NameEl);
  rightDiv.appendChild(bot2CoefEl);

  // --- VS ---
  const vsDiv = document.createElement('div');
  vsDiv.textContent = 'VS';
  vsDiv.style.color = 'rgb(250, 250, 50)';
  vsDiv.style.fontFamily = "'Delicious Handrawn', cursive";
  vsDiv.style.fontSize = '5vw';
  vsDiv.style.margin = '0 2vw';
  vsDiv.style.alignSelf = 'center';

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.marginBottom = '2vh';
  container.appendChild(leftDiv);
  container.appendChild(vsDiv);
  container.appendChild(rightDiv);

  betsList.appendChild(container);
}

// --- кнопка "Place Bet" ---
document.getElementById("place-bet").addEventListener("click", () => {
  const amount = parseInt(debtBetInput.value, 10);

  if (!chosenDebtWinner) {
    alert("Выберите на кого ставите!");
    return;
  }
  if (amount <= 0 || amount > money || isNaN(amount)) {
    alert("Введите корректную сумму ставки!");
    return;
  }

  state.currentMode = "botvsbot";

  spendMoney(amount);

  state.currentFightBet = amount;
  state.currentChoosenWinner = chosenDebtWinner;
  state.currentBetCoef = chosenDebtWinner === "bot1" ? state.currentCoef1 : state.currentCoef2;

  // alert(`Вы поставили ${amount} на ${chosenDebtWinner.toUpperCase()} с коэффициентом x${state.currentBetCoef}`);

  document.getElementById('debts-screen').style.display = 'none';
  document.getElementById('game-wrapper').style.display = 'block';

  setPlayers(state.currentBot1, state.currentBot2);
  initPlayers(pInstance);
  startButton.clicked = true;

  const title = document.getElementById('fight-title');
  title.style.display = 'flex';
  document.getElementById('special1').style.display = 'inline-block';
  document.getElementById('special2').style.display = 'inline-block';
});


// обработка выбора на кого ставить
let chosenDebtWinner = null;
document.getElementById("bet-on-p1").addEventListener("click", () => {
  chosenDebtWinner = "bot1";
  document.getElementById("bet-on-p1").classList.add("selected");
  document.getElementById("bet-on-p2").classList.remove("selected");
});
document.getElementById("bet-on-p2").addEventListener("click", () => {
  chosenDebtWinner = "bot2";
  document.getElementById("bet-on-p2").classList.add("selected");
  document.getElementById("bet-on-p1").classList.remove("selected");
});

// предупреждение о некорректной сумме
const debtBetError = document.createElement('div');
debtBetError.id = "debt-bet-error"; // чтобы можно было стилизовать
debtBetError.style.color = "red";
debtBetError.style.marginTop = "0.5vh";
debtBetError.style.display = "none";
debtBetError.style.fontSize = "2vh";

debtBetInput.insertAdjacentElement("afterend", debtBetError);


debtBetInput.addEventListener("input", () => {
  const val = parseInt(debtBetInput.value, 10);
  if (val > money) {
    debtBetError.style.display = "block";
    debtBetError.textContent = "У вас нет столько денег!";
  } else if (val <= 0 || isNaN(val)) {
    debtBetError.style.display = "block";
    debtBetError.textContent = "Введите корректную сумму!";
  } else {
    debtBetError.style.display = "none";
  }

  debtBetInput.value = debtBetInput.value.replace(/\D/g, "");
});

// открытие экрана Debts
debtsBtn.onclick = () => {
  if (!isAuthorized) {
    alert("Чтобы делать ставки, войдите в аккаунт Яндекса!");
    return;
  }
  mainMenu.style.display = 'none';
  document.getElementById('debts-screen').style.display = 'flex';

  setupBotBets(); // генерация рандомных ботов и коэффициентов
};


// ---------------------------------------------------------------------------------