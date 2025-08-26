import Matter from "matter-js";
import { hp1, hp2, gameOver, winner } from "./state.js";
import {state} from "./state.js";
import { playClash, playHit } from "./audio.js";
import { growSpear, handleShieldCollision, handleShieldHit } from "./players.js";
import { addCut } from "./render.js";
import { KatanaCutImg } from "./game.js";

const { SAT, Body, World, Engine } = Matter;

export function knockback(body, from, force) {
  let dx = body.position.x - from.position.x;
  let dy = body.position.y - from.position.y;
  let len = Math.sqrt(dx*dx + dy*dy);
  if (len === 0) len = 0.0001;
  dx /= len; dy /= len;

  Body.setVelocity(body, { x: dx * force, y: dy * force });
}

export function handleHit(player, attacker, target, weapon , targetWeapon, targetIndex, attackerIndex , vars) {
  if (state.gameOver) return;

  const { setWinner, setHP } = vars;
  if (target.invul > 0 || state.gameOver) return;
  let col = SAT.collides(weapon, target);
  if (col && col.collided) {
    
    if(attacker.name === 'Thief' ){
          target.invul = 10;
    } else {
    target.invul = 20;
  }

  if(attacker.name !== 'Archer' && attacker.name !== 'Shielder' ) {playHit();}
  if (weapon.name === "Spearman") {
  growSpear(weapon, 5);
  target.invul = 7;
  }

  if(attacker.name === 'Archer' || attacker.name === "Shielder" ){
         target.hitFlash = 0;
          target.invul = 0;
    } else {
         target.hitFlash = 15;
    }
    if (attacker.name === "Viking") {
      // урон зависит от скорости
      let damageDealt = weapon.damage + weapon.spinSpeed * weapon.vikingCoef;
      state[`hp${targetIndex}`] = Math.max(0, state[`hp${targetIndex}`] - damageDealt);

      // сброс скорости к начальному значению
      weapon.spinSpeed = weapon.initialSpinSpeed;

      // увеличиваем коэффициент прироста урона
      weapon.vikingCoef += 0.05; // можно настроить рост
} else
if(attacker.name === "Samurai") {
  weapon.cuts = (weapon.cuts || 0) + 1;

  for (let i = 0; i < weapon.cuts; i++) {
    setTimeout(() => {
      // урон
      const hpKey = targetIndex;
      if(targetIndex === 1){
      state.hp1 = Math.max(0, state.hp1-1);
    
      if (state.hp1 === 0) {
        state.winner = attackerIndex;
        state.gameOver = true;
      }
    }
    else{
      state.hp2 = Math.max(0, state.hp2-1);
    
      if (state.hp2 === 0) {
        state.winner = attackerIndex;
        state.gameOver = true;
      }
    }

      target.hitFlash = 15;
      playHit();

      // добавляем визуальный порез
      addCut(target, KatanaCutImg); // katanaCutImg - загруженный спрайт пореза

    }, i * 150);
  }
} else {
  setHP(attacker, target); // обычный урон для других классов
}

target.flashStrength = 255;
target.flashType = "hit";


  }
}

export function handleSwordClash(weapon1, weapon2, player1, player2, vars) {
  const { clashCD, setClash } = vars;
  if (clashCD > 0 || state.gameOver) return;
  const clash = SAT.collides(weapon1, weapon2);
  if (clash && clash.collided && player1.name !=="Archer" && player2.name !=="Archer" ) {
    playClash();
    //knockback(player1, player2, 6);
    //knockback(player2, player1, 6);
    setClash(); 
    weapon1.clashFlash = 255;
    weapon2.clashFlash = 255;
  }
}
