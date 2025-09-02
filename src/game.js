import Matter from 'matter-js'
import { handleHit } from './collisions.js'
import { limitVelocity } from './effects.js'
import { state } from './state.js'
import { setWeaponSprites } from './render.js'
import { setPlayerSkins } from './render.js'
import {  createCharacter } from './players.js'
import { checkShieldCollisions, drawBackground, drawEntities, drawShields, handleBow, handleGameOverScreen, handleStun, handleSurikens, keepFightersInside, keepInsideArena, movement, updateAndDrawArrows, updateCooldownsAndClashes, updateMageBonus, updateSpecialStat, updateVikingBonus, updateWeaponsRotation } from './helpers.js'

const { Engine, World, Bodies, Body } = Matter

let engine, world
let player1, player2
let weapon1, weapon2
let ground, leftWall, rightWall, topWall
let slashed = 0
let clashCD = 0
let p1 = 1
let p2 = 2
let coef1, coef2
let canvas
let lastHit1 = 0

export let p1name = ''
export let p2name = ''
export let bgImg
export let startbg
export let thiefsword,
  knightsword,
  magic,
  bow,
  arrow,
  spear,
  fillerweapon,
  filler,
  axe,
  pipe,
  suriken,
  katana,
  shield,
  KatanaCutImg
export let thief1,
  knight1,
  mage1,
  archer1,
  spearman1,
  samurai1,
  shielder1,
  viking1,
  fighter1,
  ninja1,
  piper1
export let thief2,
  knight2,
  mage2,
  archer2,
  spearman2,
  samurai2,
  shielder2,
  viking2,
  fighter2,
  ninja2,
  piper2

export function getLastHit1() {
  return lastHit1
}
export function setLastHit1(val) {
  lastHit1 = val
}

export function setPlayers(name1, name2) {
  p1name = name1
  p2name = name2
}

import fillerp from './pngAssets/filler.png';
import thief1p from './pngAssets/thief1.png';
import knight1p from './pngAssets/knight1.png';
import mage1p from './pngAssets/mage1.png';
import archer1p from './pngAssets/archer1.png';
import spearman1p from './pngAssets/spearman1.png';
import samurai1p from './pngAssets/samurai1.png';
import shielder1p from './pngAssets/thorfinn1.png';
import viking1p from './pngAssets/viking1.png';
import fighter1p from './pngAssets/tyler1.png';
import ninja1p from './pngAssets/ninja1.png';
import piper1p from './pngAssets/piper1.png';

import thief2p from './pngAssets/thief2.png';
import knight2p from './pngAssets/knight2.png';
import mage2p from './pngAssets/mage2.png';
import archer2p from './pngAssets/archer2.png';
import spearman2p from './pngAssets/spearman2.png';
import samurai2p from './pngAssets/samurai2.png';
import shielder2p from './pngAssets/thorfinn2.png';
import viking2p from './pngAssets/viking2.png';
import fighter2p from './pngAssets/tyler2.png';
import ninja2p from './pngAssets/ninja2.png';
import piper2p from './pngAssets/piper2.png';

import fillerweaponp from './pngAssets/fillerW.png';
import thiefswordp from './pngAssets/sword1.png';
import knightswordp from './pngAssets/sword2.png';
import magicp from './pngAssets/magic.png';
import bowp from './pngAssets/bow.png';
import arrowp from './pngAssets/arrow.png';
import spearp from './pngAssets/spear.png';
import axep from './pngAssets/axe.png';
import pipep from './pngAssets/pipe.png';
import surikenp from './pngAssets/suriken.png';
import katanap from './pngAssets/katana.png';
import shieldp from './pngAssets/shield.png';

import KatanaCutImgp from './pngAssets/katanacut.png';
import bgImgp from './pngAssets/background.png';
import startbgp from './pngAssets/startbg.png';

