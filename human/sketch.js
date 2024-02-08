let starData = [
  {"x": 118, "y": 247},
  {"x": 160, "y": 214},
  {"x": 214, "y": 207},
  {"x": 264, "y": 214},
  {"x": 309, "y": 232},
  {"x": 350, "y": 264},
  {"x": 356, "y": 306},
  {"x": 342, "y": 345},
  {"x": 312, "y": 375},
  {"x": 269, "y": 394},
  {"x": 225, "y": 397},
  {"x": 183, "y": 381},
  {"x": 150, "y": 349},
  {"x": 134, "y": 309},
  {"x": 128, "y": 264}
];

let stars = [];
let starModels;
let starUV;
let mic;
let font;
let backButton;

function preload() {
  // 사용할 폰트를 preload 함수 내에서 로드합니다.
  font = loadFont('HomadeTrial.ttf');
  starModels = loadModel('Soobeen2.obj', true);
  starUV = loadImage('Soobeen2.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mic = new p5.AudioIn();
  mic.start();
  initializeStars();
  noStroke();

  // 설정한 폰트를 사용합니다.
  textFont(font);

 
  backButton = createButton('Ignore');
  backButton.position(40, 485);
  backButton.style('background-color', '#0a00bf'); 
  backButton.style('color', '#ff0051'); 
  backButton.style('font-family', 'HomadeTrial'); 
  backButton.style('width', '70px'); 
  backButton.style('height', '30px');
  backButton.style('box-shadow', 'none');
  backButton.mousePressed(goBackToIndex);
}

function goBackToIndex() {
  window.location.href = '../index.html';
}

function initializeStars() {
  for (let i = 0; i < starData.length; i++) {
    let x = map(starData[i].x, 0, 400, width * 0.25, width * 0.75);
    let y = map(starData[i].y, 0, 400, height * 0.25, height * 0.75);
    stars.push(new StarClass(x, y));
  }
}

function draw() {
  background(0);
  let vol = mic.getLevel();
  
  if (vol > 0.03) {
    display3DModels();
    drawLines();
  }

  // 좌측 상단에 텍스트 추가
  fill(240, 252, 3);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Space debris refers to the tiny particles or waste generated from space activities, \nranging from thousands to millions in number and varying in size from millimeters to meters. \nWhy should we pay attention to these debris?\nThey are not immediately visible nor do they seem threatening to us. \nHowever, such space debris poses significant threats not only to space activities and exploration but also to Earth's environment. \nDebris resulting from collisions may not disintegrate upon entering Earth's atmosphere \nand can remain as small fragments in the atmosphere. \nThis not only threatens spacecraft and satellites \nbut also affects Earth's atmospheric chemistry, potentially containing hazardous chemicals. \nMoreover, space debris can fall into the atmosphere or oceans, \nimpacting Earth's ecosystems.", -800, -250);

}





function display3DModels() {
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    
    // 3D 모델을 별의 위치에 배치하고 크기를 조절
    push();
    translate(star.pos.x - width / 2, star.pos.y - height / 2, 0);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    scale(0.85);
    texture(starUV); // Apply texture before the model
    model(starModels);
    pop();
  }
}

function drawLines() {
  noFill();
  //stroke(21, 0, 255);
  beginShape();
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    vertex(star.pos.x, star.pos.y);
  }
  endShape(CLOSE);
}

class StarClass {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = random(5, 15);
    this.blinkRate = random(0.1, 0.5);
    this.blink = false;
  }

  update(vol) {
    this.vel.add(p5.Vector.random2D().mult(vol * 5));
    this.pos.add(this.vel);

    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.vel.mult(-1);
    }

    if (frameCount % floor(random(30, 60)) === 0) {
      this.blink = true;
    }
    if (this.blink) {
      this.size += 1;
      if (this.size > 15) {
        this.blink = false;
        this.size = random(5, 15);
      }
    }
  }

  display() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}
