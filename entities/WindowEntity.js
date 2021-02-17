import Entity from './Entity.js';
import Button from './Button.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class WindowEntity extends Entity {
    static lastActiveIndex = 0;
    isMostActive = false;
    title = "";
    id;
    //content = "";
    //contentArr = [];
    grabOffset = {x: 0, y: 0};
    constructor(x, y, w, h, title) {
        super(x, y, w, h);
        this.title = title;
    }
    // TODO: fix this
    draw(ctx) {
        let titleFontHeight = "16";
        //let contentFontHeight = "14";

        // Window
        ctx.fillStyle = colors.taskbar_grey;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Window hightlight outline
        this.drawWindowOutline(ctx);
    
        // Namebar 
        ctx.fillStyle = colors.window_namebar_grey;
        ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, 21);

        // Namebar title
        ctx.font = titleFontHeight + "px WindowsXP";
        ctx.fillStyle = colors.window_grey;
        ctx.fillText(this.title, this.x + 5, this.y + 20);


        // content text
        /*ctx.font = contentFontHeight + "px WindowsXP";
        ctx.fillStyle = 'black';
        //let width = ctx.measureText(this.content).width;
        //console.log("Text width: " + width + ", Window width: " + this.w);
        ctx.fillText(this.content, this.x + 4, this.y + 36);*/

        // Draw close button
        const close_button = new Button(this.x + this.w - 22, this.y + 8, 16, 14);
        close_button.draw(ctx);
    }
    drawWindowOutline(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = colors.taskbar_white;
        ctx.moveTo(this.x + 1, this.y + 1)
        ctx.lineTo(this.x + 1, this.y + this.h - 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + 1, this.y + 1);
        ctx.lineTo(this.x + this.w - 1, this.y + 1);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = colors.window_namebar_grey;
        ctx.moveTo(this.x + this.w - 1, this.y + this.h - 1);
        ctx.lineTo(this.x + this.w - 1, this.y + 1);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.w - 1, this.y + this.h - 1);
        ctx.lineTo(this.x + 1, this.y + this.h - 1);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(this.x + this.w, this.y + this.h);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + this.w, this.y + this.h);
        ctx.lineTo(this.x + this.w, this.y);
        ctx.stroke();
    }
    move(mouseX, mouseY) {
        let dx = mouseX - this.grabOffset.x;
        let dy = mouseY - this.grabOffset.y;
        this.x = dx;
        this.y = dy;
    }
    canMove(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w - 4 && mouseX >= this.x + 4;
        let inY = mouseY <= this.y + 4 + 21 && mouseY >= this.y + 4;
        return inX && inY;
    }
    setGrabOffset(x, y) {
        this.grabOffset.x = x;
        this.grabOffset.y = y;
    }
}
