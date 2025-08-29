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

let direction1 = 1
let direction2 = -1
let slashed = 0
let clashCD = 0
let W2Damage = 1
let p1 = 1
let p2 = 2
let coef1, coef2

let lastHit1 = 0

export let p1name = ''
export let p2name = ''

let canvas
let hited = 0
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

export function preload(p) {
  filler = p.loadImage('/filler.png')
  thief1 = p.loadImage('/thief1.png')
  knight1 = p.loadImage('/knight1.png')
  mage1 = p.loadImage('/mage1.png')
  archer1 = p.loadImage('/archer1.png')
  spearman1 = p.loadImage('/spearman1.png')
  samurai1 = p.loadImage('/samurai1.png')
  shielder1 = p.loadImage('/thorfinn1.png')
  viking1 = p.loadImage('/viking1.png')
  fighter1 = p.loadImage('/tyler1.png')
  ninja1 = p.loadImage('/ninja1.png')
  piper1 = p.loadImage('/piper1.png')

  thief2 = p.loadImage('/thief2.png')
  knight2 = p.loadImage('/knight2.png')
  mage2 = p.loadImage('/mage2.png')
  archer2 = p.loadImage('/archer2.png')
  spearman2 = p.loadImage('/spearman2.png')
  samurai2 = p.loadImage('/samurai2.png')
  shielder2 = p.loadImage('/thorfinn2.png')
  viking2 = p.loadImage('/viking2.png')
  fighter2 = p.loadImage('/tyler2.png')
  ninja2 = p.loadImage('/ninja2.png')
  piper2 = p.loadImage('/piper2.png')

  fillerweapon = p.loadImage('/fillerW.png')
  thiefsword = p.loadImage('/sword1.png')
  knightsword = p.loadImage('/sword2.png')
  magic = p.loadImage('/magic.png')
  bow = p.loadImage('/bow.png')
  arrow = p.loadImage('/arrow.png')
  spear = p.loadImage('/spear.png')
  axe = p.loadImage('/axe.png')
  pipe = p.loadImage('/pipe.png')
  suriken = p.loadImage('/suriken.png')
  katana = p.loadImage('/katana.png')
  shield = p.loadImage('/shield.png')

  KatanaCutImg = p.loadImage('/katanacut.png')
  bgImg = p.loadImage('/background.png')
  startbg = p.loadImage('/startbg.png')
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

  updateWeaponsRotation(player1, player2, weapon1, weapon2, direction1, direction2);

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

  updateCooldownsAndClashes(player1, player2, weapon1, weapon2, direction1, direction2, clashCD, slashed);
  
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
}

export function initPlayers(p) {
  let char1 = createCharacter(p1name, 160, 200, 1)
  player1 = char1.player
  weapon1 = char1.weapon
  player1.index = 1

  let char2 = createCharacter(p2name, 440, 200, 2)
  player2 = char2.player
  weapon2 = char2.weapon
  player2.index = 2

  setPlayerSkins(player1.skin, player2.skin)
  setWeaponSprites(weapon1.skin, weapon2.skin)

  document.getElementById('fight-title').textContent =
    `${player1.name} VS ${player2.name}`

  ;[player1, player2].forEach(p => {
    p.hitFlash = 0
    p.clashFlash = 0
    p.invul = 0
  })

  state.hp1 = 100
  state.hp2 = 100
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
