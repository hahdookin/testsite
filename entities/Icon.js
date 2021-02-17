import Entity from './Entity.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Icon extends Entity {
    name;
    img;
    constructor(x, y, w, h, name, img) {
        super(x,y,w,h);
        this.name = name;
        this.img = img;
    }
    draw(ctx) {
        ctx.fillStyle = colors.taskbar_dark_grey
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    canClick(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w && mouseX >= this.x;
        let inY = mouseY <= this.y + this.h && mouseY >= this.y;
        return inX && inY;
    }
}