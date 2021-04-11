import WindowEntity from './WindowEntity.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';


export default class TextWindow extends WindowEntity {

    //command = "";
    content = "";
    contentArea = { x:0, y:0, w:0, h:0 };
    
    textColor = 'black';
    contentAreaColor = 'white';
    contentFontHeight = 14;
    cursorVisible = true;

    constructor(x, y, w, h, title) {
        super(x, y, w, h, title);

        this.contentArea.x = this.x + 7;
        this.contentArea.y = this.y + 27;
        this.contentArea.w = this.w - 14;
        this.contentArea.h = this.h - 34;
    }

    split(wordWrap = false) {
        if (!wordWrap) {
            return this.content.split('\n');
        } else {
            
        }
    }
    
    draw(ctx) {
        super.draw(ctx);

        ctx.fillStyle = this.contentAreaColor;
        ctx.fillRect(this.contentArea.x, this.contentArea.y, this.contentArea.w, this.contentArea.h);

        this.drawText(ctx);
        this.drawCursor(ctx);
        this.drawContentAreaOutline(ctx);
    }

    drawText(ctx) {
        ctx.font = '100 ' + this.contentFontHeight + "px WindowsXP";
        ctx.fillStyle = this.textColor;

        const textStartX = this.contentArea.x + 3; // Where texts starts from left side
        const textStartY = this.contentArea.y + 15; // Bottom of where text starts, top is this minus the font height
        const maxTextWidth = this.contentArea.w - 6;
        const maxTextHeight = this.contentArea.h - 2;

        //ctx.fillStyle = 'red';
        //ctx.fillRect(textStartX, textStartY - contentFontHeight, maxTextWidth, maxTextHeight)

        const splitByNewline = this.split();
        //splitByNewline[splitByNewline.length - 1] += this.command;

        for (let i = 0; i < splitByNewline.length; i++) {
            const curWidth = ctx.measureText(splitByNewline[i]).width;
            if (curWidth > maxTextWidth) {
                let cutOffIndex = splitByNewline[i].length - 1;
                let testStr = splitByNewline[i].substring(0, cutOffIndex);
                let testWidth = ctx.measureText(testStr).width;
                while (testWidth > maxTextWidth && cutOffIndex !== 0) {
                    cutOffIndex--;
                    testStr = splitByNewline[i].substring(0, cutOffIndex);
                    testWidth = ctx.measureText(testStr).width;
                }
                let first = splitByNewline[i].slice(0, cutOffIndex);
                let second = splitByNewline[i].slice(cutOffIndex);
                splitByNewline.splice(i, 0, first);
                splitByNewline[i + 1] = second;
            }
        }

        for (let i = 0; i < splitByNewline.length; i++) {
            // Wrap text thats too long
            const curWidth = ctx.measureText(splitByNewline[i]).width;
            if (curWidth > maxTextWidth) {
                // Handle text too long
            }
            
            // Don't draw lines that can't be seen
            const curHeight = this.contentFontHeight * (i + 1);
            if (curHeight > maxTextHeight) {
                this.drawExtensionMarker(ctx);
                break;
            }

            // Draw the text
            ctx.fillText(splitByNewline[i], textStartX, textStartY + this.contentFontHeight * i);
        } 
    }

    drawCursor(ctx) {
        // Draw cursor (needs rework)
        if (this.cursorVisible) {
            const splitByNewline = this.content.split('\n');
            const textStartX = this.contentArea.x + 3;
            const textStartY = this.contentArea.y + 15; 
            const maxTextHeight = this.contentArea.h - 2;
            const curHeight = this.contentFontHeight * splitByNewline.length;
            
            // Don't draw cursor that can't be seen
            if (curHeight > maxTextHeight) return;

            const width = ctx.measureText(splitByNewline[splitByNewline.length - 1]).width;

            // Vertical line cursor
            ctx.strokeStyle = this.textColor;
            ctx.beginPath();
            ctx.moveTo(textStartX + width, textStartY + this.contentFontHeight * (splitByNewline.length - 2) + 3);
            ctx.lineTo(textStartX + width, textStartY + this.contentFontHeight * (splitByNewline.length - 1) + 3);
            ctx.stroke();
        }
    }

    drawExtensionMarker(ctx) {
        ctx.fillStyle = this.textColor;
        const markerX = this.x + this.w - 25;
        const markerY = this.y + this.h - 25;
        const markerW = 10;
        const markerH = 10;

        ctx.beginPath();

        /* Down
        ctx.moveTo(markerX, markerY);
        ctx.lineTo(markerX + markerW, markerY)
        ctx.lineTo(markerX + markerW / 2, markerY + markerH);
        ctx.fill();
        */
        /* Right
        ctx.moveTo(markerX, markerY);
        ctx.lineTo(markerX + markerW, markerY + markerH / 2);
        ctx.lineTo(markerX, markerY + markerH);
        ctx.fill();
        */
        ctx.moveTo(markerX + markerW, markerY + markerH);
        ctx.lineTo(markerX, markerY + markerH);
        ctx.lineTo(markerX + markerW, markerY);
        ctx.fill();
    }

    drawContentAreaOutline(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = colors.taskbar_dark_grey;
        ctx.moveTo(this.contentArea.x, this.contentArea.y);
        ctx.lineTo(this.contentArea.x + this.contentArea.w, this.contentArea.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.contentArea.x, this.contentArea.y);
        ctx.lineTo(this.contentArea.x, this.contentArea.y + this.contentArea.h);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(this.contentArea.x + 1, this.contentArea.y + 1);
        ctx.lineTo(this.contentArea.x + this.contentArea.w - 1, this.contentArea.y + 1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.contentArea.x + 1, this.contentArea.y + 1);
        ctx.lineTo(this.contentArea.x + 1, this.contentArea.y + this.contentArea.h - 1);
        ctx.stroke();
    }

    move(mouseX, mouseY) {
        super.move(mouseX, mouseY);
        
        this.contentArea.x = this.x + 7;
        this.contentArea.y = this.y + 27;
        this.contentArea.w = this.w - 14;
        this.contentArea.h = this.h - 34;
    }

    resize(mouseX, mouseY) {
        super.resize(mouseX, mouseY);

        const defaultW = 128 - 14;
        const defaultH = 128 - 34;

        this.contentArea.w = mouseX - this.x + this.grabOffset.x - 14;
        this.contentArea.h = mouseY - this.y + this.grabOffset.y - 34;

        // Don't let window be smaller than defaults
        if (this.contentArea.w < defaultW) {
            this.contentArea.w = defaultW;
        }
        if (this.contentArea.h < defaultH) {
            this.contentArea.h = defaultH;
        }
    }

    handleKey(e) {
        const key = e.key;
        const ctrlKey = e.ctrlKey;

        if (key.length !== 1) {
            // Handle special keys
            switch (key) {

                case "Backspace":
                    if (ctrlKey) {
                        const trimmed = this.content.trimEnd();
                        const spaceIndex = trimmed.lastIndexOf(' ');
                        const newLineIndex = trimmed.lastIndexOf('\n');
                        const end = Math.max(spaceIndex, newLineIndex);
                        const adjusted = this.content.substring(0, end + 1);
                        this.content = adjusted;
                    } else {
                        const lineLength = this.content.length;
                        const adjusted = this.content.substring(0, lineLength - 1);
                        this.content = adjusted;
                    }
                    break;

                case "Enter":
                    this.content += '\n';
                    break;

                default:
                    // Default case
            }
        } else {
            // Normal keys
            this.content += key;
        }
    }
}