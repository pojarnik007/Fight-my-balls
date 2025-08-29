import Matter from 'matter-js'
import { state } from './state.js'
import { playClash, playHit } from './audio.js'
import { growSpear } from './players.js'
import { addCut } from './render.js'
import { KatanaCutImg, setLastHit1 } from './game.js'

const { SAT, Body } = Matter

export function knockback(body, from, force) {
  let dx = body.position.x - from.position.x
  let dy = body.position.y - from.position.y
  let len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) len = 0.1
  dx /= len
  dy /= len
  Body.setVelocity(body, { x: dx * force, y: dy * force })
}

export function handleHit(
  player,
  attacker,
  target,
  weapon,
  targetWeapon,
  targetIndex,
  attackerIndex,
  vars,
) {
  if (state.gameOver) return
  if (!attacker || !target || !weapon || !targetWeapon) return
  if (!attacker.position || !target.position) return

  const { setWinner, setHP } = vars
  if (target.invul > 0 || state.gameOver) return
  let col = SAT.collides(weapon, target)
  if (col && col.collided) {

    target.invul = 20
    target.hitFlash = 15
    setLastHit1(state.frame)
    target.flashStrength = 255
    target.flashType = 'hit'

    if (
      attacker.name === 'Archer' ||
      (attacker.name === 'Shielder' && attacker.name !== 'Ninja')
    ) {
      target.hitFlash = 0
      target.invul = 0
    }

    if (
      attacker.name !== 'Archer' &&
      attacker.name !== 'Shielder' &&
      attacker.name !== 'Ninja'
    ) {
      playHit()
    }

    if (attacker.name != 'Viking' && attacker.name != 'Samurai')
      setHP(attacker, target)

    if (attacker.name === 'Thief') {
      target.invul = 10
    }

    if (weapon.name === 'Spearman') {
      growSpear(weapon, 5)
      target.invul = 7
    }

    if (attacker.name === 'Piper') {
      target.stunTimer = weapon.pipeStun
      weapon.pipeStun += 15
    }

    if (weapon.type === 'fight') {
      weapon.fighterMaxSpeed += 2
      weapon.fighterSpeed = Math.min(
      weapon.fighterSpeed + 0.5,
      weapon.fighterMaxSpeed,
      )
      target.stunTimer = 20;
    }

    if (attacker.name === 'Viking') {
      let damageDealt = weapon.damage + weapon.spinSpeed * weapon.vikingCoef
      state[`hp${targetIndex}`] = Math.max(
        0,
        state[`hp${targetIndex}`] - damageDealt,
      )
      weapon.spinSpeed = weapon.initialSpinSpeed
      weapon.vikingCoef += 0.05
    }

    if (attacker.name === 'Samurai') {
      weapon.cuts = (weapon.cuts || 0) + 1

      for (let i = 0; i < weapon.cuts; i++) {
        setTimeout(() => {
          if (targetIndex === 1) {
            state.hp1 = Math.max(0, state.hp1 - 1)
            if (state.hp1 === 0) {
              state.winner = attackerIndex
              state.gameOver = true
            }
          } else {
            state.hp2 = Math.max(0, state.hp2 - 1)
            if (state.hp2 === 0) {
              state.winner = attackerIndex
              state.gameOver = true
            }
          }
          target.hitFlash = 15
          playHit()
          addCut(target, KatanaCutImg)
        }, i * 150)
      }
    }
  }
}

export function handleSwordClash(weapon1, weapon2, player1, player2, vars) {
  const { clashCD, setClash } = vars
  if (clashCD > 0 || state.gameOver) return
  const clash = SAT.collides(weapon1, weapon2)
  if (
    clash &&
    clash.collided &&
    player1.name !== 'Archer' &&
    player2.name !== 'Archer' &&
    player1.name !== 'Fighter' &&
    player2.name !== 'Fighter'
  ) {
    playClash()
    if (player1.stunTimer === 0) knockback(player1, player2, 7)
    if (player2.stunTimer === 0) knockback(player2, player1, 7)
    setClash()
    weapon1.clashFlash = 255
    weapon2.clashFlash = 255
  }
}
