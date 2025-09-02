import Matter, { SAT } from 'matter-js'
import {
  knightsword,
  thiefsword,
  magic,
  thief1,
  knight1,
  mage1,
  thief2,
  mage2,
  knight2,
  archer1,
  archer2,
  bow,
  spear,
  spearman2,
  spearman1,
  fillerweapon,
  katana,
  axe,
  shield,
  pipe,
  suriken,
  samurai1,
  ninja2,
  piper1,
  piper2,
  shielder2,
  fighter2,
  viking2,
  samurai2,
  viking1,
  fighter1,
  shielder1,
  ninja1,
  KatanaCutImg,
} from './game'
import { playClash, playHit, playShot } from './audio'
import { state } from './state'
import { addCut } from './render'
const { Bodies, Body, World } = Matter

export function createPlayer(x, y, r, skin, name) {
  let player = Bodies.circle(x, y, r, {
    restitution: 2.5,
    friction: 0,
    frictionAir: 0.002,
    density: 0.35,
    stunTimer: 0,
    jumpCD: 5,
    index: 0
  })
  player.circleRadius = r // обязательно для drawBody
  player.skin = skin
  player.name = name
  return player
}

export function createWeapon(player, w, h, skin, name, type) {
  var weapon
  if (type == 'fight') {
    weapon = Bodies.circle(player.position.x, player.position.y, 50, {
      isSensor: true,
      frictionAir: 0,
    })
  } else {
    weapon = Bodies.rectangle(player.position.x, player.position.y, w, h, {
      isSensor: true,
      frictionAir: 0,
    })
  }
  weapon.arrows = [] // массив стрел
  weapon.arrowCount = 1 // сколько стрел выпускать за раз
  weapon.renderW = w
  weapon.renderH = h
  weapon.skin = skin
  weapon.name = name
  weapon.type = type
  weapon.direction = 0;
  if (name === 'Shielder') {
    const shieldWidth = w // ширина щита
    const shieldHeight = h // высота щита
    const shieldBody = Bodies.rectangle(
      player.position.x,
      player.position.y,
      shieldWidth,
      shieldHeight,
      { isSensor: true }, // чтобы не мешал физике
    )

    weapon.shield = {
      active: true,
      body: shieldBody,
      reflectCoef: 1.0,
      width: shieldWidth,
      height: shieldHeight,
      angle: 0,
      orbitRadius: w / 2 + (player.circleRadius ?? 20), // от центра игрока
    }
  }
  weapon.orbitRadius = w / 2 + (player.circleRadius ?? 20)
  return weapon
}