export function preload(p) {
  filler = p.loadImage(fillerp)
  thief1 = p.loadImage(thief1p)
  knight1 = p.loadImage(knight1p)
  mage1 = p.loadImage(mage1p)
  archer1 = p.loadImage(archer1p)
  spearman1 = p.loadImage(spearman1p)
  samurai1 = p.loadImage(samurai1p)
  shielder1 = p.loadImage(shielder1p)
  viking1 = p.loadImage(viking1p)
  fighter1 = p.loadImage(fighter1p)
  ninja1 = p.loadImage(ninja1p)
  piper1 = p.loadImage(piper1p)

  thief2 = p.loadImage(thief2p)
  knight2 = p.loadImage(knight2p)
  mage2 = p.loadImage(mage2p)
  archer2 = p.loadImage(archer2p)
  spearman2 = p.loadImage(spearman2p)
  samurai2 = p.loadImage(samurai2p)
  shielder2 = p.loadImage(shielder2p)
  viking2 = p.loadImage(viking2p)
  fighter2 = p.loadImage(fighter2p)
  ninja2 = p.loadImage(ninja2p)
  piper2 = p.loadImage(piper2p)

  fillerweapon = p.loadImage(fillerweaponp)
  thiefsword = p.loadImage(thiefswordp)
  knightsword = p.loadImage(knightswordp)
  magic = p.loadImage(magicp)
  bow = p.loadImage(bowp)
  arrow = p.loadImage(arrowp)
  spear = p.loadImage(spearp)
  axe = p.loadImage(axep)
  pipe = p.loadImage(pipep)
  suriken = p.loadImage(surikenp)
  katana = p.loadImage(katanap)
  shield = p.loadImage(shieldp)

  KatanaCutImg = p.loadImage(KatanaCutImgp)
  bgImg = p.loadImage(bgImgp)
  startbg = p.loadImage(startbgp)
}

function windowResized(p) {
  const holder = document.getElementById('sketch-holder');
  const scale = holder.clientWidth / 800; // 600 — базовый размер canvas
  const canvas = holder.querySelector('canvas');
  canvas.style.transform = `scale(${scale})`;
}


export function setup(p) {
  canvas = p.createCanvas(600, 600)
  canvas.parent('sketch-holder')

  p.noSmooth()

  engine = Engine.create()
  engine.positionIterations = 100
  engine.velocityIterations = 100
  engine.constraintIterations = 100

  world = engine.world
  engine.world.gravity.y = 1

  ground = Bodies.rectangle(300, p.height + 10, 1200, 20, { isStatic: true })
  topWall = Bodies.rectangle(300, -10, 1200, 20, { isStatic: true })
  leftWall = Bodies.rectangle(-10, 300, 20, 800, { isStatic: true })
  rightWall = Bodies.rectangle(p.width + 10, 300, 20, 800, { isStatic: true })

  World.add(world, [ground, topWall, leftWall, rightWall])

  coef1 = 1
  coef2 = 1
}

