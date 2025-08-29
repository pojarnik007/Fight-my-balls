import Matter from 'matter-js'

const { Body } = Matter

export function rotateWeapon(
  player,
  weapon,
  speed,
  direction = 1,
  weaponState,
) {
  if (!weaponState.currentSpeed) weaponState.currentSpeed = 0
  weaponState.currentSpeed = speed / 10.0
  weaponState.angle += weaponState.currentSpeed * direction

  if (weapon.type === 'fight') {
    Body.setPosition(weapon, { x: player.position.x, y: player.position.y })
    Body.setAngle(weapon, weaponState.angle)
  } else {
    Body.setPosition(weapon, {
      x: player.position.x + Math.cos(weaponState.angle) * weapon.orbitRadius,
      y: player.position.y + Math.sin(weaponState.angle) * weapon.orbitRadius,
    })
    Body.setAngle(weapon, weaponState.angle)
  }

  if (weapon.shield?.active && weapon.shield.body) {
    const shield = weapon.shield
    shield.angle = weaponState.angle

    Body.setPosition(shield.body, {
      x: player.position.x + Math.cos(shield.angle) * shield.orbitRadius,
      y: player.position.y + Math.sin(shield.angle) * shield.orbitRadius,
    })
    Body.setAngle(shield.body, shield.angle)
  }
}

export let weapon1State = { angle: 0, radius: 50, currentSpeed: 0 }
export let weapon2State = { angle: 0, radius: 50, currentSpeed: 0 }
