import Matter from 'matter-js'
const { Body } = Matter

export function randomJump(target, setCooldown) {
  if (!target) return
  const multiplier = target.name === 'Fighter' ? 3 : 2
  const dir = Math.random() < 0.5 ? -1 : 1
  const fx = dir * multiplier * 30
  const fy = -multiplier * (0.5 + Math.random() * 0.5) * 20
  Body.applyForce(target, target.position, { x: fx, y: fy })
  if (setCooldown) setCooldown(60 + Math.floor(Math.random() * 120))
}

export function limitVelocity(body, max = 10) {
  let vx = body.velocity.x
  let vy = body.velocity.y
  let speed = Math.sqrt(vx * vx + vy * vy)
  const limit = body.name === 'Fighter' ? 20 : max
  if (speed > limit) {
    const scale = limit / speed
    Body.setVelocity(body, { x: vx * scale, y: vy * scale })
  }
}