export function draw(p, player1Stat, player2Stat) {
  windowResized(p);
  Engine.update(engine);
  drawBackground(p);
  handleGameOverScreen(p, player1, player2);

  state.frame = p.frameCount;
      
  updateAndDrawArrows(p, weapon1, player2, weapon2, 1)
  updateAndDrawArrows(p, weapon2, player1, weapon1, 2)

  handleStun(player1);
  handleStun(player2);

  movement(player1, player2);
  movement(player2, player1);

  handleBow(p, player1, weapon1);
  handleBow(p, player2, weapon2);

  handleSurikens(p, player1, weapon1, player2, weapon2, 2);
  handleSurikens(p, player2, weapon2, player1, weapon1, 1);

  updateWeaponsRotation(player1, player2, weapon1, weapon2);

  updateMageBonus(player1,weapon1, coef1);
  updateMageBonus(player2, weapon2, coef2);

  updateVikingBonus(player1, weapon1);
  updateVikingBonus(player2, weapon2);

  keepFightersInside(player1, player2);

  keepInsideArena(player1);
  keepInsideArena(player2);

  updateSpecialStat(player1, weapon1, player1Stat);
  updateSpecialStat(player2, weapon2, player2Stat);

  limitVelocity(player1, 10);
  limitVelocity(player2, 10);

  drawShields(p, player1, weapon1);
  drawShields(p, player2, weapon2);

  checkShieldCollisions(player1, player2, weapon1, weapon2, 1, 2);
  checkShieldCollisions(player2, player1, weapon2, weapon1, 2, 1);

  updateCooldownsAndClashes(player1, player2, weapon1, weapon2, clashCD, slashed);
  
  handleHit(p1, player1, player2, weapon1, weapon2, 2, 1, {
    setWinner: (w) => (state.winner = w),
    setHP: () => {
      let damage
      if (player2.name == 'Fighter') {
        damage =
          (weapon1.damage *
            (Math.abs(player1.velocity.x) + Math.abs(player1.velocity.y))) /
          10
      } else damage = weapon1.damage

      state.hp2 = Math.max(0, state.hp2 - damage)
      if (player1.name === 'Knight') weapon1.damage += 0.5
      else if (player1.name === 'Thief') weapon1.spinSpeed += 0.2
      else if (player1.name === 'Mage') {
        coef1 += 1.2
        weapon1.damage = 1
      }

      if (state.hp2 === 0) {
        state.winner = 1
        state.gameOver = true
      }
    },
  })
  handleHit(p2, player2, player1, weapon2, weapon1, 1, 2, {
    setWinner: (w) => (state.winner = w),
    setHP: () => {
      let damage
      if (player2.name == 'Fighter') {
        damage =
          (weapon2.damage *
            (Math.abs(player2.velocity.x) + Math.abs(player2.velocity.y))) /
          10
      } else damage = weapon2.damage

      state.hp1 = Math.max(0, state.hp1 - damage)
      if (player2.name === 'Knight') weapon2.damage += 0.5
      else if (player2.name === 'Thief') weapon2.spinSpeed += 0.2
      else if (player2.name === 'Mage') {
        coef2 += 1.2
        weapon2.damage = 1
      }

      if (state.hp1 === 0) {
        state.winner = 2
        state.gameOver = true
      }
    },
  })

  drawEntities(p, player1, player2, weapon1, weapon2)


  if (state.hp1 === 0)
  {
    state.winner = 2
    state.gameOver = true
  }
  if (state.hp2 === 0)
  {
    state.winner = 1
    state.gameOver = true
  }
}

export function initPlayers(p) {
  let char1 = createCharacter(p1name, 160, 200, 1)
  player1 = char1.player
  weapon1 = char1.weapon
  player1.index = 1
  weapon1.direction = 1;

  let char2 = createCharacter(p2name, 440, 200, 2)
  player2 = char2.player
  weapon2 = char2.weapon
  player2.index = 2
  weapon2.direction = -1

  setPlayerSkins(player1.skin, player2.skin)
  setWeaponSprites(weapon1.skin, weapon2.skin)

  document.getElementById('fight-text').textContent =
    `${player1.name} VS ${player2.name}`

  ;[player1, player2].forEach(p => {
    p.hitFlash = 0
    p.clashFlash = 0
    p.invul = 0
  })

  state.hp1 = 1
  state.hp2 = 1
  coef1 = 1
  coef2 = 1
  state.winner = 0
  state.gameOver = false

  if (weapon1.shield) World.add(world, weapon1.shield.body)
  if (weapon2.shield) World.add(world, weapon2.shield.body)

  const specials = {
    Knight: "Damage:",
    Thief: "Spin speed:",
    Mage: "Charge/sec:",
    Archer: "Arrows:",
    Spearman: "Spear len:",
    Samurai: "Cuts:",
    Viking: "Spin/dmg:",
    Shielder: "",
    Fighter: "Speed/dmg:",
    Piper: "Stun:",
    Ninja: "Max bounces:",
  }

  document.getElementById('special1').textContent = specials[player1.name] ?? ""
  document.getElementById('special2').textContent = specials[player2.name] ?? ""

  World.add(world, [player1, player2, weapon1, weapon2])
}