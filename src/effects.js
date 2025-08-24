import Matter from "matter-js";
const { Body } = Matter;

export function randomJump(target) {
  let rndIntX = Math.floor(Math.random() * 44) - 22;
  let rndIntY = Math.floor(Math.random() * 15) - 21;
  if (target.velocity.x < 2 && target.velocity.x > -2) {
    Body.applyForce(target, target.position, {
      x: rndIntX * 4,
      y: rndIntY
    });
  }
}

export function limitVelocity(body, max) {
  let vx = body.velocity.x;
  let vy = body.velocity.y;
  let speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > max) {
    Body.setVelocity(body, {
      x: vx / speed * max,
      y: vy / speed * max
    });
  }
}
