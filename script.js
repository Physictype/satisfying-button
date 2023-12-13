var beingClicked = false;
var clicks = 0;
var confettiPosition = [];
var confettiVelocity = [];
var confettiColor = []
var gravity = 5;
var offset;
var shakeTime = 0;
var shaking = false;

function setup() {
    createCanvas(1000,700);
    confettiColor.push([255,50,50]);
    offset = createVector(0,0);
}

function draw() {
    if (shaking) {
        shakeTime += deltaTime;
        if (shakeTime > 200) {
            shaking = false;
            offset = createVector(0,0);
        } else {
            offset = createVector(Math.random()*10-5,Math.random()*10-5);
        }
    }
    translate(offset.x+250,offset.y+225);
    background(255);
    noStroke();
    if (!beingClicked) {
        fill(117, 184, 255);
        rect(-50,-25,100,50,10,10);
    } else {
        fill(78, 163, 252);
        rect(-45,-22.5,90,45,10,10);
    }
    translate(-250,-225)
    for (let i = 0; i < confettiPosition.length; i++) {
        push();
        translate(offset.x,offset.y);
        fill(confettiColor[i][0],confettiColor[i][1],confettiColor[i][2]);
        translate(confettiPosition[i].x+5,confettiPosition[i].y+2.5)
        rotate(confettiVelocity[i].heading());
        rect(-5,-2.5,10,5);
        confettiVelocity[i].y += gravity*deltaTime/50;
        confettiPosition[i].add(p5.Vector.mult(confettiVelocity[i],deltaTime/50));
        if (confettiPosition[i].y >= 500) {
            confettiPosition.splice(i,1);
            confettiVelocity.splice(i,1);
            confettiColor.splice(i,1);
        }
        pop();
    }
}
function mousePressed() {
    if (mouseX > 200 && mouseX < 300 && mouseY > 200 && mouseY < 250) {
        clicks += 1;
        console.log(clicks);
        beingClicked = true;
        releaseConfetti()
        shaking=true;
        shakeTime = 0;
    }
}
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
function releaseConfetti() {
    for (let i = -25; i <= 25; i++) {
        confettiPosition.push(createVector(250,225));
        confettiVelocity.push(createVector(50*Math.cos(i/100*PI+PI/2),-50*Math.sin(i/100*PI+PI/2)));
        let rgb = HSVtoRGB(Math.random(),0.8,1);
        confettiColor.push([rgb.r,rgb.g,rgb.b])
    }
}
function mouseReleased() {
    beingClicked = false;
}