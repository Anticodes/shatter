class Glass {

    constructor() {
        this.cones = [];
    }

    generate() {
        const g = createGraphics(width, height, WEBGL);
        g.noStroke();
        g.noSmooth();
        g.colorMode(HSB);
        g.ortho();
        for (let i = 0; i < 12; i++) {
            let pos = p5.Vector.random2D().mult(random(64, 256));
            this.cones[i] = new Cone(pos);
            g.push();
            g.translate(pos.x, pos.y);
            g.rotateX(HALF_PI);
            g.fill(i * 20, 100, 100);
            g.cone(512, 1, 120);
            g.pop();
        }
        return g;
    }
}