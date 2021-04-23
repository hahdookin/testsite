import FileSystem, { Folder, File } from './FileSystem.js';
import TextWindow from './TextWindow.js';
import { ScreenWidth, ScreenHeight, colors } from '../Utils.js';

export default class Terminal extends TextWindow {

    static fs = null;
    output = ""; // unused
    session = {}; // unused
    command = "";
    last_command = "";
    symbols = {};

    cwd; // current working directory

    constructor(x, y, w, h, title, fs) {
        super(x, y, w, h, title);
        
        this.contentAreaColor = 'black';
        this.textColor = 'white';
        this.nameBarColor = colors.window_namebar_blue;

        if (!Terminal.fs) {
            Terminal.fs = fs;
        }
        this.cwd = Terminal.fs.root;

        this.content = "\nMicrosoft(R) Windows 95\n    (C)Copyright Microsoft 1981-1996.\n\n";
        this.content += this.cwd.absolutePath() + "> ";
    }

    handleKey(e) {
        const key = e.key;
        const ctrlKey = e.ctrlKey;
        //const splitByNewline = this.split(true);

        if (key.length !== 1) {
            // Handle special keys
            switch (key) {

                case "ArrowUp": // needs clean up
                    let lci = this.content.lastIndexOf(this.command);
                    this.content = this.content.substring(0,lci);
                    this.content += this.last_command;
                    this.command = this.last_command;
                    break;

                case "ArrowDown": // needs clean up
                    if (this.command !== "") {
                        let lci = this.content.lastIndexOf(this.command);
                        this.content = this.content.substring(0, lci);
                        this.last_command = this.command;
                        this.command = "";
                    }
                    break;

                case "Backspace":
                    if (this.command === "") break;
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
                    this.content += this.cwd.absolutePath() + '> ';

                    if (this.command) this.last_command = this.command;

                    this.command = "";
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

    // Expand $<token> or ${<token>} to their value
    #expandTokens(cmd) {
        let res = "";
        let token = "";
        for (let i = 0; i < cmd.length; i++) {
            if (cmd[i] === '$') {
                i++;
                if (cmd[i] === '{') {
                    i++;
                    let closeBracketFound = false;
                    while (!closeBracketFound && i < cmd.length) {
                        if (cmd[i] === '}') {
                            closeBracketFound = true;
                            break;
                        }
                        token += cmd[i];
                        i++
                    }
                    res += closeBracketFound ? this.symbols[token] : "";
                    token = "";
                } else {
                    while (cmd[i] !== ' ' && cmd[i] !== '$' && i < cmd.length) {
                        token += cmd[i];
                        i++;
                    }
                    res += this.symbols[token] ?? "";
                    token = "";
                    i--;
                }
            } else {
                res += cmd[i];
            }
        }
        return res;
    }

    handleCmd(cmd) {
        let returnVal = undefined;
        cmd = cmd.trim();
        cmd = this.#expandTokens(cmd);
        const tokens = cmd.split(" ");
        const program = tokens[0].toLowerCase();
        
        switch (program) {
            // The empty command, after being trimmed
            case "":
                break;

            case "chdir":
            case "cd":
                returnVal = this.#cd(cmd);
                break;

            case "clear":
                returnVal = this.#clear(cmd);
                break;

            case "def":
                returnVal = this.#def(cmd);
                break;
                
            case "dir":
                returnVal = this.#dir(cmd);
                break;

            case "help":
                returnVal = this.#help(cmd);
                break;
                
            case "js":
                returnVal = this.#js(cmd);
                break; 

            case "touch":
                returnVal = this.#touch(cmd);
                break;

            case "type":
                returnVal = this.#type(cmd);
                break;

            default:
                returnVal = "Unknown command: " + program;
                break;
        }

        return returnVal;
    }

    // changes current working directory
    // returns: undefined if successful, error if issue
    #cd(cmd) {
        let args = cmd.split(' ');
        let returnVal = undefined;
        let destination = null;

        if (args.length === 2) {
            destination = args[1];
        } else if (args.length === 1) {
            return this.cwd.absolutePath();
        } else {
            return 'Incorrect number of args';
        }

        const expandedPath = Terminal.fs.fixpath(destination);

        let item = this.#grabItem(destination);
        if (item && item.isFolder()) {
            this.cwd = item;
        } else {
            returnVal = "Cannot find path: " + expandedPath;
        }
        
        return returnVal; 
    }

    // Trys to grab folder/file denoted by path, relative or absolute
    // Returns folder or file if exists, null otherwise
    #grabItem(path) {
        // Try relative path
        let item = Terminal.fs.get(this.cwd.absolutePath() + '/' + path);
        if (!item) {
            // Try absolute path
            item = Terminal.fs.get(path);
        }
        return item;
    }

