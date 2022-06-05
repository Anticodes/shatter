class Shard {

    constructor(colour) {
        this.selected = false;
        this.colour = colour;
        this.points = [];
    }

    render() {
        fill(this.colour);
        beginShape();
        this.points.forEach(el => vertex(el.x + dimension / 2, el.y + dimension / 2));
        endShape(CLOSE);
    }

    onMousePressed() {
        if (this.pos.dist(createVector(mouseX - 256, mouseY - 256)) < 5) {
            this.selected = !this.selected;
            console.log(this);
        }
    }
}