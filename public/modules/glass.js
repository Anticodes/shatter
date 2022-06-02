class Glass {

    constructor() {
        this.shards = [];
    }

    generate(polygonCount) {
        return this.setupBorders(this.generateCones(polygonCount));
    }

    generateCones(polygonCount) {
        const g = createGraphics(dimension, dimension, WEBGL);
        g.noStroke();
        g.noSmooth();
        g.colorMode(HSB);
        g.ortho();
        let cones = getItem("cones");
        const colorOffset = 360 / polygonCount;
        if (cones) {
            cones = JSON.parse(cones);
            for (let i = 0; i < polygonCount; i++) {
                let pos = createVector(cones[i].x, cones[i].y);
                this.shards[i] = new Cone(pos, color(`hsb(${i * colorOffset}, 100%, 100%)`));
                g.push();
                g.translate(pos.x, pos.y);
                g.rotateX(HALF_PI);
                g.fill(i * colorOffset, 100, 100);
                g.cone(dimension, 1, 120);
                g.pop();
            }
        } else {
            for (let i = 0; i < polygonCount; i++) {
                let pos = p5.Vector.random2D().mult(random(dimension / 8, dimension / 2));
                this.shards[i] = new Cone(pos, color(`hsb(${i * colorOffset}, 100%, 100%)`));
                g.push();
                g.translate(pos.x, pos.y);
                g.rotateX(HALF_PI);
                g.fill(i * colorOffset, 100, 100);
                g.cone(dimension, 1, 120);
                g.pop();
            }
        }
        return g;
    }

    setupBorders(g) {
        g.loadPixels();
        const intersections = [];
        const intersectionPoints = [];
        for (let y = 0; y < dimension; y++) {
            for (let x = 0; x < dimension; x++) {
                const i = y * pixelRowCount + x * 4;
                let selfColor = getColor(g.pixels, i);
                let leftColor = x ? getColor(g.pixels, i - 4) : null;
                let topColor = y ? getColor(g.pixels, i - pixelRowCount) : null;
                let rightColor = x + 1 < dimension ? getColor(g.pixels, i + 4) : null;
                let bottomColor = y + 1 < dimension ? getColor(g.pixels, i + pixelRowCount) : null;
                //Check if 3 or more polygons merge
                const colorSet = [...new Set([selfColor?.toString(), leftColor?.toString(), rightColor?.toString(), topColor?.toString(), bottomColor?.toString()])].sort();
                if (colorSet.length > 2) {
                    //Make it black
                    if (!intersections.find(e => e.every((ele, index) => ele == colorSet[index]))) {
                        intersections.push(colorSet);
                        intersectionPoints.push(createVector(x - dimension / 2, dimension / 2 - y));
                    }
                }
            }
        }
        //Convert cones into shards
        const shards = this.shards.map(e => new Shard(e.colour));
        //After filtering out the 2 way intersections, convert the color to respected cone's index, so cones = [[1, 5, 4], [2, 3, 4]...]
        const cones = intersections.filter((e) => !e.includes(undefined)).map(e => e.map(el => this.shards.findIndex(ele => ele.colour.toString() == el)));
        //Find the intersection coordinate from 3 cones
        const threeplus = cones.map(e => findCircle(this.shards[e[0]].pos, this.shards[e[1]].pos, this.shards[e[2]].pos));
        //Add the intersecion points to the shard
        threeplus.forEach((item, index) => cones[index].forEach(ele => shards[ele].points.push(item)));
        //Find and add the two way intersections to their respected shard
        intersections.filter((e) => e.includes(undefined)).forEach(e => {
            [e[0], e[1]].forEach(ele => shards.find(el => el.colour.toString() == ele).points.push(intersectionPoints[intersections.indexOf(e)]));
        });
        const corners = [[0, 0], [dimension - 1, 0], [0, dimension - 1], [dimension - 1, dimension - 1]];
        //Find the corresponding shard for that corner and add to it
        corners.forEach(e => shards.find(el => el.colour.toString() == color(g.get(e[0], e[1])).toString()).points.push(createVector(e[0] - dimension / 2, dimension / 2 - e[1])));
        this.shards = shards;
        return g;
    }
}