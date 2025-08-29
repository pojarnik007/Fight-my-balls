import Matter, { Body, SAT } from "matter-js"
import {
  shootArrowOnce,
  throwShuriken,
  updateShurikens,
  handleShieldHit,
} from "./players.js"
import {
  handleHit,
  handleSwordClash,
  knockback,
} from "./collisions.js"
import { drawBody, drawWeapon } from "./render.js"
import { state } from "./state.js"
import { rotateWeapon, weapon1State, weapon2State } from './weapons.js'
import { arrow, bgImg } from "./game.js"
import { randomJump } from "./effects.js"
import { playClash, playHit } from "./audio.js"
import { drawEndButtons } from './index.js'

// ===== Общие =====
export function drawBackground(p) {
    p.textFont('Delicious Handrawn');
    p.background(0)
    p.imageMode(p.CORNER)
    p.image(bgImg, 0, 0, p.width, p.height)
}

export function handleGameOverScreen(p, player1, player2) {
    if (state.gameOver) 
    {
      p.textSize(104)
      p.textAlign(p.CENTER, p.CENTER)
      p.fill(250, 250, 50)
      p.stroke(100, 100, 0) 
      p.strokeWeight(0)
      if (state.winner === 1) p.text(player1.name + ' wins!', p.width / 2, p.height / 2)
      else p.text(player2.name + ' wins!', p.width / 2, p.height / 2)
    }
}

export function handleStun(player) {
  if (player.stunTimer <= 0) return
  player.stunTimer--
  Body.setVelocity(player, { x: 0, y: 0 })
  Body.setAngularVelocity(player, 0)
}

export function movement(player, enemy){
      if (player.invul > 0) 
      {
        if (player.stunTimer === 0) knockback(player, enemy, 12)
      } 
      else 
      {
        if (player.jumpCD > 0) player.jumpCD--
        else {
          const speed = Math.hypot(player.velocity.x, player.velocity.y)
          if (speed < 5 && player.stunTimer === 0) {
            randomJump(player, (cd) => (player.jumpCD = cd))
          }
        }
      }
}

// ===== Авто-оружие =====
export function handleBow(p, player, weapon) {
    if (weapon.type === 'bow' && !state.gameOver) {
    if (weapon.remainingArrows > 0)
        if (weapon.shootTimer <= 0) {
        shootArrowOnce(player, weapon)
        weapon.remainingArrows--
        weapon.shootTimer = weapon.shootInterval
        } else {
        weapon.shootTimer--
        }
    else if (p.frameCount % 60 === 0) {
        weapon.remainingArrows = weapon.arrowsPerShot
    }
    }

    weapon.arrows = weapon.arrows.filter(
    (a) => a.x > -50 && a.x < p.width + 50 && a.y > -50 && a.y < p.height + 50,)
}

export function handleSurikens(p, player, weapon, enemy, enemyWeapon, enemyNum){
      if (player.name === 'Ninja' || player.name === 'Shielder') {
        if (p.frameCount % 30 === 0 && player.name === 'Ninja') {
          throwShuriken(player, weapon)
        }
        updateShurikens(p, player, weapon, enemy, enemyWeapon, enemyNum)
      }        
}

export function updateAndDrawArrows(p, weapon, opponent, opponentWeapon, attackerIndex) {
    if (weapon.type != 'bow') return;
    for (let i = weapon.arrows.length - 1; i >= 0; i--) {
      const a = weapon.arrows[i]

      // движение по прямой
      a.x += Math.cos(a.angle) * a.speed
      a.y += Math.sin(a.angle) * a.speed

      // рисуем стрелу
      p.push()
      p.translate(a.x, a.y)
      p.rotate(a.angle)
      p.imageMode(p.CENTER)
      p.image(arrow, 0, 0, a.width * 3, a.height * 7)
      p.pop()

      // удаляем стрелу если вне экрана
      if (a.x < -50 || a.x > p.width + 50 || a.y < -50 || a.y > p.height + 50) {
        weapon.arrows.splice(i, 1)
        continue
      }

      // проверка попаданий по игроку
      const dx = a.x - opponent.position.x
      const dy = a.y - opponent.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < opponent.circleRadius + a.hitRadius) {
        state[`hp${opponent.index}`] = Math.max(
          0,
          state[`hp${opponent.index}`] - 1,
        )
        opponent.hitFlash = 15
        weapon.arrowsPerShot += 1
        if (state[`hp${opponent.index}`] === 0) {
          state.winner = opponent.index;
          state.gameOver = true
        }
        opponent.invul = 4
        playHit()
        weapon.arrows.splice(i, 1)
        continue
      }

      // проверка парирования по оружию
      const wx = opponentWeapon.position.x
      const wy = opponentWeapon.position.y
      const wdx = a.x - wx
      const wdy = a.y - wy
      const wdist = Math.sqrt(wdx * wdx + wdy * wdy)
      if (
        wdist <
        Math.max(opponentWeapon.renderW, opponentWeapon.renderH) / 2 +
          a.hitRadius
      ) {
        opponentWeapon.clashFlash = 255
        weapon.arrows.splice(i, 1)
        playClash()
        if (opponentWeapon.shield) {
          state[`hp${attackerIndex}`] = state[`hp${attackerIndex}`] - 1
        }
        continue
      }
    }
}

// ===== Ротация оружия =====
export function updateWeaponsRotation(player1, player2, weapon1, weapon2, direction1, direction2) {
  if (player1.stunTimer === 0)
    rotateWeapon(player1, weapon1, weapon1.spinSpeed, direction1, weapon1State)
  else rotateWeapon(player1, weapon1, 0, direction1, weapon1State)
  if (player2.stunTimer === 0)
    rotateWeapon(player2, weapon2, weapon2.spinSpeed, direction2, weapon2State)
  else rotateWeapon(player2, weapon2, 0, direction2, weapon2State)
}

