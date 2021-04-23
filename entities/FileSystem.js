import { getText } from '../Utils.js';

class Item {
    isFile() {
        return this instanceof File;
    }
    isFolder() {
        //return this.content === undefined;
        return this instanceof Folder;
    }
}

export class File extends Item {
    filePath; // Local filepath
    key; // file with extension
    name;
    ext;
    parent = null;
    content = "";
    
    constructor(filePath, local=false) {
        super(); // Does nothing

        // filePath in format: './path/./to/file.ext'
        /* const lastSlash = filePath.lastIndexOf('/');
        const lastDot = filePath.lastIndexOf('.');
        const fileName = filePath.substring(lastSlash + 1, lastDot);
        const ext = filePath.substring(lastDot + 1);
        this.key = fileName + '.' + ext;
        this.name = fileName;
        this.ext = ext;
        this.filePath = filePath; */
        let lastSlash = filePath.lastIndexOf('/');
        let firstHalf = filePath.substring(0, lastSlash);
        let secondHalf = filePath.substring(lastSlash + 1);
        String.prototype.count = function(c) {
            let n = 0;
            for (let i = 0; i < this.length; i++) {
                if (this[i] === c) n++;
            }
            return n;
        }
        let periodCount = secondHalf.count('.');
        if (periodCount > 1) {
            throw new Error('Too many periods');
        }
        let lastDot = secondHalf.indexOf('.');
        if (lastDot === 0) {
            throw new Error('Missing file name');
        }
        if (lastDot === secondHalf.length - 1) {
            throw new Error('Missing extension after .');
        }
        if (lastDot === -1) {
            lastDot = secondHalf.length;
        }
        const fileName = secondHalf.substring(0, lastDot);
        const ext = secondHalf.substring(lastDot + 1);

        this.name = fileName;
        this.ext = ext;
        this.key = fileName + (ext ? '.' : "") + ext;
        this.filePath = filePath;
        console.log(this);
    }
    async loadContent() {
        try {
            const text = await getText(this.filePath);
            return text;
        } catch (err) {
            return err;
        }
    }
    absolutePath() {
        let keys = [];
        let cur = this;
        while (cur !== null) {
            keys.push(cur.key);
            cur = cur.parent;
        }
        let path = "";
        for (let i = keys.length - 1; i >= 0; i--) {
            path += keys[i] + '/';
        }
        return path.substring(0, path.length - 1);
    }
}

export class Folder extends Item {

    key;
    items = [];
    parent = null;

    constructor(key) {
        super(); // Does nothing
        
        this.key = key;
    }

    add(item) {
	    item.parent = this;
        this.items.push(item);
    }

    get(key) {
        let res = null;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].key === key) {
                res = this.items[i];
            }
        }
        return res;
    }

    absolutePath() {
        let keys = [];
        let cur = this;
        while (cur !== null) {
            keys.push(cur.key);
            cur = cur.parent;
        }
        let path = "";
        for (let i = keys.length - 1; i >= 0; i--) {
            path += keys[i] + '/';
        }
        return path.substring(0, path.length - 1);
    }
}

export default class FileSystem {

    root;

    constructor(rootKey) {
        this.root = new Folder(rootKey);
        this.root.parent = null;
        this.cur = this.root;
    }

    // Gets the folder or file specified in path, starting at root
    // If can't find, returns null
    get(path) {
        path = this.fixpath(path);
        let keys = path.split('/'); // ['c', 'path', 'to', 'folder']

        if (this.root.key !== keys[0]) {
            return null;
        }

        let cur = this.root;
        for (let i = 1; i < keys.length; i++) {
            let next = cur.get(keys[i]);
            if (next) {
                cur = next;
            } else {
                return null;
            }
        }
        return cur;
    }
    /* goto(path) {
        let destination = this.get(path);
        if (destination) {
            this.cur = destination;
            return true;
        } else {
            return false;
        }
    } */
    // Removes '/' from beginning and/or end of path, expand ~ to root key
    fixpath(path) {
        if (path[0] === '/') {
            path = path.substring(1, path.length);
        }
        if (path[path.length - 1] === '/') {
            path = path.substring(0, path.length - 1);
        }
        path = path.replaceAll('~', this.root.key);
        return path;
    }
}