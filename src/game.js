import Matter from "matter-js";
import { rotateWeapon, weapon1State, weapon2State } from "./weapons.js";
import { handleHit, handleSwordClash } from "./collisions.js";
import { randomJump, limitVelocity } from "./effects.js";
import { drawBody, drawWeapon, drawHPBar  } from "./render.js";
import { state } from "./state.js";
import { setWeaponSprites } from "./render.js";
import { setPlayerSkins } from "./render.js";
import {drawEndButtons} from "./index.js";
import { createPlayer, createWeapon, createCharacter, shootArrow, handleShieldHit } from "./players.js";
import { shootArrowOnce } from "./players.js";
import { playClash, playHit, playShot } from "./audio.js";
import { knockback } from "./collisions.js";

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

let canvas;
let hited = 0;
let bgImg;
export let startbg;
 
export let thiefsword, knightsword, magic, bow, arrow, spear, fillerweapon, filler, axe, pipe, suriken, katana, shield, KatanaCutImg;
export let thief1, knight1, mage1, archer1, spearman1,samurai1,shielder1,viking1,fighter1,ninja1,piper1;
export let thief2, knight2, mage2, archer2, spearman2,samurai2,shielder2,viking2,fighter2,ninja2,piper2;



export function setPlayers(name1, name2) {
  p1name = name1;
  p2name = name2;
}

export function preload(p) {
  filler = p.loadImage('/filler.png');
  thief1 = p.loadImage('/thief1.png');
  knight1 = p.loadImage('/knight1.png');
  mage1 = p.loadImage('/mage1.png');
  archer1 = p.loadImage('/archer1.png');
  spearman1 = p.loadImage('/spearman1.png');
  samurai1 =  p.loadImage('/samurai1.png');
  shielder1 = p.loadImage('/thorfinn1.png');
  viking1 = p.loadImage('/viking1.png');
  fighter1 = p.loadImage('/tyler1.png');
  ninja1 = p.loadImage('/ninja1.png');
  piper1 = p.loadImage('/piper1.png');

  thief2 = p.loadImage('/thief2.png');
  knight2 = p.loadImage('/knight2.png');
  mage2 = p.loadImage('/mage2.png');
  archer2 = p.loadImage('/archer2.png');
  spearman2 = p.loadImage('/spearman2.png');
  samurai2 =  p.loadImage('/samurai2.png');
  shielder2 = p.loadImage('/thorfinn2.png');
  viking2 = p.loadImage('/viking2.png');
  fighter2 = p.loadImage('/tyler2.png');
  ninja2 = p.loadImage('/ninja2.png');
  piper2 = p.loadImage('/piper2.png');

  fillerweapon = p.loadImage('/fillerW.png');
  thiefsword = p.loadImage('/sword1.png');
  knightsword = p.loadImage('/sword2.png');
  magic = p.loadImage('/magic.png');
  bow = p.loadImage('/bow.png');
  arrow = p.loadImage('/arrow.png');
  spear = p.loadImage('/spear.png');
  axe = p.loadImage('/axe.png');
  pipe = p.loadImage('/pipe.png');
  suriken = p.loadImage('/suriken.png');
  katana = p.loadImage('/katana.png');
  shield = p.loadImage('/shield.png');

  KatanaCutImg = p.loadImage('/katanacut.png');
  bgImg = p.loadImage("/background.png");
  startbg = p.loadImage("/startbg.png");
}

