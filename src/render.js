let sword1Sprite = null;
let sword2Sprite = null;
let player1Skin = null;
let player2Skin = null;

import { arrow } from "./game";

export function setWeaponSprites(img1, img2) {
  sword1Sprite = img1;
  sword2Sprite = img2;
}

export function setPlayerSkins(img1, img2) {
  player1Skin = img1;
  player2Skin = img2;
}

export function drawBody(p, body, col, hp, playerIndex = 1) {
  if (!body) return;
  const r = body.circleRadius || 20;

  p.push();
  p.translate(body.position.x, body.position.y);
  //p.rotate(body.angle);
  p.imageMode(p.CENTER);

  const skin = playerIndex === 1 ? player1Skin : player2Skin;

  if (skin) {
    p.noTint();
    p.image(skin, 0, 0, r * 2.2, r * 3.2);
  
  } else {
    p.fill(col);
    p.stroke(0);
    p.strokeWeight(2);
    p.ellipse(0, 0, r * 2);
  }

  // --- белый флеш (только при уроне)
  if (body.hitFlash > 0) {
    p.push();
    p.blendMode(p.ADD);
    p.fill(255, body.hitFlash*10);
    p.noStroke();
    p.ellipse(0, 0, r * 2);
    p.pop();
    body.hitFlash -= 1;
  }

  p.pop();

  // --- HP текст
  p.push();
  p.translate(body.position.x, body.position.y);
  if(playerIndex === 1)
  p.fill(0, 0, 155);
  else
  p.fill(105, 0, 0); 
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(60);
  
  //p.textStyle(p.BOLD);
  p.text(Math.round(hp), 0, 0);
  p.pop();
}



export function drawWeapon(p, body, col, playerIndex) {
  if (!body) return;

  p.push();
  p.translate(body.position.x, body.position.y);
  p.rotate(body.angle);
  p.imageMode(p.CENTER);

  const sprite = playerIndex === 1 ? sword1Sprite : sword2Sprite;

  if (sprite) {
    p.noTint();
    if(body.name === "Thief"){
        p.image(sprite, -5, 0, body.renderW, body.renderH);
    } if(body.name === "Knight"){
        p.image(sprite, 0, 0, body.renderW, body.renderH * 2);
    } if (body.name === "Mage"){
        p.image(sprite, 0, 0, body.renderW, body.renderH * 1.5);
                // --- магический шар на конце меча
        const orbRadius = 5 + body.damage * 1.5; // размер зависит от урона
        const orbX = body.renderW / 2 - 15; // конец меча по X
        const orbY = 0;                // центр по Y

        p.push();
        p.translate(orbX, orbY);
        p.noStroke();
        p.fill(255, 255, 0, 150); // полупрозрачный желтый
        p.ellipse(0, 0, orbRadius * 2); // сам шар

        // свечение вокруг
        p.fill(255, 255, 0, 50);
        p.ellipse(0, 0, orbRadius * 4); 
        p.pop();
    } if(body.name === "Archer"){
          p.imageMode(p.CENTER);
          p.image(sprite, -10, 0, body.renderW*1.6, body.renderH*1.6); 
    }

    // --- жёлтая вспышка при clash
    if (body.clashFlash > 0) {
      p.push();
      p.blendMode(p.ADD);
      p.fill(255, 255, 0, body.clashFlash); // жёлтая подсветка
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(0, 0, body.renderW * 1, body.renderH * 1, 3); // чуть больше меча
      p.pop();

      body.clashFlash -= 30; // затухает постепенно
    }
  } else {
    // fallback — прямоугольник
    p.fill(col);
    p.stroke(0);
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.rect(0, 0, body.renderW, body.renderH, 3);
  }

  p.pop();
}

export function drawHPBar(p, x, y, w, h, hp, col, label) {
  // безопасно приводим к числу и ограничиваем 0..100
  const val = Math.max(0, Math.min(100, Number(hp) || 0));

  p.rectMode(p.CORNER);

  // рамка
  p.fill(100);
  p.stroke(255);
  p.rect(x, y, w, h, 0);

  // заполнение
  p.noStroke();
  p.fill(col);
  p.rect(x, y, (val / 100) * w, h, 3);

  // подпись
  p.fill(col);
  p.textSize(20);
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(`${label}: ${Math.round(val)}`, x, y - 2);
}


