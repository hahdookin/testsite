import FileSystem from './FileSystem.js';
import TextWindow from './TextWindow.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Terminal extends TextWindow {

    static fs = null;
    output = "";
    session = {};
    command = "";
    symbols = {};

    constructor(x, y, w, h, title, fs) {
        super(x, y, w, h, title);
        
        this.contentAreaColor = 'black';
        this.textColor = 'white';
        this.nameBarColor = colors.window_namebar_blue;

        if (!Terminal.fs) {
            Terminal.fs = fs;
        }

        this.content = "\nMicrosoft(R) Windows 95\n    (C)Copyright Microsoft 1981-1996.\n\n";
        this.content += Terminal.fs.cur.absolutePath() + "> ";
    }

    handleKey(e) {
        const key = e.key;
        const ctrlKey = e.ctrlKey;
        const splitByNewline = this.content.split('\n');

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
                        // Adjust visible content
                        const lineLength = this.content.length;
                        const adjusted = this.content.substring(0, lineLength - 1);
                        this.content = adjusted;
                        
                        // Adjust the current cmd
                        const lineLengthC = this.command.length;
                        const adjustedC = this.command.substring(0, lineLengthC - 1);
                        this.command = adjustedC;
                    }
                    break;

                case "Enter":
                    // Don't print return val if cmd returns undefined
                    this.content += '\n';
                    const returnVal = this.handleCmd(this.command);
                    if (returnVal !== undefined) {
                        this.content += returnVal + '\n';
                    }
                    this.content += Terminal.fs.cur.absolutePath() + '> ';
                    break;

                default:
                    // Default case
            }
        } else {
            // Normal keys
            this.content += key;
            this.command += key;
        }
    }

    handleCmd(cmd) {
        let returnVal = undefined;
        cmd = cmd.trim();
        const tokens = cmd.split(" ");
        const program = tokens[0];
        console.log(tokens);
        switch (program) {

            case 'cd':
                returnVal = this.#cd(tokens);
                break;

            case 'clear':
                returnVal = this.#clear(cmd);
                break;

            case 'dir':
                returnVal = this.#dir(tokens);
                break;

            case 'def':
                returnVal = this.#def(cmd);
                break;

            case 'help':
                break;
                
            default:
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i] in this.symbols) {
                        tokens[i] = this.symbols[tokens[i]];
                    }
                }
                returnVal = tokens.join(' ');
                /* try {
                    returnVal = window.eval(cmd);
                } catch (error) {
                    returnVal = error;
                } */
                break;
        }

        this.command = "";
        return returnVal;
    }

    // changes current working directory
    // returns: undefined if successful, error if issue
    #cd(args) {
        let returnVal = undefined;
        let destination = null;
        const cur = Terminal.fs.cur;

        if (args.length === 2) {
            destination = args[1];
        } else if (args.length === 1) {
            return cur.absolutePath();
        } else {
            return 'Incorrect number of args';
        }

        // Try local directory
        const local = Terminal.fs.goto(cur.absolutePath() + '/' + destination)
        // Try absolute path
        if (!local) {
            const abs = Terminal.fs.goto(destination);
            if (!abs) {
                returnVal = 'Cannot find path: ' + destination;
            }
        }
        
        return returnVal; 
    }

    #clear(args) {
        this.content = "";
    }

    // def symbol = 
    #def(cmd) {
        console.log(cmd);
        const space = cmd.indexOf(' ');
        const input = cmd.substring(space + 1);
        
    }

    // prints to terminal items in current directory
    // returns: undefined if directory is empty, list of items if successful
    #dir(args) {
        const cur = Terminal.fs.cur;
        let res = "";
        if (cur.items.length === 0) {
            res = undefined;
        } else {
            for (let i = 0; i < cur.items.length; i++) {
                // Name of item
                res += cur.items[i].key;
                // Folder or file
                res += (cur.items[i].content === undefined ? '...' : '');
                // No newline at last entry
                res += (i === cur.items.length - 1 ? '' : '\n');
            }
        }
        return res;
    }

    #symbolLookUp(symbol) {
        let val = undefined;
        if (symbol in this.symbols) {
            val = this.symbols[symbol];
        }
        return val;
    }
}