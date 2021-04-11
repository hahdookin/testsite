export class File {
    key;
    parent;
    content = "";
    extension = "";
    constructor(key) {
        this.key = key;
    }
}

export class Folder {
    key;
    items = [];
    parent = null;
    constructor(key) {
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
    cur;
    constructor(rootKey) {
        this.root = new Folder(rootKey);
        this.root.parent = null;
        this.cur = this.root;
    }
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
    goto(path) {
        let destination = this.get(path);
        if (destination) {
            this.cur = destination;
            return true;
        } else {
            return false;
        }
    }
    // Removes '/' from beginning and/or end of path, expand ~ to root
    fixpath(path) {
        if (path[0] === '/') {
            path = path.substring(1, path.length);
        }
        if (path[path.length - 1] === '/') {
            path = path.substring(0, path.length - 1);
        }
        path = path.replaceAll('~', 'root');
        return path;
    }
}