    // Returns array of opts in cmd
    #getOpts(cmd) {
        let tokens = cmd.split(' ');
        let res = [];
        for (let token of tokens) {
            if (token[0] === '-') {
                res.push(token);
            }
        }
        return res;
    }

    #clear(cmd) {
        this.content = "";
    }

    // def <symbol> = 
    #def(cmd) {
        console.log(cmd);
        const space = cmd.indexOf(' ');
        const input = cmd.substring(space + 1);
        
    }

    // prints to terminal items in current directory
    // returns: undefined if directory is empty, list of items if successful
    #dir(cmd) {
        const cur = this.cwd;
        let res = undefined;
        if (cur.items.length !== 0) {
            res = "";
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

    // Help message
    #help(cmd) {
        let res = "";
        res += "cd [<path>]" + "\n";
        res += "chdir [<path>]" + "\n";
        res += "clear" + "\n";
        res += "dir" + "\n";
        res += "js [<js code>]" + "\n";
        res += "touch [<file>]" + "\n";
        res += "type [<item>]";
        return res;
    }

    #js(cmd) {
        let res = "";
        let spaceIndex = cmd.indexOf(' ');
        if (spaceIndex === -1) {
            return "Usage: js [<js code>]";
        }
        let code = cmd.substring(spaceIndex + 1);

        let logTemp = console.log;
        let clearTemp = console.clear;
        
        // Overwrite console fn's to modify terminal
        console.log = function(...items) {
            res += items.join(' ') + "\n";
        };
        console.clear = function() {
            res = "";
        }
        //console.clear = console.clear.bind(this);

        try {
            eval(code);
        } catch (err) {
            res += err;
        }

        console.log = logTemp;
        console.clear = clearTemp;

        return res;
    }

    #touch(cmd) {
        let args = cmd.split(' ');
        let returnVal = undefined;
        let fullPath = null;
        let path = "";
        let fileName = "";

        if (args.length === 2) {
            fullPath = args[1];
            let lastSlash = fullPath.lastIndexOf('/');
            fileName = fullPath.substring(lastSlash + 1);
            path = fullPath.substring(0, lastSlash);
        } else {
            return 'Usage: touch [<file>]';
        }

        const expandedPath = Terminal.fs.fixpath(path);

        let item = this.#grabItem(path);
        if (item && item.isFolder()) {
            try {
                console.log("[" + fileName + "]");
                const a = new File(fileName);
                item.add(a);
                returnVal = a.absolutePath();
            } catch (err) {
                returnVal = err;
            }
        } else {
            returnVal = "Cannot find path: " + expandedPath;
        }
        
        return returnVal; 
    }

    #type(cmd) {
        let args = cmd.split(' ');
        let returnVal = undefined;
        let destination = null;

        if (args.length === 2) {
            destination = args[1];
        } else {
            return "Usage: type [<item>]";
        }

        const expandedPath = Terminal.fs.fixpath(destination);

        let item = this.#grabItem(destination);
        if (item) {
            returnVal = expandedPath + " is ";
            if (item.isFolder()) {
                returnVal += "a directory";
            } else if (item.isFile()) {
                returnVal += "a file";
            }
        } else {
            returnVal = "Cannot find path: " + expandedPath;
        }
        
        return returnVal; 
    }

    #symbolLookUp(symbol) {
        let val = undefined;
        if (symbol in this.symbols) {
            val = this.symbols[symbol];
        }
        return val;
    }
}