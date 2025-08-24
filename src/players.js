import Matter from "matter-js";
import {knightsword, thiefsword, magic, thief1, knight1, mage1, thief2, mage2, knight2 } from "./game";
const { Bodies } = Matter;

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

export function createWeapon(player, w, h,skin,name) {
  let weapon = Bodies.rectangle(player.position.x, player.position.y, w, h, {
    isSensor: true,
    frictionAir: 0
  });
  weapon.renderW = w;
  weapon.renderH = h;
  weapon.skin = skin;
  weapon.name = name;
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
  }

  switch(type) {
    case "Thief":
      player = createPlayer(x, y, 45, skin, "Thief");
      weapon = createWeapon(player, 80, 24, thiefsword,  "Thief");
      weapon.damage = 2;
      weapon.spinSpeed = 1;
      break;

    case "Knight":
      player = createPlayer(x, y, 45, skin, "Knight");
      weapon = createWeapon(player, 130, 24, knightsword, "Knight");
      weapon.damage = 1;
      weapon.spinSpeed = 0.9;
      break;

    
    case "Mage":
      player = createPlayer(x, y, 45, skin, "Mage");
      weapon = createWeapon(player, 100, 24, magic, "Mage");
      weapon.damage = 1;
      weapon.spinSpeed = 0.4;
      break;

    // можно легко добавить Mage, Archer и т.д.
  }
  return { player, weapon };
}