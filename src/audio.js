let clashSound = new Audio('/clash.wav')
let hitSound = new Audio('/hit.wav')
let shot = new Audio('/shot.mp3')

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