export function createCharacter(type, x, y, playerNum) {
  let player
  let weapon
  let skin
  let fighter
  if (playerNum === 1)
    switch (type) {
      case 'Thief':
        skin = thief1
        break
      case 'Knight':
        skin = knight1
        break
      case 'Mage':
        skin = mage1
        break
      case 'Archer':
        skin = archer1
        break
      case 'Spearman':
        skin = spearman1
        break
      case 'Samurai':
        skin = samurai1
        break
      case 'Viking':
        skin = viking1
        break
      case 'Fighter':
        skin = fighter1
        break
      case 'Shielder':
        skin = shielder1
        break
      case 'Piper':
        skin = piper1
        break
      case 'Ninja':
        skin = ninja1
        break
    }
  else
    switch (type) {
      case 'Thief':
        skin = thief2
        break
      case 'Knight':
        skin = knight2
        break
      case 'Mage':
        skin = mage2
        break
      case 'Archer':
        skin = archer2
        break
      case 'Spearman':
        skin = spearman2
        break
      case 'Samurai':
        skin = samurai2
        break
      case 'Viking':
        skin = viking2
        break
      case 'Fighter':
        skin = fighter2
        break
      case 'Shielder':
        skin = shielder2
        break
      case 'Piper':
        skin = piper2
        break
      case 'Ninja':
        skin = ninja2
        break
    }

  player = createPlayer(x, y, 45, skin, type)

  switch (type) {
    case 'Thief':
      weapon = createWeapon(player, 80, 24, thiefsword, 'Thief', 'sword')
      weapon.damage = 4
      weapon.spinSpeed = 1.3
      break

    case 'Knight':
      weapon = createWeapon(player, 130, 24, knightsword, 'Knight', 'sword')
      weapon.damage = 6
      weapon.spinSpeed = 0.9
      break

    case 'Mage':
      weapon = createWeapon(player, 100, 24, magic, 'Mage', 'sword')
      weapon.damage = 4
      weapon.spinSpeed = 1.2
      break

    case 'Archer':
      weapon = createWeapon(player, 30, 150, bow, 'Archer', 'bow')
      weapon.damage = 0
      weapon.spinSpeed = 0.6
      weapon.arrows = []
      weapon.type = 'bow'
      weapon.arrowsPerShot = 1
      weapon.shootTimer = 0
      weapon.shootInterval = 1
      weapon.remainingArrows = weapon.arrowsPerShot
      break

    case 'Spearman':
      weapon = createWeapon(player, 100, 30, spear, 'Spearman', 'sword')
      weapon.damage = 5
      weapon.spinSpeed = 2
      break

    case 'Samurai':
      weapon = createWeapon(player, 100, 40, katana, 'Samurai', 'sword')
      weapon.cuts = 4
      weapon.damage = 0
      weapon.spinSpeed = 1.1
      break

    case 'Viking':
      weapon = createWeapon(player, 100, 80, axe, 'Viking', 'sword')
      weapon.damage = 4
      weapon.spinSpeed = 0.5
      weapon.initialSpinSpeed = 0.5 // начальная скорость
      weapon.maxSpinSpeed = 40 // максимальная скорость
      weapon.vikingCoef = 1 // коэффициент прироста урона от скорости
      break

    case 'Shielder':
      weapon = createWeapon(player, 50, 100, shield, 'Shielder', 'sword')
      weapon.damage = 0
      weapon.spinSpeed = 0.6
      break

    case 'Piper':
      weapon = createWeapon(player, 140, 60, pipe, 'Piper', 'sword')
      weapon.damage = 5
      weapon.spinSpeed = 1.2
      weapon.pipeStun = 1
      break

    case 'Ninja':
      weapon = createWeapon(player, 50, 50, suriken, 'Ninja', 'sword')
      weapon.damage = 0
      weapon.spinSpeed = 1
      weapon.maxBounces = 1 // макс. отскоков текущего сюрикена
      weapon.bouncesPerHit = 1 // сколько увеличивать после удара
      break

    case 'Fighter':
      weapon = createWeapon(player, 80, 80, suriken, 'Fighter', 'fight')
      weapon.damage = 5
      weapon.spinSpeed = 1
      player.fighterSpeedCoef = 5
      weapon.fighterSpeed = weapon.fighterSpeed || 2 // базовая сила при попадании
      weapon.fighterMaxSpeed = weapon.fighterMaxSpeed || 6 // макс скорость

      break
  }
  return { player, weapon }
}

export function shootArrowOnce(player, weapon) {
  const tip = weapon.renderW * 0.5
  const ang = weapon.angle
  const ax = weapon.position.x + Math.cos(ang) * tip
  const ay = weapon.position.y + Math.sin(ang) * tip
  playShot()
  weapon.arrows.push({
    x: ax,
    y: ay,
    angle: ang,
    speed: 18,
    width: 28,
    height: 6,
    owner: player,
    hitRadius: 30,
    bouncesLeft: weapon.maxBounces, // сколько раз ещё может отскочить
  })
}

export function growSpear(weapon, increment = 2) {
  const oldW = weapon.renderW
  const newW = oldW + increment

  const scaleX = newW / oldW

  Body.scale(weapon, scaleX, 1)

  weapon.renderW = newW
  // если центр совпадает с игроком – орбита не нужна
  weapon.orbitRadius = newW / 2 + 45
}

