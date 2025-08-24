import Matter from "matter-js";
import {knightsword, thiefsword, magic, thief1, knight1, mage1, thief2, mage2, knight2, archer1,archer2,bow,arrow } from "./game";
import { playShot } from "./audio";
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
      weapon.shootInterval = 1; // кадров между стрелами
      weapon.remainingArrows = weapon.arrowsPerShot;

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
