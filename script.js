// TODO: MOUSE VACUUM + CONFETTI PILE
var beingClicked = false;
var clicks = 0;
var confettiPosition = [];
var confettiVelocity = [];
var confettiTouched = []
var confettiColor = []
var confettiTouchingIndex = [];
var dotsPosition = [];
var dotsVelocity = [];
var gravity = 5;
var offset;
var shake = 5;
var shakeTime = 0;
var shaking = false;
var holdTime = 0;
var holdTimer = 0;
var angle = 0;
var switchMouse = false;
var mouseDown = false;
var hasGravity = true;

function distSquared(x1,y1,x2,y2) {
    return (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
}
function magSquared(x,y) {
    return x*x+y*y;
}

function setup() {
    createCanvas(screen.width,screen.height);
    confettiColor.push([255,50,50]);
    offset = createVector(0,0);
    noCursor();
    p5.disableFriendlyErrors = true;
}
function glow(glowColor, blurriness) {
    drawingContext.shadowColor = glowColor;
    drawingContext.shadowBlur = blurriness;
  }

function draw() {
    background(255);
    translate(offset.x+screen.width/2,offset.y+screen.height/2);
    if (beingClicked) {
        holdTime += deltaTime;
        if (holdTime > 500) {
            glow(color(78, 252, 246),12);
            // scale(0.9)
            shake = 15;
            holdTimer += deltaTime;
            if (holdTimer > 20) {
                clicks += 1;
                beingClicked = true;
                releaseConfetti()
                shaking=true;
                shakeTime = 0;
                holdTimer = 0;
            }
        }
    }
    if (shaking) {
        shakeTime += deltaTime;
        if (shakeTime > 200) {
            shaking = false;
            offset = createVector(0,0);
        } else {
            offset = createVector(Math.random()*shake*2-shake,Math.random()*shake*2-shake);
        }
    }
    noStroke();
    if (!beingClicked) {
        fill(117, 184, 255);
        rect(-50,-25,100,50,10,10);
    } else {
        if (holdTime > 500) {
            fill(78, 252, 246);
        } else {
            fill(78, 163, 252);
        }
        
        rect(-45,-22.5,90,45,10,10);
    }
    for (let i = 0; i < confettiPosition.length; i++) {
        push();
        translate(offset.x,offset.y);
        fill(confettiColor[i][0],confettiColor[i][1],confettiColor[i][2]);
        glow(color(confettiColor[i][0],confettiColor[i][1],confettiColor[i][2]),12);
        translate(confettiPosition[i].x,confettiPosition[i].y)
        if (mag(confettiVelocity[i].x,confettiVelocity[i].y) < 0.1) {
            rotate(0);
        } else {
            rotate(confettiVelocity[i].heading());
        }
        rect(-5,-2.5,10,5);
        if (confettiTouchingIndex[i]!=-1) {
            confettiVelocity[i] = createVector(0,0);
            if (confettiPosition[i].y < screen.height/2-2.5||confettiTouchingIndex[i]>=confettiTouchingIndex.length||!(confettiTouchingIndex[i]==-2||(confettiPosition[i].y > confettiPosition[confettiTouchingIndex[i]].y-5 && confettiPosition[i].y < confettiPosition[confettiTouchingIndex[i]].y+5 && confettiTouched[confettiTouchingIndex[i]] && Math.abs(confettiPosition[i].x-confettiPosition[confettiTouchingIndex[i]].x)<10))) {
                confettiTouchingIndex[i] = -1;
            }
        }
        
        if (confettiTouchingIndex[i]==-1 && hasGravity) {
            confettiVelocity[i].y += gravity*deltaTime/50;
        } else {
            
        }
        if (confettiTouched[i]) {
            let mPos = createVector(mouseX-screen.width/2,constrain(mouseY-screen.height/2,-screen.height/2,screen.height/2));
            
            let accel = p5.Vector.mult(p5.Vector.div(p5.Vector.normalize(p5.Vector.sub(mPos,confettiPosition[i])),distSquared(mPos.x,mPos.y,confettiPosition[i].x,confettiPosition[i].y)),Math.pow(-1,switchMouse)*10000);
            if (magSquared(accel.x,accel.y)<1) {
                accel = createVector(0,0);
            }
            confettiVelocity[i].add(accel);
            if (distSquared(confettiPosition[i].x,confettiPosition[i].y,mPos.x,mPos.y)<400) {
                console.log("WHEEE");
            }
        }
        confettiPosition[i].add(p5.Vector.mult(confettiVelocity[i],deltaTime/50));
        // for (let j = 0; j < confettiPosition.length; j++) {
        //     if (i == j) {
        //         continue;
        //     }
        //     if (confettiPosition[i].y < confettiPosition[j].y + 10 && p5.Vector.sub(confettiPosition[i],p5.Vector.mult(confettiVelocity[i],deltaTime/50)).y > confettiPosition[j].y + 10) {
        //         confettiPosition[i].y = confettiPosition[j].y + 30
        //         confettiVelocity[i] = createVector(0,0);
        //         break;
        //     }
        // }
        if (confettiTouchingIndex[i]==-1) {
            for (let j = 0; j < confettiPosition.length; j++) {
                if (i == j) {
                    continue;
                }
                if (confettiPosition[i].y > confettiPosition[j].y-5 && confettiPosition[i].y < confettiPosition[j].y+5 && confettiTouched[j] && Math.abs(confettiPosition[i].x-confettiPosition[j].x)<10) {
        
                    confettiPosition[i].y = confettiPosition[j].y-5;
                    confettiVelocity[i] = createVector(0,0);
                    confettiTouched[i] = true;
                    confettiTouchingIndex[i] = j;
                }
            }
        }
        if (confettiPosition[i].y >= screen.height/2-2.5) {
            confettiPosition[i].y = screen.height/2-2.5;
            confettiVelocity[i] = createVector(0,0);
            confettiTouched[i] = true;
            confettiTouchingIndex[i] = -2;
        }
        if (Math.abs(confettiPosition[i].x) >= screen.width/2) {
            confettiPosition.splice(i,1);
            confettiVelocity.splice(i,1);
            confettiTouched.splice(i,1);
            confettiColor.splice(i,1);
            confettiTouchingIndex.splice(i,1);
            for (let j = 0; j < confettiTouchingIndex.length; j++) {
                if (confettiTouchingIndex[j]==i) {
                    confettiTouchingIndex[j] = -1;
                }
                if (confettiTouchingIndex[j]>i) {
                    confettiTouchingIndex[j] -= 1;
                }
            }
        }
        pop();
    }
    push();
    if (switchMouse) {
        fill(255,0,0);
        glow(color(255,0,0),12);
    } else {
        fill(0,255,0);
        glow(color(0,255,0),20);
    }
    if (mouseDown) {
        circle(mouseX-screen.width/2, mouseY-screen.height/2, 10);
    } else {
        circle(mouseX-screen.width/2, mouseY-screen.height/2, 15);
    }
    pop();
    
    // for (let i = 0; i < dotsPosition.length; i++) {
    //     push();
    //     fill(251, 255, 0);
    //     glow(color(251,255,0),30);
    //     translate(offset.x,offset.y);
    //     translate(dotsPosition[i].x,dotsPosition[i].y);
    //     ellipse(-10,-10,20,20);
    //     dotsPosition[i].add(p5.Vector.mult(dotsVelocity[i],1));
    //     if (dotsPosition[i].x<-screen.width/2+10||dotsPosition[i].x>screen.width/2-10) {
    //         dotsVelocity[i].x *= -1;
    //     }
    //     if (dotsPosition[i].y<-screen.height/2+10||dotsPosition[i].y>screen.height/2-10) {
    //         dotsVelocity[i].y *= -1;
    //     }
    //     for (let j = 0; j < dotsPosition.length; j++) {
    //         if (i == j) {
    //             continue;
    //         }
    //         if (dist(dotsPosition[i].x,dotsPosition[i].y,dotsPosition[j].x,dotsPosition[j].y)<=20) {
    //             console.log("ok")
    //             dotsPosition.splice(i,1);
    //             if (i > j) {
    //                 dotsPosition.splice(j,1);
    //             } else {
    //                 dotsPosition.splice(j-1,1);
    //             }
    //             break;
    //         }
    //     }
    //     pop();
    // }
}
function mousePressed() {
    if (mouseX > screen.width/2-50 && mouseX < screen.width/2+50 && mouseY > screen.height/2-25 && mouseY < screen.height/2+25) {
        clicks += 1;
        beingClicked = true;
        releaseConfetti()
        shaking=true;
        shakeTime = 0;
        holdTime = 0;
    }
    mouseDown = true;
}
function keyPressed() {
    console.log(key)
    if (key==" ") {
        switchMouse = !switchMouse;
    }
    if (keyCode==SHIFT) {
        hasGravity = false;
    }
}
function keyReleased() {
    if (keyCode==SHIFT) {
        hasGravity = true;
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
        confettiPosition.push(createVector(0,0));
        confettiVelocity.push(createVector(50*Math.cos(i/100*PI+PI/2)+Math.random()*8-4,-50*Math.sin(i/100*PI+PI/2)+Math.random()*8-4));
        confettiTouched.push(false);
        confettiTouchingIndex.push(-1);
        let rgb = HSVtoRGB(Math.random(),0.8,1);
        confettiColor.push([rgb.r,rgb.g,rgb.b])
    }
    let vel = createVector(Math.cos(Math.random()*2*PI)*10,Math.sin(Math.random()*2*PI)*10);
    dotsPosition.push(vel);
    dotsVelocity.push(vel);
}
function mouseReleased() {
    beingClicked = false;
    shake = 5;
    glow(color(255,255,255),0);
    mouseDown = false;
}