
// elper functions
$ = ele => document.getElementById(ele);

function getRandomColor() {
    const chars = "0123456789ABCDEF";
    let res = "#";
    for (let i = 0; i < 6; ++i) {
        res += chars[Math.floor(Math.random() * 15)];
    }
    return res;
}
function ScreenWidth() {
    return window.innerWidth;
}
function ScreenHeight() {
    return window.innerHeight;
}

const colors = {
    taskbar_darker_grey: '#404040',
    taskbar_dark_grey: '#7f7f7f',
    taskbar_grey: '#c0c0c0',
    taskbar_white: '#e0e0e0',
    background_turquoise: '#008081',
    window_namebar_grey: '#808080',
    window_grey: '#C0C0C0'
}

class Entity {
    x;
    y;
    w;
    h;
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    isHovered(mouseX, mouseY) {
        let inX = mouseX <= this.x + this.w && mouseX >= this.x;
        let inY = mouseY <= this.y + this.h && mouseY >= this.y;
        return inX && inY;
    }
}

class Taskbar extends Entity {
    items = [];
    constructor() {
        super(
            0, 
            (872/900) * ScreenHeight(), 
            ScreenWidth(), 
            (28/900) * ScreenHeight()
        );
    }
    draw(ctx) {
        // Whole bar
        ctx.fillStyle = colors.taskbar_grey;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Light outline at top of bar
        ctx.fillStyle = colors.taskbar_white;
        ctx.fillRect(
            0, 
            (873/900) * ScreenHeight(),
            ScreenWidth(), 
            1
        );

        // Draw items
        for (let i = 0; i < this.items.length; i++) {
            items[i].draw(ctx);
        }
    }
}

class Background extends Entity {
    color = colors.background_turquoise;
    constructor() {
        super(
            0, 
            0, 
            ScreenWidth(), 
            (872/900) * ScreenHeight()
        );
    }
    setColor(color) {
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Button extends Entity {
    hovered = false;
    pressed = false;
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
    color() {
        if (this.hovered) return colors.taskbar_dark_grey;
        if (this.pressed) return colors.taskbar_white;
        return colors.taskbar_grey
    }
    drawButtonOutline(ctx) {
        const darker = 'black';//colors.taskbar_darker_grey;
        const dark = colors.taskbar_dark_grey
        const light = colors.taskbar_white;
        
        // left and top
        ctx.beginPath();
        ctx.strokeStyle = this.pressed ? darker : light;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.stroke();
    
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.w, this.y);
        ctx.stroke();
    
        // right and bottom
        ctx.beginPath();
        ctx.strokeStyle = this.pressed ? light : darker;
        ctx.moveTo(this.x, this.y + this.h);
        ctx.lineTo(this.x + this.w, this.y + this.h);
        ctx.stroke();
    
        ctx.moveTo(this.x + this.w, this.y);
        ctx.lineTo(this.x + this.w, this.y + this.h);
        ctx.stroke();
        
        // inner dark grey out line right and bottom or top and left
        if (this.pressed) {
            ctx.beginPath();
            ctx.strokeStyle = dark;
            ctx.moveTo(this.x + 1, this.y + 1);
            ctx.lineTo(this.x + 1, this.y + this.h - 1);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(this.x + 1, this.y + 1);
            ctx.lineTo(this.x + this.w - 1, this.y + 1);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.strokeStyle = dark;
            ctx.moveTo(this.x + 1, this.y + this.h - 1);
            ctx.lineTo(this.x + this.w - 1, this.y + this.h - 1);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(this.x + this.w - 1, this.y + 1);
            ctx.lineTo(this.x + this.w - 1, this.y + this.h - 1);
            ctx.stroke();
        }
    }
}

class StartButton extends Button {
    constructor() {
        super(
            (3/1600) * ScreenWidth(),
            ((872 + 4)/900) * ScreenHeight(),
            (51/1600) * ScreenWidth(),
            (22/900) * ScreenHeight()
        );
    }
    draw(ctx) {
        ctx.fillStyle = super.color();
        ctx.fillRect(this.x, this.y, this.w, this.h);
        super.drawButtonOutline(ctx);
    }
}

class ActiveWindowButton extends Button {
    text;
    constructor(x, y, w, h, text = 'null') {
        super(x, y, w, h);
        this.text = text;
    }
    draw(ctx, n = 0) {
        const offset = ((9/1600) + (160/1600)) * n;

        // padding from left of start + start button width + space between items
        let start = (3/1600) + (51/1600) + (9/1600) + offset;

        const x = (9/1600) + start * ScreenWidth();
        const y = ((872 + 4)/900) * ScreenHeight();
        const w = (160/1600) * ScreenWidth();
        const h = (22/900) * ScreenHeight();


        ctx.fillStyle = super.color();;
        ctx.fillRect(x, y, w, h);
        super.drawButtonOutline(ctx);
    }
}

class TimeDateBar extends Entity {

}

class WindowEntity extends Entity {
    static lastActiveIndex = 0;
    isMostActive = false;
    title = "";
    id;
    content = "";
    contentArr = [];
    grabOffset = {x: 0, y: 0};
    constructor(x, y, w, h, title) {
        super(x, y, w, h);
        this.title = title;
    }
    // TODO: fix this
    draw(ctx) {
        let titleFontHeight = "16";
        let contentFontHeight = "14";

        // Window
        ctx.fillStyle = colors.taskbar_grey;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Window hightlight outline
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
    
        // Namebar 
        ctx.fillStyle = colors.window_namebar_grey;
        ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, 21);

