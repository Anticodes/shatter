class Cone {
    constructor(pos, colour) {
        this.pos = pos;
        this.colour = colour;
        this.colour.setRed(Math.floor(red(this.colour)));
        this.colour.setGreen(Math.floor(green(this.colour)));
        this.colour.setBlue(Math.floor(blue(this.colour)));
    }
}