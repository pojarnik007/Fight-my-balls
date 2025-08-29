import Matter from "matter-js";
const { Body } = Matter;


export function randomJump(target, setCooldown) {
  if (!target) return;

  // сила толчка
  const multiplier = target.name === "Fighter" ? 3 : 2;

  // направление: -1 (влево) или +1 (вправо)
  const dir = Math.random() < 0.5 ? -1 : 1;

  // горизонтальный толчок
  const fx = dir * multiplier * 30;

  // вертикальный толчок всегда вверх
  const fy = -multiplier * (0.5 + Math.random() * 0.5) * 20;

  Body.applyForce(target, target.position, { x: fx, y: fy });

  // кулдаун на след. прыжок
  if (setCooldown) setCooldown(60 + Math.floor(Math.random() * 120));
}




export function limitVelocity(body, max = 10) {
  let vx = body.velocity.x;
  let vy = body.velocity.y;
  let speed = Math.sqrt(vx * vx + vy * vy);

  const limit = body.name === "Fighter" ? 20 : max;

  if (speed > limit) {
    const scale = limit / speed;
    Body.setVelocity(body, { x: vx * scale, y: vy * scale });
  }
}