        // Namebar title
        ctx.font = titleFontHeight + "px WindowsXP";
        ctx.fillStyle = colors.window_grey;
        ctx.fillText(this.title, this.x + 5, this.y + 20);


        // content text
        ctx.font = contentFontHeight + "px WindowsXP";
        ctx.fillStyle = 'black';
        //let width = ctx.measureText(this.content).width;
        //console.log("Text width: " + width + ", Window width: " + this.w);
        ctx.fillText(this.content, this.x + 4, this.y + 36);
    }
    move(mouseX, mouseY) {
        let dx = mouseX - this.grabOffset.x;
        let dy = mouseY - this.grabOffset.y;
        this.x = dx;
        this.y = dy;
    }
    // TODO: fix this
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

class Icon extends Entity {
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

function drawActiveWindowButton(n=0) {
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
    drawButtonOutline(ctx, x, y, w, h);
}

class Session {
    UIElements;

    activeWindows;
    activeIcons;
    activeButtons;

    movingWindow = false;
    clickingIcon = false;
    iconClickedIndex = 0;

    taskbarElements;
    constructor() {

    }
    update(canvas) {

    }
}

let activeWindows = [];
let activeIcons = [];
let activeButtons = [];

let img = new Image();
img.src = 'icons/exefile.png';


function loadUIElements() {
    let items = [];
    items.push(new Background());
    items.push(new Taskbar());
    //items.push(new StartButton());
    //items.push(new DateTimeBar());
    return items;
}
function main(canvas) {
    canvas.width = ScreenWidth();
    canvas.height = ScreenHeight();
    let ctx = canvas.getContext('2d');

    let UIElements = loadUIElements();

    // Draw regular stuff: bg, taskbar, start button
    for (let i = 0; i < UIElements.length; i++) {
        UIElements[i].draw(ctx);
    }

    // Draw icons
    for (let i = 0; i < activeIcons.length; i++) {
        activeIcons[i].draw(ctx);
    }

    // Draw buttons
    for (let i = 0; i < activeButtons.length; i++) {
        activeButtons[i].draw(ctx);
    }

    // Draw open and active windows
    if (activeWindows.length !== 0) {
        for (let i = 0; i < activeWindows.length; i++) {
            if (WindowEntity.lastActiveIndex === i) {
                continue;
            } 
            activeWindows[i].draw(ctx);
        }
        // Draw last active window
        activeWindows[WindowEntity.lastActiveIndex].draw(ctx);
    }
}

let movingWindow = false;
let clickingIcon = false;
let iconClickedIndex = 0;

window.addEventListener('load', e => {
    const canvas = $('canvas');

    activeButtons.push(new StartButton());

    let i = new Icon(20, 20, 100, 100, "Icon", null);
    activeIcons.push(i);
    
    // Re-render on resize
    window.addEventListener('resize', e => {
        main(canvas);
    });

    canvas.addEventListener('mousedown', e => {
        // Handle windows
        if (activeWindows.length !== 0) {
            const lastActiveIndex = WindowEntity.lastActiveIndex;

            // moving active -> in active -> moving other -> in other
            if (activeWindows[lastActiveIndex].canMove(e.clientX, e.clientY)) {
                // Active window move
                movingWindow = true;
                const offx = e.clientX - activeWindows[lastActiveIndex].x;
                const offy = e.clientY - activeWindows[lastActiveIndex].y;
                activeWindows[lastActiveIndex].setGrabOffset(offx, offy);
            } else if (activeWindows[lastActiveIndex].isHovered(e.clientX, e.clientY)) {
                // Active window click
                console.log("In active window: " + lastActiveIndex);
            } else {
                // other window move
                let noWindowFound = true;
                for (let i = 0; i < activeWindows.length; i++) {
                    if (i === lastActiveIndex) continue;
                    if (activeWindows[i].canMove(e.clientX, e.clientY)) {
                        WindowEntity.lastActiveIndex = i;
                        movingWindow = true;
                        let offx = e.clientX - activeWindows[i].x;
                        let offy = e.clientY - activeWindows[i].y;
                        activeWindows[i].setGrabOffset(offx, offy);
                        noWindowFound = false;
                        break;
                    }
                }
                // other window click
                if (noWindowFound) {
                    for (let i = 0; i < activeWindows.length; i++) {
                        if (i === lastActiveIndex) continue;
                        if (activeWindows[i].isHovered(e.clientX, e.clientY)) {
                            WindowEntity.lastActiveIndex = i;
                            console.log("In window: " + i);
                            break;
                        }
                    }
                }
            }
        }
        

        // Check if trying to click icon
        for (let i = 0; i < activeIcons.length; i++) {
            if (activeIcons[i].canClick(e.clientX, e.clientY)) {
                clickingIcon = true;
                iconClickedIndex = i;
                break;
            }
        }

        // Check if trying to click button
        for (let i = 0; i < activeButtons.length; i++) {
            if (activeButtons[i].isHovered(e.clientX, e.clientY)) {
                activeButtons[i].pressed = true;
            }
        }

        main(canvas);
    });

    canvas.addEventListener('mousemove', e => {
        
        if (movingWindow) {
            activeWindows[WindowEntity.lastActiveIndex].move(e.clientX, e.clientY);
        }

        for (let i = 0; i < activeButtons.length; i++) {
            activeButtons[i].hovered = activeButtons[i].isHovered(e.clientX, e.clientY);
        }

        main(canvas);
    });

    canvas.addEventListener('mouseup', e => {
        // Finished moving a window
        movingWindow = false;

        // Finished clicking an icon
        if (clickingIcon && activeIcons[iconClickedIndex].canClick(e.clientX, e.clientY)) {
            activeWindows.push(new WindowEntity(.5 * ScreenWidth(), .5 * ScreenHeight(), .3 * ScreenWidth(), .4 * ScreenHeight(), 'My Application' + activeWindows.length))
            clickingIcon = false;
            WindowEntity.lastActiveIndex = activeWindows.length - 1;
        } else {
            clickingIcon = false;
        }

        // Finished clicking a button
        for (let i = 0; i < activeButtons.length; i++) {
            if (activeButtons[i].pressed) {
                activeButtons[i].pressed = false;
            }
        }

        main(canvas);
    });

    // Remove context menu
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    // Handle key presses
    document.addEventListener('keydown', e => {
        if (activeWindows.length !== 0) {
            let lastActiveIndex = WindowEntity.lastActiveIndex;
            let key = e.key;
            let content = activeWindows[lastActiveIndex].content;

            if (key === "Backspace") {
                if (activeWindows[lastActiveIndex].content.length !== 0) {
                    activeWindows[lastActiveIndex].content = content.substring(0, content.length - 1);
                }
            } else if (key === "Enter") {
                console.log(eval(content));
            } else if (key.length === 1) {
                activeWindows[lastActiveIndex].content += e.key;
            }
        }

        main(canvas);
    })

    main(canvas);
});