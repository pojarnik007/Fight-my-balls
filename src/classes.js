// classes.js
export const CLASSES = {
  Thief: {
    hp: 100,
    speed: 2,
    sprite: null, // сюда потом в setup/preload присвоим p5.Image
    weapon: { width: 70, height: 20, orbitRadius: 50, spinSpeed: 0.1, type: 'sword' },
    weaponSprite: null // p5.Image
  },
  Knight: {
    hp: 150,
    speed: 1,
    sprite: null,
    weapon: { width: 130, height: 24, orbitRadius: 60, spinSpeed: 0.05, type: 'sword' },
    weaponSprite: null
  },
  // пример нового класса
  Spearman: {
    hp: 15,
    speed: 1,
    weapon: {
      type: "spear",
      width: 200,
      height: 12,
      orbitRadius: 120,
      spinSpeed: 0.3
    },
    sprite: "/spearman.png",
    weaponSprite: "/spear.png"
  },
  Mage: {
    hp: 8,
    speed: 1.1,
    weapon: {
      type: "staff",
      width: 80,
      height: 16,
      orbitRadius: 70,
      spinSpeed: 0.4
    },
    sprite: "/mage.png",
    weaponSprite: "/staff.png"
  }
};