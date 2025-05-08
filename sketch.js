let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

let engine;
let world;
let boxes = [];
let canvas;
let mConstraint;

let showCopyright = true;

// GUI 控制变量
let gui;
let params = {
  textInput: "X-DESIGN",
  textSize: 60,
  textColor: "#000000",
  bgColor: "#FFFFFF",
  saveImage: function () {
    showCopyright = false;  // 暂时隐藏版权
    redraw();               // 重绘一次去掉版权信息
    setTimeout(() => {
      saveCanvas(canvas, "falling-text", "png");
      showCopyright = true; // 恢复版权显示
    }, 200);
  }
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;

  createWalls();

  let canvasmouse = Mouse.create(canvas.elt);
  canvasmouse.pixelRatio = pixelDensity();
  let options = { mouse: canvasmouse };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);

  setupGUI();
}

function draw() {
  background(params.bgColor);
  Engine.update(engine);

  for (let box of boxes) {
    box.show();
  }

  if (showCopyright) {
    drawCopyright();
  }
}

function mousePressed() {
  if (params.textInput.trim() !== "") {
    boxes.push(new Box(mouseX, 0, params.textInput));
  }
}

class Box {
  constructor(x, y, text) {
    this.text = text;
    this.size = params.textSize;
    this.w = text.length * this.size * 0.6;
    this.h = this.size * 1.2;
    this.angle = random(-PI / 6, PI / 6);
    this.body = Bodies.rectangle(x, y, this.w, this.h, {
      restitution: 0.5,
      density: 0.04,
      friction: 0.9
    });
    Matter.Body.setAngle(this.body, this.angle);
    Matter.Body.setAngularVelocity(this.body, random(-0.2, 0.2));
    World.add(world, this.body);
  }

  show() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    textAlign(CENTER, CENTER);
    textSize(this.size);
    fill(params.textColor);
    textFont("Alibaba PuHuiTi Black");
    text(this.text, 0, 0);
    pop();
  }
}

function createWalls() {
  let options = { isStatic: true };
  let ground = Bodies.rectangle(width / 2, height + 5, width, 10, options);
  let ceiling = Bodies.rectangle(width / 2, -5, width, 10, options);
  let leftWall = Bodies.rectangle(-5, height / 2, 10, height, options);
  let rightWall = Bodies.rectangle(width + 5, height / 2, 10, height, options);
  World.add(world, [ground, ceiling, leftWall, rightWall]);
}

function setupGUI() {
  gui = new dat.GUI();
  gui.width = 300;
  gui.add(params, "textInput").name("输入文字");
  gui.add(params, "textSize", 20, 150).name("文字大小");
  gui.addColor(params, "textColor").name("文字颜色");
  gui.addColor(params, "bgColor").name("背景颜色");
  gui.add(params, "saveImage").name("保存图片");
}

function drawCopyright() {
  push();
  // --- 版权信息 ---
  fill(0);
  noStroke();
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  text(
    "Created by @Zhijie-Yi @LuANyxxx\n©️All my products are available for personal and commercial projects",
    width - 10,
    height - 10
  );
  pop();
}
