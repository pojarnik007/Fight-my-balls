import Matter, { SAT } from "matter-js";
import {knightsword, thiefsword, magic, thief1, knight1, mage1, thief2, mage2, knight2, archer1,archer2,bow, spear, spearman2, spearman1, fillerweapon, katana, axe, shield, pipe, suriken, samurai1, ninja2, piper1, piper2, shielder2, fighter2, viking2, samurai2, viking1, fighter1, shielder1, ninja1, KatanaCutImg } from "./game";
import { playHit, playShot } from "./audio";
import { state } from "./state";
import { addCut } from "./render";
const { Bodies, Body, World } = Matter;

export function createPlayer(x, y, r, skin, name) {
  let player = Bodies.circle(x, y, r, {
    restitution: 2.5,
    friction: 0,
    frictionAir: 0.002,
    density: 0.35
  });
  player.circleRadius = r; // обязательно для drawBody
  player.skin = skin;
  player.name = name;
  return player;
}

export function createWeapon(player, w, h,skin,name,type) {
  let weapon = Bodies.rectangle(player.position.x, player.position.y, w, h, {
    isSensor: true,
    frictionAir: 0
  });
  weapon.arrows = [];     // массив стрел
  weapon.arrowCount = 1;  // сколько стрел выпускать за раз
  weapon.renderW = w;
  weapon.renderH = h;
  weapon.skin = skin;
  weapon.name = name;
  weapon.type = type;

if(name === "Shielder") {
    const shieldWidth = w;   // ширина щита
    const shieldHeight = h;  // высота щита
    const shieldBody = Bodies.rectangle(
        player.position.x,
        player.position.y,
        shieldWidth,
        shieldHeight,
        { isSensor: true } // чтобы не мешал физике
    );

    weapon.shield = {
        active: true,
        body: shieldBody,
        reflectCoef: 1.0,
        width: shieldWidth,
        height: shieldHeight,
        angle: 0,
        orbitRadius: w/2 + (player.circleRadius ?? 20) // от центра игрока
    };
}
  weapon.orbitRadius = w/2 + (player.circleRadius ?? 20);
  return weapon;
}


export function createCharacter(type, x, y, playerNum) {
  let player;
  let weapon;
  let skin;
  if (playerNum === 1)
    switch(type){
        case "Thief":
          skin = thief1;
          break;
        case "Knight":
          skin = knight1;
          break;
        case "Mage":
          skin = mage1;
          break;
        case "Archer":
          skin = archer1;
          break;
        case "Spearman":
          skin = spearman1;
          break;
        case "Samurai":
          skin = samurai1;
          break;
        case "Viking":
          skin = viking1;
          break;
        case "Fighter":
          skin = fighter1;
          break;
        case "Shielder":
          skin = shielder1;
          break;
        case "Piper":
          skin = piper1;
          break;
        case "Ninja":
          skin = ninja1;
          break;
  }
  else
    switch(type){
        case "Thief":
          skin = thief2;
          break;
        case "Knight":
          skin = knight2;
          break;
        case "Mage":
          skin = mage2;
          break;
        case "Archer":
          skin = archer2;
          break;
        case "Spearman":
          skin = spearman2;
          break;
        case "Samurai":
          skin = samurai2;
          break;
        case "Viking":
          skin = viking2;
          break;
        case "Fighter":
          skin = fighter2;
          break;
        case "Shielder":
          skin = shielder2;
          break;
        case "Piper":
          skin = piper2;
          break;
        case "Ninja":
          skin = ninja2;
          break;
  }

  switch(type) {
      case "Thief":
      player = createPlayer(x, y, 45, skin, "Thief");
      weapon = createWeapon(player, 80, 24, thiefsword,  "Thief", "sword");
      weapon.damage = 2;
      weapon.spinSpeed = 1;
      break;

      case "Knight":
      player = createPlayer(x, y, 45, skin, "Knight");
      weapon = createWeapon(player, 130, 24, knightsword, "Knight", "sword");
      weapon.damage = 1;
      weapon.spinSpeed = 0.9;
      break;

    
      case "Mage":
      player = createPlayer(x, y, 45, skin, "Mage");
      weapon = createWeapon(player, 100, 24, magic, "Mage", "sword");
      weapon.damage = 1;
      weapon.spinSpeed = 0.4;
      break;


      case "Archer":
      player = createPlayer(x, y, 45, skin, "Archer");
      weapon = createWeapon(player, 30, 150, bow, "Archer", 'bow');
      weapon.damage = 0;
      weapon.spinSpeed = 0.6;
      weapon.arrows = [];
      weapon.type = "bow";
      weapon.arrowsPerShot = 1;
      weapon.shootTimer = 0;
      weapon.shootInterval = 1;
      weapon.remainingArrows = weapon.arrowsPerShot;
      break;

      case "Spearman":
      player = createPlayer(x, y, 45, skin, "Spearman");
      weapon = createWeapon(player, 100, 30, spear, "Spearman", 'sword');
      weapon.damage = 1;
      weapon.spinSpeed = 2;
      break;

      case "Samurai":
      player = createPlayer(x, y, 45, skin, "Samurai");
      weapon = createWeapon(player, 140, 40, katana, "Samurai", 'sword');
      weapon.cuts = 0;
      weapon.damage = 1;
      weapon.spinSpeed = 1.2;
      break;

      case "Viking":
      player = createPlayer(x, y, 45, skin, "Viking");
      weapon = createWeapon(player, 100, 80, axe, "Viking", 'sword');
      weapon.damage = 1;
      weapon.spinSpeed = 0.8;
      weapon.initialSpinSpeed = 0.5;  // начальная скорость
      weapon.maxSpinSpeed = 40;     // максимальная скорость
      weapon.vikingCoef = 1;        // коэффициент прироста урона от скорости
      break;

      case "Shielder":
      player = createPlayer(x, y, 45, skin, "Shielder");
      weapon = createWeapon(player, 50, 100, shield, "Shielder", 'sword');
      weapon.damage = 0;
      weapon.spinSpeed = 0.8;
      break;

      case "Piper":
      player = createPlayer(x, y, 45, skin, "Piper");
      weapon = createWeapon(player, 140, 60, pipe, "Piper", 'sword');
      weapon.damage = 1;
      weapon.spinSpeed = 1;
      break;

      case "Ninja":
      player = createPlayer(x, y, 45, skin, "Ninja");
      weapon = createWeapon(player, 80, 80, suriken, "Ninja", 'sword');
      weapon.damage = 1;
      weapon.spinSpeed = 1;
      break;

      case "Fighter":
      player = createPlayer(x, y, 45, skin, "Fighter");
      weapon = createWeapon(player, 1, 1, fillerweapon, "Fighter", 'sword');
      weapon.damage = 1;
      weapon.spinSpeed = 1;
      break;

  }
  return { player, weapon };
}


