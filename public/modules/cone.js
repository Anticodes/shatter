class Cone {

    constructor(pos) {
        this.pos = pos;
        this.selected = false;
    }

    render() {
        fill(this.selected ? 15 : 180);
        circle(this.pos.x + width / 2, this.pos.y + height / 2, 10);
    }

    onMousePressed() {
        if (this.pos.dist(createVector(mouseX - 256, mouseY - 256)) < 5) {
            this.selected = !this.selected;
            console.log(this);
        }
    }
}