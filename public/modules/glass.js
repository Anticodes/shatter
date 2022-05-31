class Glass {

    constructor() {
        this.shards = [];
    }

    generate() {
        return this.setupBorders(this.generateCones());
    }

    generateCones() {
        const g = createGraphics(width, height, WEBGL);
        g.noStroke();
        g.noSmooth();
        g.colorMode(HSB);
        g.ortho();
        for (let i = 0; i < 12; i++) {
            let pos = p5.Vector.random2D().mult(random(64, 256));
            this.shards[i] = new Cone(pos, color(`hsb(${i * 30}, 100%, 100%)`));
            g.push();
            g.translate(pos.x, pos.y);
            g.rotateX(HALF_PI);
            g.fill(i * 30, 100, 100);
            g.cone(512, 1, 120);
            g.pop();
        }
        return g;
    }

    setupBorders(g) {
        g.loadPixels();
        const intersections = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * pixelRowCount + x * 4;
                let selfColor = getColor(g.pixels, i);
                let leftColor = x ? getColor(g.pixels, i - 4) : null;
                let topColor = y ? getColor(g.pixels, i - pixelRowCount) : null;
                let rightColor = x + 1 < width ? getColor(g.pixels, i + 4) : null;
                let bottomColor = y + 1 < height ? getColor(g.pixels, i + pixelRowCount) : null;
                //Check if 3 or more polygons merge
                const colorSet = [...new Set([selfColor?.toString(), leftColor?.toString(), rightColor?.toString(), topColor?.toString(), bottomColor?.toString()])].sort();
                if (colorSet.length > 2) {
                    //Make it black
                    if (!intersections.find(e => e.every((ele, index) => ele == colorSet[index]))) {
                        intersections.push(colorSet);
                    }
                }
            }
        }
        //After filtering out the 2 way intersections, convert the color to respected cone's index, so cones = [[1, 5, 4], [2, 3, 4]...]
        const cones = intersections.filter((e) => !e.includes(undefined)).map(e => e.map(el => this.shards.findIndex(ele => ele.colour.toString() == el)));
        //Find the intersection coordinate from 3 cones
        const corners = cones.map(e => findCircle(this.shards[e[0]].pos, this.shards[e[1]].pos, this.shards[e[2]].pos));
        //Convert cones into shards
        const shards = this.shards.map(e => new Shard(e.colour));
        //Add the intersecion points to the shard
        corners.forEach((item, index) => {
            cones[index].forEach(ele => shards[ele].points.push(item));
        });
        intersections.filter((e) => e.includes(undefined)).forEach(e => {
            const cone1 = this.shards.findIndex(el => el.colour.toString() == e[0]);
            const cone2 = this.shards.findIndex(el => el.colour.toString() == e[1]);
            const point = corners[cones.findIndex(el => el.includes(cone1) && el.includes(cone2))];
            const midPoint = p5.Vector.add(this.shards[cone1].pos.copy().div(2), this.shards[cone2].pos.copy().div(2));
            const direction = p5.Vector.sub(midPoint, point);
            const colour = g.get(Math.floor(midPoint.x) + width / 2, height / 2 - Math.floor(midPoint.y));
            if (!e.includes(color(colour).toString())) {
                direction.rotate(PI);
            }
            //Get the direction vector touch to the edge after being added to point vector
            g.push();
            g.translate(point.x, point.y, 15);
            g.circle(0, 0, 10);
            g.circle(direction.x, direction.y, 10);
            g.stroke(0);
            g.line(0, 0, direction.x, direction.y);
            g.pop();
        })
        console.log(this.shards);
        return g;
    }
}