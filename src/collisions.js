import Matter from "matter-js";
import { hp1, hp2, gameOver, winner } from "./state.js";
import {state} from "./state.js";
import { playClash, playHit } from "./audio.js";

const { SAT, Body } = Matter;

export function knockback(body, from, force) {
  let dx = body.position.x - from.position.x;
  let dy = body.position.y - from.position.y;
  let len = Math.sqrt(dx*dx + dy*dy);
  if (len === 0) len = 0.0001;
  dx /= len; dy /= len;

  Body.setVelocity(body, { x: dx * force, y: dy * force });
}

export function handleHit(player, attacker, target, weapon, vars) {
  const { setWinner, setHP } = vars;
  if (target.invul > 0 || state.gameOver) return;
  let col = SAT.collides(weapon, target);
  if (col && col.collided) {
    playHit();
    knockback(target, attacker, 8);
    if(attacker.name === 'Thief' ){
          target.invul = 10;
    } else {
    target.invul = 50;
  }
    target.hitFlash = 15;
    setHP(attacker, target);
    target.flashStrength = 255;     // максимальная яркость
    target.flashType = "hit";       // или "clash"
  }
}

export function handleSwordClash(weapon1, weapon2, player1, player2, vars) {
  const { clashCD, setClash } = vars;
  if (clashCD > 0 || state.gameOver) return;
  const clash = SAT.collides(weapon1, weapon2);
  if (clash && clash.collided) {
    playClash();
    knockback(player1, player2, 6);
    knockback(player2, player1, 6);
    setClash(); 
    weapon1.clashFlash = 255;
    weapon2.clashFlash = 255;
  }
}
