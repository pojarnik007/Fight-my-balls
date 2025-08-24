import Matter from "matter-js";
import { createPlayer, createWeapon, createCharacter } from "./players.js";
import { rotateWeapon, weapon1State, weapon2State } from "./weapons.js";
import { handleHit, handleSwordClash } from "./collisions.js";
import { randomJump, limitVelocity } from "./effects.js";
import { drawBody, drawWeapon, drawHPBar  } from "./render.js";
import { state } from "./state.js";
import { setWeaponSprites } from "./render.js";
import { setPlayerSkins } from "./render.js";
import {drawEndButtons} from "./index.js";



const { Engine, World, Bodies, Body } = Matter;


let engine, world;
let player1, player2;
let weapon1, weapon2;
let ground, leftWall, rightWall, topWall;

let direction1 = 1;
let direction2 = -1;
let slashed = 0;
let clashCD = 0;

let W2Damage =1;

let jumpCD1 = 0;
let jumpCD2 = 0;

let p1 = 1;
let p2 = 2;

let coef1, coef2;

export let p1name = '';
export let p2name = '';

export function setPlayers(name1, name2) {
  p1name = name1;
  p2name = name2;
}


let hited = 0;
 
export let thiefsword, knightsword, magic;
export let thief1, knight1, mage1;
export let thief2, knight2, mage2;

let bgImg;
export let startbg;



export function preload(p) {
  thief1 = p.loadImage('/thief1.png');
  knight1 = p.loadImage('/knight1.png');
  mage1 = p.loadImage('/mage1.png');
  thief2 = p.loadImage('/thief2.png');
  knight2 = p.loadImage('/knight2.png');
  mage2 = p.loadImage('/mage2.png');

  thiefsword = p.loadImage('/sword1.png');
  knightsword = p.loadImage('/sword2.png');
  magic = p.loadImage('/magic.png');

  bgImg = p.loadImage("/background.png");
  startbg = p.loadImage("/startbg.png");
}

let canvas;


export function setup(p) {
  canvas = p.createCanvas(600, 600);
  canvas.parent("sketch-holder");

    p.noSmooth();

  engine = Engine.create();
  engine.positionIterations = 10;
  engine.velocityIterations = 10;
  engine.constraintIterations = 20;

  world = engine.world;
  engine.world.gravity.y = 1;

  ground   = Bodies.rectangle(300, p.height + 10, 1200, 20, { isStatic: true });
  topWall  = Bodies.rectangle(300, -10, 1200, 20, { isStatic: true });
  leftWall = Bodies.rectangle(-10, 300, 20, 800, { isStatic: true });
  rightWall= Bodies.rectangle(p.width + 10, 300, 20, 800, { isStatic: true });

  World.add(world, [ground, topWall, leftWall, rightWall]); 

  coef1 = 1;
  coef2 = 1;
}

