import Matter from "matter-js";

const { Body } = Matter;

export function rotateWeapon(player, weapon, speed, direction = 1, weaponState) {
  // weaponState.currentSpeed — текущая скорость вращения
  if (!weaponState.currentSpeed) weaponState.currentSpeed = 0;

  // скорость растёт пропорционально переданному speed
  weaponState.currentSpeed = speed/10.0; // регулируем коэффициент, чтобы не слишком быстро

  // угол увеличивается на текущую скорость
  weaponState.angle += weaponState.currentSpeed * direction;

  // позиция оружия по кругу
  Body.setPosition(weapon, {
    x: player.position.x + Math.cos(weaponState.angle) * weapon.orbitRadius,
    y: player.position.y + Math.sin(weaponState.angle) * weapon.orbitRadius
  });

  Body.setAngle(weapon, weaponState.angle);
}


export let weapon1State = { angle: 0, radius: 50 };
export let weapon2State = { angle: 0, radius: 50 };
