import Background from './entities/Background.js';
import FileSystem from './entities/FileSystem.js';
import Icon from './entities/Icon.js';
import Session from './entities/Session.js';
import StartButton from './entities/StartButton.js';
import Taskbar from './entities/Taskbar.js';
import Terminal from './entities/Terminal.js';
import TextWindow from './entities/TextWindow.js';
import WindowEntity from './entities/WindowEntity.js';
import { Folder, File } from './entities/FileSystem.js';

import { ScreenWidth, ScreenHeight, colors, $, getRandomColor } from './Utils.js';
import ActiveWindowButton from './entities/ActiveWindowButton.js';

let activeWindows = [];
let activeIcons = [];
let activeButtons = [];

function loadUIElements() {
    let items = [];
    items.push(new Background());
    items.push(new Taskbar());
    //items.push(new StartButton());
    //items.push(new DateTimeBar());
    return items;
}

let showFPS = true;
let frames = 0;
let ms = 0;
let last;
let fps = 0;

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
            if (i === WindowEntity.lastActiveIndex) {
                continue;
            } 
            activeWindows[i].draw(ctx);
        }
        // Draw last active window
        activeWindows[WindowEntity.lastActiveIndex].draw(ctx);
    }
    
    // Handle framerate
    if (showFPS) {
        if (last === undefined) {
            last = new Date();
        }
        if (ms >= 1000) {
            fps = (frames / ms) * 1000;
            ms = 0;
            frames = 0;
        }
        let now = new Date();
        ms += now.getTime() - last.getTime();
        frames++;
        ctx.font = '48px arial';
        ctx.fillText(fps.toFixed(2), .3 * ScreenWidth(), 60);
        last = now;
    }
}

function createFileSystem() {
    const fs = new FileSystem('root');
    fs.root.add(new Folder('user'));
    fs.root.get('user').add(new Folder('documents'));
    fs.root.add(new Folder('bin'));
    fs.root.add(new Folder('cache'));
    return fs;
}

let movingWindow = false;
let resizingWindow = false;

let clickingIcon = false;
let iconClickedIndex = 0;

let clickingButton = false;

let batchfileImg = new Image();
batchfileImg.src = 'icons/batchfile.png';
let notepadfileImg = new Image();
notepadfileImg.src = 'icons/notepadfile.png';
let exefileImg = new Image();
exefileImg.src = 'icons/exefile.png';
let folderImg = new Image();
folderImg.src = 'icons/closedfolder.png';

