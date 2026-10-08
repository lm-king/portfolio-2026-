// ==================== p5.js 动态背景 ====================

let particles = [];
let particleCount = 80;
let connectionDistance = 150;
let mouseInfluence = 200;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // 初始化粒子
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  clear();
  
  // 更新和显示所有粒子
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
    
    // 连接附近的粒子
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < connectionDistance) {
        let alpha = map(d, 0, connectionDistance, 100, 0);
        stroke(102, 126, 234, alpha * 0.3);
        strokeWeight(1);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
    
    // 鼠标交互
    let mouseD = dist(particles[i].x, particles[i].y, mouseX, mouseY);
    if (mouseD < mouseInfluence) {
      let force = map(mouseD, 0, mouseInfluence, 2, 0);
      stroke(118, 75, 162, 50);
      strokeWeight(1);
      line(particles[i].x, particles[i].y, mouseX, mouseY);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 粒子类
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.radius = random(2, 4);
    this.baseAlpha = random(50, 150);
    this.alpha = this.baseAlpha;
  }
  
  update() {
    // 移动
    this.x += this.vx;
    this.y += this.vy;
    
    // 边界检测（环绕）
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
    
    // 鼠标影响 - 轻微排斥
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < mouseInfluence && d > 0) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let force = map(d, 0, mouseInfluence, 0.5, 0);
      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
      this.alpha = map(d, 0, mouseInfluence, 255, this.baseAlpha);
    } else {
      this.alpha = lerp(this.alpha, this.baseAlpha, 0.05);
    }
  }
  
  display() {
    noStroke();
    fill(102, 126, 234, this.alpha * 0.6);
    ellipse(this.x, this.y, this.radius * 2);
    
    // 发光效果
    fill(102, 126, 234, this.alpha * 0.15);
    ellipse(this.x, this.y, this.radius * 4);
  }
}
