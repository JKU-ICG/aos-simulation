importScripts('../objects/tree.js', '../objects/person.js');

const getTrees = (configs, chunks) => {
    const trees = [];
    configs.forEach((config, i) => {
        trees.push(new Tree(config));
        if (!((i + 1) % chunks)) {
            self.postMessage(trees);
            trees.splice(0, trees.length);
        }
    });
    self.postMessage(trees);
}

self.onmessage = (e) => {
    getTrees(e.data || [], 10);
}