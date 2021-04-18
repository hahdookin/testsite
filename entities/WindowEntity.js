import Entity from './Entity.js';
import Button from './Button.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class WindowEntity extends Entity {
    static lastActiveIndex = 0;
    //isMostActive = false;
    title = "";
    id;
    grabOffset = {x: 0, y: 0};
    minimized = false;

    close_button;

    nameBarColor = colors.window_namebar_grey;

    constructor(x, y, w, h, title) {
        super(x, y, w, h);
        this.title = title;

        this.close_button = new Button(
            this.x + this.w - 22, 
            this.y + 8, 
            16, 
            14
        );
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
        ctx.fillStyle = this.nameBarColor;
        ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, 21);

        // Namebar title
        ctx.font = titleFontHeight + "px WindowsXP";
        ctx.fillStyle = colors.window_grey;
        ctx.fillText(this.title, this.x + 5, this.y + 20);

        // Draw close button
        //const close_button = new Button(this.x + this.w - 22, this.y + 8, 16, 14);
        this.close_button.draw(ctx);
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

        // Move buttons
        this.close_button.x = this.x + this.w - 22;
        this.close_button.y = this.y + 8;
    }

    // In namebar
    canMove(mouseX, mouseY) {
        // Make sure not clicking button
        let inButton = this.close_button.isHovered(mouseX, mouseY);

        let inX = mouseX <= this.x + this.w - 4 && mouseX >= this.x + 4;
        let inY = mouseY <= this.y + 4 + 21 && mouseY >= this.y + 4;
        return (inX && inY) && !inButton;
    }

    resize(mouseX, mouseY) {
        const defaultW = 128;
        const defaultH = 128;
        this.w = mouseX - this.x + this.grabOffset.x;
        this.h = mouseY - this.y + this.grabOffset.y;

        // Don't let window be smaller than defaults
        if (this.w < defaultW) {
            this.w = defaultW;
        }
        if (this.h < defaultH) {
            this.h = defaultH;
        }

        // Move buttons
        this.close_button.x = this.x + this.w - 22;
        this.close_button.y = this.y + 8;
    }

    // In bottom right corner square
    canResize(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w && mouseX >= this.x + this.w - 7;
        let inY = mouseY <= this.y + this.h && mouseY >= this.y + this.h - 7;
        return inX && inY;
    }

    setGrabOffset(x, y) {
        this.grabOffset.x = x;
        this.grabOffset.y = y;
    }

    /* buttonHovered(mouseX, mouseY) {
        // this.x + this.w - 22, this.y + 8, 16, 14
        let inX = mouseX <= this.x + this.w - 22 + 16 && mouseX >= this.x + this.w - 22;
        let inY = mouseY <= this.y + 8 + 14 && mouseY >= this.y + 8;
        return inX && inY;
    } */
}
