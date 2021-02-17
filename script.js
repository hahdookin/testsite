import Background from './entities/Background.js';
import Taskbar from './entities/Taskbar.js';
import StartButton from './entities/StartButton.js';
import Icon from './entities/Icon.js';
import WindowEntity from './entities/WindowEntity.js';
import TextWindow from './entities/TextWindow.js';
import Session from './entities/Session.js';

import { ScreenWidth, ScreenHeight, colors, $, getRandomColor } from './Utils.js';


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
let cursorVisible = false;

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
            const win = new TextWindow(.5 * ScreenWidth(), .5 * ScreenHeight(), .3 * ScreenWidth(), .4 * ScreenHeight(), 'My Application' + activeWindows.length);
            activeWindows.push(win);
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
            const lastActiveIndex = WindowEntity.lastActiveIndex;
            const key = e.key;
            const contentArr = activeWindows[lastActiveIndex].contentArr;
            const endIndex = contentArr.length - 1;

            if (key.length !== 1) {
                switch (e.key) {
                    case "Backspace":
                        const adjusted = contentArr[endIndex].substring(0, contentArr[endIndex].length - 1);
                        activeWindows[lastActiveIndex].contentArr[endIndex] = adjusted;
                        break;
                    case "Enter":
                        activeWindows[lastActiveIndex].contentArr.push("");
                        break;
                    default:
                }
            } else {
                activeWindows[lastActiveIndex].contentArr[endIndex] += e.key;
            }

        }

        main(canvas);
    })

    
    window.setInterval(() => {
        if (activeWindows.length !== 0) {
            cursorVisible = !cursorVisible;
            main(canvas);
        }
    }, 500)

    main(canvas);
});