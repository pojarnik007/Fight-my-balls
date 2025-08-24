let clashSound = new Audio("/clash.wav");
let hitSound = new Audio("/hit.wav");

export function playClash() { clashSound.play(); }
export function playHit() { hitSound.play(); }