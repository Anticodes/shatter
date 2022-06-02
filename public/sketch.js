const socket = io.connect("http://localhost:8080");

socket.on("refresh", () => {
    location.reload();
});

const glass = new Glass();
const dimension = 512;
const polygonCount = 18;
const canvasScale = 1.8;
const diagonalSize = dimension * Math.sqrt(2);
const pixelRowCount = dimension * 4;
const pixelCount = dimension * pixelRowCount;
var graphic;

function setup() {
    createCanvas(dimension * canvasScale, dimension * canvasScale);
    pixelDensity(1);
    noStroke();
    graphic = glass.generate(polygonCount);
    createButton("Save").mousePressed(() => storeItem("cones", JSON.stringify(glass.shards.map(e => { return { 'x': e.pos.x, 'y': e.pos.y } }))));
    createButton("Reset").mousePressed(clearStorage);
}

let once = true;
function draw() {
    background(255);
    scale(canvasScale);
    //image(graphic, 0, 0);
    glass.shards.forEach(e => {
        if (once) console.log(e);
        fill(e.colour);
        beginShape(TRIANGLE_STRIP);
        for (let i = 0; i < e.points.length; i += 2) {
            vertex(e.points[i].x + dimension / 2, e.points[i].y + dimension / 2);
            vertex(e.points[(i + 1) % e.points.length].x + dimension / 2, e.points[(i + 1) % e.points.length].y + dimension / 2);
            vertex(e.points[(i + 2) % e.points.length].x + dimension / 2, e.points[(i + 2) % e.points.length].y + dimension / 2);
            vertex(e.points[i].x + dimension / 2, e.points[i].y + dimension / 2);
            vertex(e.points[(i + 1) % e.points.length].x + dimension / 2, e.points[(i + 1) % e.points.length].y + dimension / 2);
            vertex(e.points[(i + 3) % e.points.length].x + dimension / 2, e.points[(i + 3) % e.points.length].y + dimension / 2);
        }
        endShape();
    });
    once = false;
}

function mousePressed() {
    graphic = glass.generate(polygonCount);
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

    const sx13 = pos1.x * pos1.x - pos3.x * pos3.x;
    const sy13 = pos1.y * pos1.y - pos3.y * pos3.y;
    const sx21 = pos2.x * pos2.x - pos1.x * pos1.x;
    const sy21 = pos2.y * pos2.y - pos1.y * pos1.y;

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