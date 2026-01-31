


const gravity = 0.6;
let score = 0, hi = 0;
let gamespeed = 6;
let hidisp = "";
let ground = {
    x: 300,
    y: 380,
    width: 4751,
};

let airpln = {
    x: 70,
    y: 330,
    l: 50,
    b: 20,
    vel: 0,
};

//* Animations
// airpln
let pl;
// towers
let tower;
// cloud
let cloud;
// ground
let gnd;
let font;

let over, restart;
let a = 0;

let towers = [],
    clouds = [];

let running = true;

function preload() {
    pl = loadImage("./images/plane.png");
    tower = loadImage("./images/tower.png");
    gnd = loadImage("./images/ground.png");
    cloud = loadImage("./images/cloud.png");
    over = loadImage("./images/gameOver.png");
    restart = loadImage("./images/restart.png");
    font = loadFont("./images/PressStart2P-Regular.ttf");
}

function setup() {
    createCanvas(windowWidth, 400);
    rectMode(CENTER);
    imageMode(CENTER);
}

function draw() {
    background(200);
    spawnClouds();

    gamespeed += score / 100000;
    if (frameCount % 10 === 0 && running) {
        score++;
    }
    textFont(font);
    fill(80);

    text(`${String(score).padStart(5, 0)}`, width - 80, 30);
    text(hidisp, width - 200, 30);
    image(gnd, ground.x, ground.y - 20);
    if (running) {
        ground.x -= gamespeed;
    }
    if (ground.x + ground.width/2 < width) {
        ground.x = ground.width/2;
    }

    if (!running) {
        airpln.vel = 0;
    }
    airpln.y += airpln.vel;
    airpln.vel += gravity;

    if (airpln.y > 330 && running) {
        airpln.y = 330;
    }

    if (running && airpln.y === 330) {
        if (keyIsDown(32)) {
            airpln.vel = -15;
        }
    }

    spawnTowers();
    if (!running) {
        push();
        translate(airpln.x, airpln.y);
        rotate(a);
        if (a < PI / 2 - 0.5) {
            a += 0.5;
        }
        image(pl, 0, 0, 60, 20);
        if (airpln.y <= 350) {
            airpln.y += 5;
        }
        pop();
    } else {
        image(pl, airpln.x, airpln.y, 60, 20);
    }

    if (!running) {
        image(over, width / 2, height / 2);
        image(restart, width / 2, (2 * height) / 3, 50, 40);
    }
}

function keyPressed() {
    if (!running) {
        reset();
    }
}

function mousePressed() {
    if (running && airpln.y === 330) {
        airpln.vel = -15;
    }

    if (
        !running &&
        mouseX > width / 2 - 25 &&
        mouseX < width / 2 + 25 &&
        mouseY > (2 * height) / 3 - 20 &&
        mouseY < (2 * height) / 3 + 20
    ) {
        reset();
    }
}

function spawnClouds() {
    if (frameCount % 100 === 0 && running) {
        let cloud = {
            x: random(620, 680),
            y: random(30, 300),
        };
        clouds.push(cloud);
    }

    for (let i = 0; i < clouds.length; i++) {
        image(cloud, clouds[i].x, clouds[i].y);
        if (running) {
            clouds[i].x -= 2;
        }
    }

    for (let i = 0; i < clouds.length; i++) {
        if (clouds[i].x < -50) {
            clouds.splice(i, 1);
        }
    }
}

function spawnTowers() {
    if (frameCount % 100 === 0 && running) {
        towers.push({
            x: random(width + 20, width + 80),
            y: 335,
            l: 75,
            b: 100,
            index: round(random(0, 5)),
            vel: gamespeed,
        });
    }

    for (let i = 0; i < towers.length; i++) {
        image(tower, towers[i].x, towers[i].y, towers[i].l, towers[i].b);
        if (
            airpln.x - airpln.l / 2 < towers[i].x + towers[i].l / 2 &&
            airpln.x + airpln.l / 2 > towers[i].x - towers[i].l / 2 &&
            airpln.y + airpln.b / 2 > towers[i].y - towers[i].b / 2 &&
            airpln.y - airpln.b / 2 < towers[i].y + towers[i].b / 2
        ) {
            running = false;
        }

        if (running) {
            towers[i].x -= towers[i].vel;
        }
    }

    for (let i = 0; i < towers.length; i++) {
        if (towers[i].x < -50) {
            towers.splice(i, 1);
        }
    }
}

function reset() {
    running = true;
    gamespeed = 6;
    towers = [];
    clouds = [];

    if (score > hi) {
        hidisp = "HI " + String(score).padStart(5, 0);
        hi = score;
    }
    score = 0;
}