export function shootArrowOnce(player, weapon) {
  const tip = weapon.renderW * 0.5;
  const ang = weapon.angle;
  const ax = weapon.position.x + Math.cos(ang) * tip;
  const ay = weapon.position.y + Math.sin(ang) * tip;
  playShot();
  weapon.arrows.push({
    x: ax,
    y: ay,
    angle: ang,
    speed: 18,
    width: 28,
    height: 6,
    owner: player,
    hitRadius: 55 // новый радиус для попадания
});

}

export function growSpear(weapon, increment = 2) {
  const oldW = weapon.renderW;
  const newW = oldW + increment;

  const scaleX = newW / oldW;

  Body.scale(weapon, scaleX, 1);

  weapon.renderW = newW;
  // если центр совпадает с игроком – орбита не нужна
  weapon.orbitRadius = newW/2 + 45;
}

export function handleShieldHit(attacker, target, weapon, targetWeapon , attackerIndex, targetIndex) {
  
 if (attacker.name === "Viking") {
      let damageDealt = weapon.damage + weapon.spinSpeed * weapon.vikingCoef;
      state[`hp${attackerIndex}`] = Math.max(0, state[`hp${attackerIndex}`] - damageDealt);
      weapon.spinSpeed = weapon.initialSpinSpeed;
} else  if(attacker.name === "Samurai") {
  for (let i = 0; i < weapon.cuts; i++) {
    setTimeout(() => {
      if(attackerIndex === 1){
      state.hp1 = Math.max(0, state.hp1-1);
      if (state.hp1 === 0) {
        state.winner = targetIndex;
        state.gameOver = true;
      }
    }
    else{
      state.hp2 = Math.max(0, state.hp2-1);
      if (state.hp2 === 0) {
        state.winner = targetIndex;
        state.gameOver = true;
      }
    }
      attacker.hitFlash = 15;
      playHit();
      addCut(attacker, KatanaCutImg); 
    }, i * 150);
  }
} else {
        const reflectedDamage = weapon.damage * targetWeapon.shield.reflectCoef;
        state[`hp${attackerIndex}`] = Math.max(0, state[`hp${attackerIndex}`] - reflectedDamage);
          if (state[`hp${attackerIndex}`] <= 0) {
        state.winner = targetIndex;
        state.gameOver = true;
      }
         if(reflectedDamage>0){
 playHit();
 attacker.hitFlash = 15;
         }
       
}
attacker.invul = 20;
attacker.flashStrength = 255;
attacker.flashType = "hit";
//targetWeapon.shield.active = false;
//setTimeout(() => targetWeapon.shield.active = true, 0); // 250 мс КД

}

