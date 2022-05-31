const socket = io.connect("http://localhost:3000");

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
    const g = glass.generate();
    g.loadPixels();
    graphic = createGraphics(width, height);
    graphic.loadPixels();
    let once = true;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * pixelRowCount + x * 4;
            let selfColor = getColor(g.pixels, i);
            let leftColor = x ? getColor(g.pixels, i - 4) : null;
            let rightColor = x + 1 < width ? getColor(g.pixels, i + 4) : null;
            let topColor = y ? getColor(g.pixels, i - pixelRowCount) : null;
            let bottomColor = y + 1 < height ? getColor(g.pixels, i + pixelRowCount) : null;
            //Check if 3 or more polygons merge
            const colorSet = new Set([selfColor?.toString(), leftColor?.toString(), rightColor?.toString(), topColor?.toString(), bottomColor?.toString()]);
            if (colorSet.size > 2) {
                //Make it black
                if (once) {
                    graphic.pixels[i] = 0;
                    graphic.pixels[i + 1] = 0;
                    graphic.pixels[i + 2] = 0;
                    graphic.pixels[i + 3] = 255;
                    once = false;
                } else {
                    once = true;
                }
            } else {
                //Keep the color
                graphic.pixels[i] = red(selfColor);
                graphic.pixels[i + 1] = green(selfColor);
                graphic.pixels[i + 2] = blue(selfColor);
                graphic.pixels[i + 3] = 0// alpha(selfColor);
            }
        }
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = y * pixelRowCount + x * 4;
            let selfColor = getColor(graphic.pixels, i);
            let leftColor = x ? getColor(graphic.pixels, i - 4) : null;
            let rightColor = x + 1 < width ? getColor(graphic.pixels, i + 4) : null;
            let topColor = y ? getColor(graphic.pixels, i - pixelRowCount) : null;
            let bottomColor = y + 1 < height ? getColor(graphic.pixels, i + pixelRowCount) : null;
            //Check if 3 or more polygons merge
            const colorSet = new Set([selfColor?.toString(), leftColor?.toString(), rightColor?.toString(), topColor?.toString(), bottomColor?.toString()]);
            if (colorSet.size > 2) {
                //Make it black
                graphic.pixels[i] = g.pixels[i];
                graphic.pixels[i + 1] = g.pixels[i + 1];
                graphic.pixels[i + 2] = g.pixels[i + 2];
                graphic.pixels[i + 3] = g.pixels[i + 3];
            } else {
                //Keep the color
                graphic.pixels[i] = red(selfColor);
                graphic.pixels[i + 1] = green(selfColor);
                graphic.pixels[i + 2] = blue(selfColor);
                graphic.pixels[i + 3] = 48// alpha(selfColor);
            }
        }
    }
    //Setting corner pixels to black
    //Top left
    graphic.pixels[0] = 0;
    graphic.pixels[1] = 0;
    graphic.pixels[2] = 0;
    //Top right
    graphic.pixels[pixelRowCount - 4] = 0;
    graphic.pixels[pixelRowCount - 3] = 0;
    graphic.pixels[pixelRowCount - 2] = 0;
    //Bottom left
    graphic.pixels[pixelCount - pixelRowCount] = 0;
    graphic.pixels[pixelCount - pixelRowCount + 1] = 0;
    graphic.pixels[pixelCount - pixelRowCount + 2] = 0;
    //Bottom right
    graphic.pixels[pixelCount - 4] = 0;
    graphic.pixels[pixelCount - 3] = 0;
    graphic.pixels[pixelCount - 2] = 0;
    graphic.updatePixels();
}

function draw() {
    background(255);
    image(graphic, 0, 0);
    glass.cones.forEach(e => e.render());
}

function mousePressed() {
    glass.cones.forEach((e) => {
        e.onMousePressed();
    })
}

const middlePoint = (pos1, pos2) => {
    return createVector((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
}

const getColor = (array, index) => {
    return color(array[index], array[index + 1], array[index + 2], array[index + 3]);
}