window.addEventListener('load', e => {
    const canvas = $('canvas');

    activeButtons.push(new StartButton());

    const fileSystem = createFileSystem();

    // Distance between icons is: 120 * (height / 100)
    let batchfileIcon = new Icon(/*20, 20, 100, 100,*/ "Batch", batchfileImg);
    let notepadfileIcon = new Icon(/* 20, 140, 100, 100, */ "Notepad", notepadfileImg);
    let exefileIcon = new Icon(/* 20, 260, 100, 100, */ "Exe", exefileImg);
    let folderIcon = new Icon("Folder", folderImg);
    activeIcons.push(batchfileIcon);
    activeIcons.push(notepadfileIcon);
    activeIcons.push(exefileIcon);
    activeIcons.push(folderIcon);

    
    // Re-render on resize
    window.addEventListener('resize', e => {
        main(canvas);
    });

    canvas.addEventListener('mousedown', e => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Handle windows (real messy)
        const lastActiveIndex = WindowEntity.lastActiveIndex;
        if (activeWindows.length !== 0) {
            // moving active -> in active -> moving other -> in other
            if (activeWindows[lastActiveIndex].canMove(mouseX, mouseY)) {
                // Active window move
                movingWindow = true;
                const offx = mouseX - activeWindows[lastActiveIndex].x;
                const offy = mouseY - activeWindows[lastActiveIndex].y;
                activeWindows[lastActiveIndex].setGrabOffset(offx, offy);
            } else if (activeWindows[lastActiveIndex].isHovered(mouseX, mouseY)) {
                // Active window click
                //console.log("In active window: " + lastActiveIndex);
            } else {
                // other window move
                let noWindowFound = true;
                for (let i = 0; i < activeWindows.length; i++) {
                    if (i === lastActiveIndex) continue;
                    if (activeWindows[i].canMove(mouseX, mouseY)) {
                        WindowEntity.lastActiveIndex = i;
                        movingWindow = true;
                        let offx = mouseX - activeWindows[i].x;
                        let offy = mouseY - activeWindows[i].y;
                        activeWindows[i].setGrabOffset(offx, offy);
                        noWindowFound = false;
                        break;
                    }
                }
                // other window click
                if (noWindowFound) {
                    for (let i = 0; i < activeWindows.length; i++) {
                        if (i === lastActiveIndex) continue;
                        if (activeWindows[i].isHovered(mouseX, mouseY)) {
                            WindowEntity.lastActiveIndex = i;
                            console.log("In window: " + i);
                            break;
                        }
                    }
                }
            }
            // Handle active window resize
            if (activeWindows[lastActiveIndex].canResize(mouseX, mouseY)) {
                let offx = activeWindows[lastActiveIndex].x + activeWindows[lastActiveIndex].w - mouseX;
                let offy = activeWindows[lastActiveIndex].y + activeWindows[lastActiveIndex].h - mouseY;
                activeWindows[lastActiveIndex].setGrabOffset(offx, offy);
                resizingWindow = true;
            }
        }
        
        // Check if trying to click icon
        for (let i = 0; i < activeIcons.length; i++) {
            if (activeIcons[i].canClick(mouseX, mouseY)) {
                clickingIcon = true;
                iconClickedIndex = i;
                break;
            }
        }

        // Check if trying to click button
        for (let i = 0; i < activeButtons.length; i++) {
            if (activeButtons[i].isHovered(mouseX, mouseY)) {
                activeButtons[i].pressed = true;
                break;
            }
        }

        // Check if trying to click window button
        // Check active first
        let activeButtonHovered = false;
        if (activeWindows.length !== 0) {
            activeButtonHovered = activeWindows[lastActiveIndex].close_button.isHovered(mouseX, mouseY);
        }
        if (activeButtonHovered) {
            activeWindows[lastActiveIndex].close_button.pressed = true;
        } else {
            for (let i = 0; i < activeWindows.length; i++) {
                if (i === lastActiveIndex) continue;
                if (activeWindows[i].close_button.isHovered(mouseX, mouseY)) {
                    activeWindows[i].close_button.pressed = true;
                }
            }
        }

        main(canvas);
    });

    canvas.addEventListener('mousemove', e => {
        
        const lastActiveIndex = WindowEntity.lastActiveIndex;

        if (movingWindow) {
            activeWindows[lastActiveIndex].move(e.clientX, e.clientY);
        }

        if (resizingWindow) {
            activeWindows[lastActiveIndex].resize(e.clientX, e.clientY);
        }

        // Check if window button hovered
        /* for (let i = 0; i < activeWindows.length; i++) {
            let close_hovered = activeWindows[i].close_button.isHovered(e.clientX, e.clientY);
            activeWindows[i].hovered = close_hovered;
            if (close_hovered) break;
        } */

        /* for (let i = 0; i < activeButtons.length; i++) {
            activeButtons[i].hovered = activeButtons[i].isHovered(e.clientX, e.clientY);
        } */

        main(canvas);
    });

    canvas.addEventListener('mouseup', e => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Finished moving or resizing a window
        movingWindow = false;
        resizingWindow = false;

        // Finished clicking an icon
        if (clickingIcon && activeIcons[iconClickedIndex].canClick(mouseX, mouseY)) {
            let win;
            activeIcons[iconClickedIndex].onClick();
            if (e.ctrlKey) 
                win = new TextWindow(
                    .5 * ScreenWidth(), 
                    .5 * ScreenHeight(), 
                    .3 * ScreenWidth(), 
                    .4 * ScreenHeight(), 
                    'TextWindow' + activeWindows.length
                );
            else if (e.altKey) // Open textwindow of aboutme text
                win = new TextWindow(
                    .5 * ScreenWidth(), 
                    .5 * ScreenHeight(), 
                    .3 * ScreenWidth(), 
                    .4 * ScreenHeight(), 
                    'TextWindow' + activeWindows.length,
                    './text/aboutme.txt'
                ); 
            else 
                win = new Terminal(
                    .5 * ScreenWidth(), 
                    .5 * ScreenHeight(), 
                    .3 * ScreenWidth(), 
                    .4 * ScreenHeight(), 
                    'Terminal' + activeWindows.length,
                    fileSystem
                );         
            activeButtons.push(new ActiveWindowButton(win));
            activeWindows.push(win);

            // Set newly opened window to be the last active window
            WindowEntity.lastActiveIndex = activeWindows.length - 1;
        }
        clickingIcon = false;

        // Finished clicking a button
        for (let i = 0; i < activeButtons.length; i++) {
            if (activeButtons[i].pressed) {
                activeButtons[i].pressed = false;
            }
        }

        // Need to rework this later
        let removePos = -1;
        for (let i = 0; i < activeWindows.length; i++) {
            // if not hovered anymore, don't close window
            let hovered = activeWindows[i].close_button.isHovered(mouseX, mouseY);
            if (activeWindows[i].close_button.pressed && hovered) {
                activeWindows[i].close_button.pressed = false;
                activeWindows[i].close_button.onClick();
                removePos = i;
                break;
            } else if (activeWindows[i].close_button.pressed) {
                activeWindows[i].close_button.pressed = false;
            }
        }
        // Remove the window at index
        if (removePos !== -1) {
            console.log("Going to remove " + activeWindows[removePos].title)
            WindowEntity.lastActiveIndex = 0; // HACK
            activeWindows.splice(removePos, 1);
        }

        main(canvas);
    });

    // Remove context menu and maybe add own context menu
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        /* const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        if (mouseY + 100 > ScreenHeight()) {
            ctx.fillRect(mouseX, mouseY - 100, 100, 100)
        } else
        ctx.fillRect(mouseX, mouseY, 100, 100); */
    });

    // Handle key presses
    document.addEventListener('keydown', e => {
        if (activeWindows.length !== 0) {
            activeWindows[WindowEntity.lastActiveIndex].handleKey(e);
        }

        main(canvas);
    });

    
    window.setInterval(() => {
        if (activeWindows.length !== 0) {
            const lastActiveIndex = WindowEntity.lastActiveIndex;
            const cursorVisible = activeWindows[lastActiveIndex].cursorVisible;
            activeWindows[lastActiveIndex].cursorVisible = !cursorVisible;
        }
        main(canvas);
    }, 500);

    main(canvas);
});