export function handleShieldHit(
  attacker,
  target,
  weapon,
  targetWeapon,
  attackerIndex,
  targetIndex,
) {
  if (attacker.name === 'Viking') {
    let damageDealt = weapon.damage + weapon.spinSpeed * weapon.vikingCoef
    state[`hp${attackerIndex}`] = Math.max(
      0,
      state[`hp${attackerIndex}`] - damageDealt,
    )
    weapon.spinSpeed = weapon.initialSpinSpeed
  } else if (attacker.name === 'Samurai') {
    for (let i = 0; i < weapon.cuts; i++) {
      setTimeout(() => {
        if (attackerIndex === 1) {
          state.hp1 = Math.max(0, state.hp1 - 1)
          if (state.hp1 === 0) {
            state.winner = targetIndex
            state.gameOver = true
          }
        } else {
          state.hp2 = Math.max(0, state.hp2 - 1)
          if (state.hp2 === 0) {
            state.winner = targetIndex
            state.gameOver = true
          }
        }
        attacker.hitFlash = 15
        playHit()
        addCut(attacker, KatanaCutImg)
      }, i * 150)
    }
  } else if (weapon.fighter) {
    // урон от скорости + апгрейд
    let reflectedDamage = weapon.fighter.calcDamage()
    weapon.fighter.onHit()
    state[`hp${attackerIndex}`] = Math.max(
      0,
      state[`hp${attackerIndex}`] - reflectedDamage,
    )
  } else if (attacker.name === 'Piper') {
    attacker.stunTimer = weapon.pipeStun
    const reflectedDamage = weapon.damage * targetWeapon.shield.reflectCoef
    state[`hp${attackerIndex}`] = Math.max(
      0,
      state[`hp${attackerIndex}`] - reflectedDamage,
    )
    if (state[`hp${attackerIndex}`] === 0) {
      state.winner = targetIndex
      state.gameOver = true
    }
  } else if (attacker.name === 'Ninja') {
    throwShuriken(target, targetWeapon)
  } else {
    const reflectedDamage = weapon.damage * targetWeapon.shield.reflectCoef
    state[`hp${attackerIndex}`] = Math.max(
      0,
      state[`hp${attackerIndex}`] - reflectedDamage,
    )
    if (state[`hp${attackerIndex}`] === 0) {
      state.winner = targetIndex
      state.gameOver = true
    }
    if (reflectedDamage > 0) {
      playHit()
      attacker.hitFlash = 15
    }
  }
  attacker.invul = 20
  attacker.flashStrength = 255
  attacker.flashType = 'hit'
  //targetWeapon.shield.active = false;
  //setTimeout(() => targetWeapon.shield.active = true, 0); // 250 мс КД
}

export function throwShuriken(player, weapon) {
  const tip = weapon.renderW * 0.5
  const ang = weapon.angle
  const ax = weapon.position.x + Math.cos(ang) * tip
  const ay = weapon.position.y + Math.sin(ang) * tip

  playShot()

  weapon.arrows.push({
    x: ax,
    y: ay,
    angle: ang,
    speed: 18,
    width: 76,
    height: 76,
    owner: player,
    hitRadius: 30,
    bouncesLeft: weapon.maxBounces, // сколько раз может отскочить
  })
}

export function updateShurikens(
  p,
  ninja,
  weapon,
  opponent,
  opponentWeapon,
  opponentHp,
) {
  for (let i = weapon.arrows.length - 1; i >= 0; i--) {
    const a = weapon.arrows[i]

    // движение
    a.x += Math.cos(a.angle) * a.speed
    a.y += Math.sin(a.angle) * a.speed

    // проверка границ и отскок
    let bounced = false
    if (a.x < 0 || a.x > p.width) {
      a.angle = Math.PI - a.angle
      bounced = true
    }
    if (a.y < 0 || a.y > p.height) {
      a.angle = -a.angle
      bounced = true
    }

    if (bounced) {
      a.bouncesLeft--
      if (a.bouncesLeft <= 0) {
        weapon.arrows.splice(i, 1)
        continue
      }
    }

    // проверка попадания по игроку
    const dx = a.x - opponent.position.x
    const dy = a.y - opponent.position.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < opponent.circleRadius + a.hitRadius) {
      state[`hp${opponentHp}`] = Math.max(0, state[`hp${opponentHp}`] - 4)
      playHit()
      opponent.hitFlash = 15
      weapon.maxBounces += 1 // каждый удар увеличивает отскоки нового сюрикена
      weapon.arrows.splice(i, 1)
      continue
    }

    // парирование оружием противника
    const wx = opponentWeapon.position.x
    const wy = opponentWeapon.position.y
    const wdx = a.x - wx
    const wdy = a.y - wy
    const wdist = Math.sqrt(wdx * wdx + wdy * wdy)
    const weaponRadius =
      Math.max(opponentWeapon.renderW, opponentWeapon.renderH) / 2

    if (wdist < weaponRadius + a.hitRadius) {
      opponentWeapon.clashFlash = 255
      playClash()
      weapon.arrows.splice(i, 1)
      if (opponent.name === 'Shielder')
        handleShieldHit(
          ninja,
          opponent,
          weapon,
          opponentWeapon,
          (opponentHp = 1 ? 2 : 1),
          opponentHp,
        )
      continue
    }

    // рисуем
    p.push()
    p.translate(a.x, a.y)
    p.rotate(a.angle)
    p.imageMode(p.CENTER)
    p.image(weapon.skin, 0, 0, a.width, a.height)
    p.pop()
  }
}