export function setup(p) {
  canvas = p.createCanvas(600, 600);
  canvas.parent("sketch-holder");

    p.noSmooth();

  engine = Engine.create();
  engine.positionIterations = 100;
  engine.velocityIterations = 100;
  engine.constraintIterations = 100;

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
  p.textFont('Delicious Handrawn');
  p.background(140, 120, 180);
  p.background(0); // на всякий случай заливаем
  p.image(bgImg, 0, 0, p.width, p.height); // растягиваем на весь канвас
  Engine.update(engine);

  if (state.gameOver) {
  p.textSize(104);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(250, 250, 50);  
  p.stroke(100, 100, 0);                    // обводка текста
  p.strokeWeight(0);
  if(state.winner === 1)
  p.text(player1.name + " wins!", p.width / 2, p.height / 2);
  else   p.text(player2.name + " wins!", p.width / 2, p.height / 2);
  }

if (weapon1.type === "bow" && !state.gameOver) {
  if (weapon1.remainingArrows > 0) 
    if (weapon1.shootTimer <= 0) {
      shootArrowOnce(player1, weapon1);
      weapon1.remainingArrows--;
      weapon1.shootTimer = weapon1.shootInterval;
    } else {
      weapon1.shootTimer--;
    } else if (p.frameCount % 60 === 0) { // каждые 60 кадров "заряжаем" новый выстрел
    weapon1.remainingArrows = weapon1.arrowsPerShot;
  }
}

if (weapon2.type === "bow" && !state.gameOver ) {
  if (weapon2.remainingArrows > 0) {
    if (weapon2.shootTimer <= 0) {
      shootArrowOnce(player1, weapon2);
      weapon2.remainingArrows--;
      weapon2.shootTimer = weapon2.shootInterval;
    } else {
      weapon2.shootTimer--;
    }
  } else if (p.frameCount % 60 === 0) { // каждые 60 кадров "заряжаем" новый выстрел
    weapon2.remainingArrows = weapon2.arrowsPerShot;
  }
}

weapon1.arrows = weapon1.arrows.filter(a =>
  a.x > -50 && a.x < p.width + 50 &&
  a.y > -50 && a.y < p.height + 50
);

weapon2.arrows = weapon2.arrows.filter(a =>
  a.x > -50 && a.x < p.width + 50 &&
  a.y > -50 && a.y < p.height + 50
);


if (weapon1.type === "bow") updateAndDrawArrows(p, weapon1, player2, weapon2, 1);
if (weapon2.type === "bow") updateAndDrawArrows(p, weapon2, player1, weapon1, 2);

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

  if(player1.name === "Viking"){
    updateVikingSpeed(weapon1);
  }
  if(player2.name === "Viking"){
    updateVikingSpeed(weapon2);
  }


  function updateVikingSpeed(weapon) {
  if (weapon.name === "Viking" && !state.gameOver) {
    weapon.spinSpeed += 0.005 * weapon.vikingCoef; // наращиваем скорость
    if (weapon.spinSpeed > weapon.maxSpinSpeed) weapon.spinSpeed = weapon.maxSpinSpeed;
  }
}

  if(player1.name === "Knight") player1Stat.textContent = weapon1.damage.toFixed(2);
  else if(player1.name === "Thief") player1Stat.textContent = weapon1.spinSpeed.toFixed(2);
  else if(player1.name === "Mage") player1Stat.textContent = weapon1.damage.toFixed(2);
  else if(player1.name === "Archer")  player1Stat.textContent = weapon1.arrowsPerShot.toFixed(2);
  else if(player1.name === "Spearman")  player1Stat.textContent = weapon1.renderW.toFixed(2);
  else if(player1.name === "Shielder") player1Stat.textContent = '';
  else if(player1.name === "Fighter") player1Stat.textContent = weapon1.damage.toFixed(2);
  else if(player1.name === "Piper")  player1Stat.textContent = weapon1.arrowsPerShot.toFixed(2);
  else if(player1.name === "Ninja")  player1Stat.textContent = weapon1.renderW.toFixed(2);
  else if(player1.name === "Samurai") player1Stat.textContent = weapon1.cuts.toFixed(2);
  else if(player1.name === "Viking") player1Stat.textContent = (weapon1.damage + weapon1.spinSpeed * weapon1.vikingCoef).toFixed(2);
  
  if(player2.name === "Knight") player2Stat.textContent = weapon2.damage.toFixed(2);
  else if(player2.name === "Thief") player2Stat.textContent = weapon2.spinSpeed.toFixed(2);
  else if(player2.name === "Mage") player2Stat.textContent = weapon2.damage.toFixed(2);
  else if(player2.name === "Archer")  player2Stat.textContent = weapon2.arrowsPerShot.toFixed(2);
  else if(player2.name === "Spearman")  player2Stat.textContent = weapon2.renderW.toFixed(2);
  else if(player2.name === "Shielder") player2Stat.textContent = '';
  else if(player2.name === "Fighter") player2Stat.textContent = weapon2.damage.toFixed(2);
  else if(player2.name === "Piper")  player2Stat.textContent = weapon2.arrowsPerShot.toFixed(2);
  else if(player2.name === "Ninja")  player2Stat.textContent = weapon2.renderW.toFixed(2);
  else if(player2.name === "Samurai") player2Stat.textContent = weapon2.cuts.toFixed(2);
  else if(player2.name === "Viking") player2Stat.textContent = (weapon2.damage + weapon2.spinSpeed * weapon2.vikingCoef).toFixed(2);

  // ограничение скорости
  limitVelocity(player1, 10);
  limitVelocity(player2, 10);

if (player1.name === "Shielder" && weapon1.shield?.active && !state.gameOver) {
  const b = weapon1.shield.body;
  p.push();
  p.noFill();
  p.stroke(0, 200, 255, 150);
  p.strokeWeight(6);
  p.ellipse(b.position.x, b.position.y, weapon1.shield.radius*2);
  p.pop();
}

if (player2.name === "Shielder" && weapon2.shield?.active && !state.gameOver) {
  const b = weapon2.shield.body;
  p.push();
  p.noFill();
  p.stroke(0, 200, 255, 150);
  p.strokeWeight(6);
  p.ellipse(b.position.x, b.position.y, weapon2.shield.radius*2);
  p.pop();
}



checkShieldCollisions(player1, player2,weapon1,weapon2,1,2);
checkShieldCollisions(player2, player1,weapon2,weapon1,2,1);

function checkShieldCollisions(attacker, target, weapon, targetWeapon, attackerIndex, targetIndex) {
    if (!targetWeapon.shield || !targetWeapon.shield.active || attacker.invul > 0 || state.gameOver) return;

    const col = Matter.SAT.collides(weapon, targetWeapon.shield.body);
    if (col && col.collided) {   // <-- добавлена проверка col
        handleShieldHit(attacker, target, weapon, targetWeapon, attackerIndex, targetIndex);
    }
}



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
      if(player1.name === "Spearman" || player2.name === "Spearman")
      clashCD = 15;
    else clashCD = 20;
      direction1 = -direction1;
      direction2 = -direction2;
      player1.clashFlash = 5;
      player2.clashFlash = 5;
    }
  });

  if(player1.invul>0){
     // Body.setVelocity(player1, { x: 0, y: 0 });
      knockback(player1, player2, 12);
  } else {
    randomJump(player1);
  }

  if(player2.invul>0){
    //Body.setVelocity(player2, { x: 0, y: 0 });
    knockback(player2, player1, 12);
  } else {
     randomJump(player2);
  }


  function updateAndDrawArrows(p, weapon, opponent, opponentWeapon, attackerIndex) {
  for (let i = weapon.arrows.length - 1; i >= 0; i--) {
    const a = weapon.arrows[i];

    // движение по прямой
    a.x += Math.cos(a.angle) * a.speed;
    a.y += Math.sin(a.angle) * a.speed;

    // рисуем стрелу
    p.push();
    p.translate(a.x, a.y);
    p.rotate(a.angle);
    p.imageMode(p.CENTER);
    p.image(arrow, 0, 0, a.width*3, a.height*7);
    p.pop();

    // удаляем стрелу если вне экрана
    if (a.x < -50 || a.x > p.width + 50 || a.y < -50 || a.y > p.height + 50) {
      weapon.arrows.splice(i, 1);
      continue;
    }

    // проверка попаданий по игроку
const dx = a.x - opponent.position.x;
const dy = a.y - opponent.position.y;
const dist = Math.sqrt(dx*dx + dy*dy);
if (dist < opponent.circleRadius + a.hitRadius) {
    state[`hp${opponent === player1 ? 1 : 2}`] = Math.max(0, state[`hp${opponent === player1 ? 1 : 2}`] - 1);
    opponent.hitFlash = 15;
    weapon.arrowsPerShot+=1;
    if (state[`hp${opponent === player1 ? 1 : 2}`] === 0) {
        state.winner = opponent === player1 ? 2 : 1;
        state.gameOver = true;
      }
    opponent.invul = 4;
    playHit();
    weapon.arrows.splice(i, 1);
    continue;
}

    // проверка парирования по оружию
    const wx = opponentWeapon.position.x;
    const wy = opponentWeapon.position.y;
    const wdx = a.x - wx;
    const wdy = a.y - wy;
    const wdist = Math.sqrt(wdx*wdx + wdy*wdy);
if (wdist < Math.max(opponentWeapon.renderW, opponentWeapon.renderH)/2 + a.hitRadius) {
    opponentWeapon.clashFlash = 255;
    weapon.arrows.splice(i, 1);
    playClash();
    if(opponentWeapon.shield){
      state[`hp${attackerIndex}`] = state[`hp${attackerIndex}`] -1;
    }
    continue;
}

  }
}
  // удары
  handleHit( p1 ,player1, player2, weapon1, weapon2 , 2, 1 , {
    setWinner: (w) => state.winner = w,
    setHP: () => {
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

  handleHit( p2 ,player2, player1, weapon2, weapon1 , 1, 2 , {
    setWinner: (w) => state.winner = w,
    setHP: () => {
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

if(weapon1.shield){
    World.add(world, weapon1.shield.body);
}
if(weapon2.shield){
    World.add(world, weapon2.shield.body);
}

  
  if(player1.name === "Knight") document.getElementById("special1").textContent = "Damage:";
  else if(player1.name === "Thief") document.getElementById("special1").textContent = "Spin speed:";
  else if(player1.name === "Mage") document.getElementById("special1").textContent = "Charge/sec:";
  else if(player1.name === "Archer") document.getElementById("special1").textContent = "Arrows:";
  else if(player1.name === "Spearman") document.getElementById("special1").textContent = "Spear len:";
  else if(player1.name === "Samurai") document.getElementById("special1").textContent = "Cuts:";
  else if(player1.name === "Viking") document.getElementById("special1").textContent = "Spin/dmg:";
  else if(player1.name === "Shielder") document.getElementById("special1").textContent = "";
  else if(player1.name === "Fighter") document.getElementById("special1").textContent = "Max speed:";
  else if(player1.name === "Piper") document.getElementById("special1").textContent = "Stun:";
  else if(player1.name === "Ninja") document.getElementById("special1").textContent = "Max bounce:";

  if(player2.name === "Knight") document.getElementById("special2").textContent = "Damage:";
  else if(player2.name === "Thief") document.getElementById("special2").textContent = "Spin speed:";
  else if(player2.name === "Mage") document.getElementById("special2").textContent = "Charge/sec:";
  else if(player2.name === "Archer") document.getElementById("special2").textContent = "Arrows:";
  else if(player2.name === "Spearman") document.getElementById("special2").textContent = "Spear len:";
  else if(player2.name === "Samurai") document.getElementById("special2").textContent = "Cuts:";
  else if(player2.name === "Viking") document.getElementById("special2").textContent = "Spin/dmg:";
  else if(player2.name === "Shielder") document.getElementById("special2").textContent = "";
  else if(player2.name === "Fighter") document.getElementById("special2").textContent = "Max speed:";
  else if(player2.name === "Piper") document.getElementById("special2").textContent = "Stun:";
  else if(player2.name === "Ninja") document.getElementById("special2").textContent = "Max bounce:";

  World.add(world, [player1, player2, weapon1, weapon2]);
}

  let endButtons = {
  menu: { x: 100, y: 300, w: 180, h: 60, text: "Menu" },
  retry: { x: 320, y: 300, w: 180, h: 60, text: "Retry" }
};
