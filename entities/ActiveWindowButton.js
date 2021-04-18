import Button from './Button.js';
import { ScreenWidth, ScreenHeight } from '../Utils.js';

export default class ActiveWindowButton extends Button {
    static count = -1;
    parent;
    text;
    constructor(parent) {
        ActiveWindowButton.count++;
        const x = (3/1600) * ScreenWidth() + ((151/1600) * ScreenWidth()) * (ActiveWindowButton.count + 1);
        const y = ((872 + 4)/900) * ScreenHeight();
        const w = ((151/1600) * ScreenWidth());
        const h = (22/900) * ScreenHeight();
        super(x, y, w, h);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.parent = parent;
        this.text = parent.title;
    }
    draw(ctx, n = 0) {
        
        super.draw(ctx);

        //ctx.fillStyle = super.color();
        //ctx.fillRect(x, y, w, h);

        //ctx.font = "14px WindowsXP";
        //ctx.fillStyle = 'black';

        super.drawButtonOutline(ctx);
    }
}

/* export default class ActiveWindowButton extends Button {
    parent;
    text;
    constructor(x, y, w, h, parent) {
        super(x, y, w, h);
        this.parent = parent;
        this.text = parent.title;
    }
    draw(ctx, n = 0) {
        const offset = ((9/1600) + (160/1600)) * n;

        // padding from left of start + start button width + space between items
        let start = (3/1600) + (51/1600) + (9/1600) + offset;

        const x = (9/1600) + start * ScreenWidth();
        const y = ((872 + 4)/900) * ScreenHeight();
        const w = (160/1600) * ScreenWidth();
        const h = (22/900) * ScreenHeight();


        ctx.fillStyle = super.color();
        ctx.fillRect(x, y, w, h);

        ctx.font = "14px WindowsXP";
        ctx.fillStyle = 'black';

        super.drawButtonOutline(ctx);
    }
} */

/* function drawActiveWindowButton(n=0) {
    const canvas = $('canvas');
    const ctx = canvas.getContext('2d');

    const taskbar = colors.taskbar_grey;

    const offset = ((9/1600) + (160/1600)) * n;
    // padding from left of start + start button width + space between items
    let start = (3/1600) + (51/1600) + (9/1600) + offset;

    const x = (9/1600) + start * ScreenWidth();
    const y = ((872 + 4)/900) * ScreenHeight();
    const w = (160/1600) * ScreenWidth();
    const h = (22/900) * ScreenHeight();


    ctx.fillStyle = taskbar;
    ctx.fillRect(x, y, w, h);
} */