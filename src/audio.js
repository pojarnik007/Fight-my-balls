import clash from './audioAssets/clash.wav';
import hit from './audioAssets/hit.wav';
import shotm from './audioAssets/shot.mp3';


let clashSound = new Audio(clash)
let hitSound = new Audio(hit)
let shot = new Audio(shotm)

export function playClash() {
  const s = clashSound.cloneNode(true)
  s.play()
}

export function playHit() {
  const s = hitSound.cloneNode(true)
  s.play()
}

export function playShot() {
  const s = shot.cloneNode(true)
  s.play()
}