export function draw(p, player1Stat, player2Stat) {
  p.background(140, 120, 180);
  p.background(0); // на всякий случай заливаем
  p.image(bgImg, 0, 0, p.width, p.height); // растягиваем на весь канвас
  Engine.update(engine);

  if (state.gameOver) {
  p.textSize(144);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(250, 250, 50);  
  p.stroke(100, 100, 0);                    // обводка текста
  p.strokeWeight(0);
  if(state.winner === 1)
  p.text(player1.name + " wins!", p.width / 2, p.height / 2);
  else   p.text(player2.name + " wins!", p.width / 2, p.height / 2);
  }

  // вращение оружия
  rotateWeapon(player1, weapon1, weapon1.spinSpeed, direction1, weapon1State);
  rotateWeapon(player2, weapon2, weapon2.spinSpeed, direction2, weapon2State);

  // прыжки
  if (jumpCD1 > 0) jumpCD1--; 
  else if (slashed === 0 && player1.hitFlash === 0 && player2.hitFlash === 0) {
    randomJump(player1, (cd)=>jumpCD1=cd);
  }
  if (jumpCD2 > 0) jumpCD2--; 
  else if (slashed === 0 && player1.hitFlash === 0 && player2.hitFlash === 0) {
    randomJump(player2, (cd)=>jumpCD2=cd);
  }

  if(player1.name === "Mage") {
    weapon1.damage =  (weapon1.damage) + coef1 / 200;
  }
  if(player2.name === "Mage") {
    weapon2.damage = (weapon2.damage) + coef2 / 200;
  }

  if(player1.name === "Knight") player1Stat.textContent = weapon1.damage.toFixed(3);
  else if(player1.name === "Thief") player1Stat.textContent = weapon1.spinSpeed.toFixed(3);
  else if(player1.name === "Mage") player1Stat.textContent = weapon1.damage.toFixed(3);

  
  if(player2.name === "Knight") player2Stat.textContent = weapon2.damage.toFixed(3);
  else if(player2.name === "Thief") player2Stat.textContent = weapon2.spinSpeed.toFixed(3);
  else if(player2.name === "Mage") player2Stat.textContent = weapon2.damage.toFixed(3);


  // ограничение скорости
  limitVelocity(player1, 10);
  limitVelocity(player2, 10);

  if (player1.invul > 0) player1.invul--;
  if (player2.invul > 0) player2.invul--;
  if (clashCD > 0) clashCD--;

  // столкновения оружий
  handleSwordClash(weapon1, weapon2, player1, player2, {
    clashCD,
    setClash: () => {
      slashed = 3;
      if(player2.name === "Thief" || player1.name === "Thief")
      clashCD = 10;
    else clashCD = 30;
      direction1 = -direction1;
      direction2 = -direction2;
      player1.clashFlash = 3;
      player2.clashFlash = 3;
    }
  });

  randomJump(player1);
  randomJump(player2);

  // удары
  handleHit( p1 ,player1, player2, weapon1, {
    setWinner: (w) => state.winner = w,
    setHP: () => {
      // логика урона
      if(player2.name === "Knight")
        state.hp2 = Math.max(0, state.hp2 - weapon1.damage + 1);
      else
        state.hp2 = Math.max(0, state.hp2 - weapon1.damage);
      if(player1.name === "Knight") weapon1.damage +=0.5;
      else if(player1.name === "Thief") weapon1.spinSpeed +=0.2;
      else if(player1.name === "Mage") {coef1+=1.2; weapon1.damage = 1}
      if (state.hp2 === 0) {
        state.winner = 1;
        state.gameOver = true;
      }
    }
  });

  handleHit( p2 ,player2, player1, weapon2, {
    setWinner: (w) => state.winner = w,
    setHP: () => {
      if(player1.name === "Knight")
        state.hp1 = Math.max(0, state.hp1 - weapon2.damage + 1);
      else
        state.hp1 = Math.max(0, state.hp1 - weapon2.damage);
      if(player2.name === "Knight") weapon2.damage +=0.5;
      else if(player2.name === "Thief") weapon2.spinSpeed +=0.2;
        else if(player2.name === "Mage")  {coef2+=1.2; weapon2.damage = 1}
      if (state.hp1 === 0) {
        state.winner = 2;
        state.gameOver = true;
      }
    }
  });

  // эффект отбрасывания
  if (slashed > 0) {
    Body.setVelocity(player1, { x: 0, y: 0 });
    Body.setVelocity(player2, { x: 0, y: 0 });
    slashed--;
  }

  if (hited > 0) {
    Body.setVelocity(player1, { x: 0, y: 0 });
    Body.setVelocity(player2, { x: 0, y: 0 });
    hited--;
  }

  // рисуем игроков
  if (!state.gameOver || state.winner !== 2) {
  drawBody(p, player1, p.color(0, 150, 255), state.hp1, 1);
  drawWeapon(p, weapon1, p.color(200), 1);
  }
  if (!state.gameOver || state.winner !== 1) {
  drawBody(p, player2, p.color(255, 100, 100), state.hp2, 2);
  drawWeapon(p, weapon2, p.color(200), 2);
  }

  //drawHPBar(p, 20, 30, 220, 14, state.hp1, p.color(70, 80, 205), "Thief");
  //drawHPBar(p, p.width - 240, 30, 220, 14, state.hp2, p.color(205, 40, 40), "Knight");

  if (state.gameOver) {
    drawEndButtons(p);
  }

}

  let endButtons = {
  menu: { x: 100, y: 300, w: 180, h: 60, text: "Menu" },
  retry: { x: 320, y: 300, w: 180, h: 60, text: "Retry" }
};



export function initPlayers(p) {
  let char1 = createCharacter(p1name, 160, 200, 1);
  player1 = char1.player;
  weapon1 = char1.weapon;

  let char2 = createCharacter(p2name, 440, 200, 2);
  player2 = char2.player;
  weapon2 = char2.weapon;

  setPlayerSkins(player1.skin, player2.skin);
  setWeaponSprites(weapon1.skin, weapon2.skin);

  
     // обновляем заголовок сверху
  document.getElementById("fight-title").textContent =
      `${player1.name} VS ${player2.name}`;

    // эффекты
  player1.hitFlash = 0;
  player2.hitFlash = 0;
  player1.clashFlash = 0;
  player2.clashFlash = 0;
  player1.invul = 0;
  player2.invul = 0;


  state.hp1 = 100;
  state.hp2 = 100;

  coef1 = 1;
  coef2 = 1;

  state.winner = 0;
  state.gameOver = false;
  
  if(player1.name === "Knight") document.getElementById("special1").textContent = "Damage:";
  else if(player1.name === "Thief") document.getElementById("special1").textContent = "Spin speed:";
  else if(player1.name === "Mage") document.getElementById("special1").textContent = "Charge/sec:";

  if(player2.name === "Knight") document.getElementById("special2").textContent = "Damage:";
  else if(player2.name === "Thief") document.getElementById("special2").textContent = "Spin speed:";
  else if(player2.name === "Mage") document.getElementById("special2").textContent = "Charge/sec:";

  World.add(world, [player1, player2, weapon1, weapon2]);
}
