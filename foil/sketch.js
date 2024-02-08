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
let backgroundMusic;

function preload() {
  font = loadFont('HomadeTrial.ttf');
  starModels = loadModel('foil.obj', true);
  starUV = loadImage('foil.jpg');
  backgroundMusic = loadSound('warning.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mic = new p5.AudioIn();
  mic.start();
  initializeStars();
  noStroke();
  textFont(font);

  backButton = createButton('Ignore');
  backButton.position(40, 455);
  backButton.style('background-color', '#0a00bf'); 
  backButton.style('color', '#ff0051'); 
  backButton.style('font-family', 'HomadeTrial'); 
  backButton.style('width', '70px'); 
  backButton.style('height', '30px');
  backButton.style('box-shadow', 'none');
  backButton.mousePressed(goBackToIndex);

  // 음악을 자동 재생
  backgroundMusic.loop();
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
  fill(46, 37, 37);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Warning! \nThe proliferation of space debris poses a grave risk to Earth's biosphere, \nthreatening biodiversity and ecological balance. \nAs debris continues to accumulate in orbit, the potential for catastrophic collisions grows, jeopardizing \nnot only current space missions but also the delicate web of life that sustains us. \nFurthermore, the exponential increase in space debris amplifies the likelihood of cascading collisions, \ncreating a perilous environment for satellites crucial to global communication, \nweather forecasting, and navigation systems. The unchecked proliferation of debris \nnot only endangers human activities in space \nbut also threatens to exacerbate the already pressing issue of space sustainability.", -800, -250);

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
