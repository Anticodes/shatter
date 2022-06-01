class Cone {
    constructor(pos, colour) {
        this.pos = pos;
        this.colour = colour;
        this.colour.setRed(red(this.colour));
        this.colour.setGreen(green(this.colour));
        this.colour.setBlue(blue(this.colour));
    }
}