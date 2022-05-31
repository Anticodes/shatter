const socket = io.connect("http://localhost:8080");

socket.on("refresh", () => {
    location.reload();
});

const glass = new Glass();
const width = 512, height = 512;
const pixelRowCount = width * 4;
const pixelCount = height * pixelRowCount;
var graphic;

function setup() {
    createCanvas(width, height);
    pixelDensity(1);
    noSmooth();
    noStroke();
    graphic = glass.generate();
}

function draw() {
    background(255);
    image(graphic, 0, 0);
}

function mousePressed() {
}

const middlePoint = (pos1, pos2) => {
    return createVector((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
}

const getColor = (array, index) => {
    return color(array[index], array[index + 1], array[index + 2], array[index + 3]);
}

const findCircle = (pos1, pos2, pos3) => {
    const x12 = (pos1.x - pos2.x);
    const x13 = (pos1.x - pos3.x);

    const y12 = (pos1.y - pos2.y);
    const y13 = (pos1.y - pos3.y);

    const y31 = (pos3.y - pos1.y);
    const y21 = (pos2.y - pos1.y);

    const x31 = (pos3.x - pos1.x);
    const x21 = (pos2.x - pos1.x);

    const sx13 = Math.pow(pos1.x, 2) - Math.pow(pos3.x, 2);

    const sy13 = Math.pow(pos1.y, 2) - Math.pow(pos3.y, 2);

    const sx21 = Math.pow(pos2.x, 2) - Math.pow(pos1.x, 2);
    const sy21 = Math.pow(pos2.y, 2) - Math.pow(pos1.y, 2);

    const f = ((sx13) * (x12)
        + (sy13) * (x12)
        + (sx21) * (x13)
        + (sy21) * (x13))
        / (2 * ((y31) * (x12) - (y21) * (x13)));
    const g = ((sx13) * (y12)
        + (sy13) * (y12)
        + (sx21) * (y13)
        + (sy21) * (y13))
        / (2 * ((x31) * (y12) - (x21) * (y13)));

    const h = -g;
    const k = -f;

    return createVector(h, k);
}