// ===== Бонусы маг/викинг =====
export function updateMageBonus(player, weapon, coef) {
if (player.name === 'Mage') {
    weapon.damage = weapon.damage + coef / 200
  }
}

export function updateVikingBonus(player, weapon) {
    if (player.name === 'Viking') updateVikingSpeed(weapon)
}

export function updateVikingSpeed(weapon) {
    if (weapon.name === 'Viking' && !state.gameOver) {
      weapon.spinSpeed += 0.005 * weapon.vikingCoef
      if (weapon.spinSpeed > weapon.maxSpinSpeed)
        weapon.spinSpeed = weapon.maxSpinSpeed
    }
}

// ===== Файтер и границы =====
export function keepFightersInside(player1, player2) {
    ;[player1, player2].forEach((p) => {
    if (p.name === 'Fighter') {
      const minX = 20,
        maxX = 580,
        minY = 20,
        maxY = 580

      if (p.position.x < minX || p.position.x > maxX) {
        Body.setVelocity(p, { x: -p.velocity.x, y: p.velocity.y })
        Body.setPosition(p, {
          x: Math.max(minX, Math.min(maxX, p.position.x)),
          y: p.position.y,
        })
      }
      if (p.position.y < minY || p.position.y > maxY) {
        Body.setVelocity(p, { x: p.velocity.x, y: -p.velocity.y })
        Body.setPosition(p, {
          x: p.position.x,
          y: Math.max(minY, Math.min(maxY, p.position.y)),
        })
      }
    }
  })
}

export function keepInsideArena(player, minX = 20, maxX = 580, minY = 20, maxY = 580) {
    if(player.name != 'Fighter') return;
    let x = player.position.x
    let y = player.position.y
    let vx = player.velocity.x
    let vy = player.velocity.y

    // проверяем X
    if (x < minX) {
      x = minX
      vx = Math.abs(vx)
    } else if (x > maxX) {
      x = maxX
      vx = -Math.abs(vx)
    }

    // проверяем Y
    if (y < minY) {
      y = minY
      vy = Math.abs(vy)
    } else if (y > maxY) {
      y = maxY
      vy = -Math.abs(vy)
    }

    Body.setPosition(player, { x, y })
    Body.setVelocity(player, { x: vx, y: vy })
}

// ===== UI статов =====
export function updateSpecialStat(player, weapon, statElement) {
  const statsMap = {
    Knight: () => weapon.damage,
    Thief: () => weapon.spinSpeed,
    Mage: () => weapon.damage,
    Archer: () => weapon.arrowsPerShot,
    Spearman: () => weapon.renderW,
    Shielder: () => "",
    Fighter: () => (weapon.damage * (Math.abs(player.velocity.x) + Math.abs(player.velocity.y))) / 10,
    Piper: () => weapon.pipeStun,
    Ninja: () => weapon.maxBounces,
    Samurai: () => weapon.cuts,
    Viking: () => weapon.damage + weapon.spinSpeed * weapon.vikingCoef,
  }
  const val = statsMap[player.name]?.()
  statElement.textContent = val === "" ? "" : val.toFixed(2)
}

// ===== Щиты =====
export function drawShields(p, player, weapon) {
  if (player.name !== "Shielder" || !weapon.shield?.active || state.gameOver) return
  const b = weapon.shield.body
  p.push()
  p.noFill()
  p.stroke(0, 200, 255, 150)
  p.strokeWeight(6)
  p.ellipse(b.position.x, b.position.y, weapon.shield.radius * 2)
  p.pop()
}

export function checkShieldCollisions(
    attacker,
    target,
    weapon,
    targetWeapon,
    attackerIndex,
    targetIndex,
  ) {
    if (
      !targetWeapon.shield ||
      !targetWeapon.shield.active ||
      attacker.invul > 0 ||
      state.gameOver
    )
      return

    const col = Matter.SAT.collides(weapon, targetWeapon.shield.body)
    if (col && col.collided) {
      handleShieldHit(
        attacker,
        target,
        weapon,
        targetWeapon,
        attackerIndex,
        targetIndex,
      )
    }
}

// ===== КД и урон =====
export function updateCooldownsAndClashes(player1, player2, weapon1, weapon2, direction1, direction2, clashCD, slashed) {
      if (player1.invul > 0) player1.invul--
      if (player2.invul > 0) player2.invul--
      if (clashCD > 0) clashCD--
    
      handleSwordClash(weapon1, weapon2, player1, player2, {
        clashCD,
        setClash: () => {
          slashed = 3
          if (player2.name === 'Thief' || player1.name === 'Thief') clashCD = 10
          if (player1.name === 'Spearman' || player2.name === 'Spearman')
            clashCD = 15
          else clashCD = 20
          direction1 = -direction1
          direction2 = -direction2
          player1.clashFlash = 5
          player2.clashFlash = 5
        },
      })
  
}

// ===== Рисовка =====
export function drawEntities(p, player1, player2, weapon1, weapon2) {
    if (!state.gameOver || state.winner !== 2) {
      drawBody(p, player1, p.color(0, 150, 255), state.hp1, 1)
      drawWeapon(p, weapon1, p.color(200), 1)
    }
    if (!state.gameOver || state.winner !== 1) {
      drawBody(p, player2, p.color(255, 100, 100), state.hp2, 2)
      drawWeapon(p, weapon2, p.color(200), 2)
    }
  
    if (state.gameOver) {
      drawEndButtons(p);
    }
}
