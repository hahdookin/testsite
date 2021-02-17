import WindowEntity from './WindowEntity.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';


export default class TextWindow extends WindowEntity {

    contentArr = [""];
    constructor(x, y, w, h, title) {
        super(x, y, w, h, title);
    }
    draw(ctx) {
        super.draw(ctx);

        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 7, this.y + 27, this.w - 14, this.h - 34);
        this.drawText(ctx);
    }
    drawText(ctx) {
        // content text
        let contentFontHeight = "14";
        ctx.font = contentFontHeight + "px WindowsXP";
        ctx.fillStyle = 'black';
        //let width = ctx.measureText(this.content).width;
        //console.log("Text width: " + width + ", Window width: " + this.w);
        //ctx.fillText(this.content[0], this.x + 9, this.y + 36);
        for (let i = 0; i < this.contentArr.length; i++) {
            ctx.fillText(this.contentArr[i], this.x + 9, this.y + 36 + 14 * i);
        }
    }
}