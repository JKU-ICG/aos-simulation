class View {
    constructor(root, config, files, download=false) {
        this.root = root;
        this.config = config;
        this.files = files;

        // init canvas stage
        this.stage = new Stage(this.root, this.config, () => {
            this.background(this.config.material.color.background);
            this.controls(this.root.querySelector('#controls'));
            this.splitter(['#top', '#bottom']);

            this.forest = new Forest(this.stage);
            this.drone = new Drone(this.forest);
            this.forest.onUpdate(this.drone.update.bind(this.drone));

        });

        
    }

    background(color) {
        // canvas background
        this.stage.renderer.setClearColor(color);

        // document background
        document.body.style.backgroundColor = hexColor(color);
    }

    controls(root) {
        // init gui
        this.gui = new dat.GUI({ autoPlace: false, width: 320 });
        this.gui.useLocalStorage = true;
        root.append(this.gui.domElement);

        // drone folder
        const size = this.config.forest.ground / 2;
        const droneFolder = this.gui.addFolder('drone');
        droneFolder.add(this.config.drone, 'speed', 1, 20, 1).onChange(() => this.drone.update());
        droneFolder.add(this.config.drone, 'height', 1, 100, 1).onChange(() => this.drone.update()).onFinishChange(() => this.forest.update());
        droneFolder.add(this.config.drone, 'eastWest', -size, size, 1).onChange((v) => this.drone.setEastWest(v)).listen();
        droneFolder.add(this.config.drone, 'northSouth', -size, size, 1).onChange((v) => this.drone.setNorthSouth(v)).listen();
      
        droneFolder.add(this.config.drone, 'endx', -size, size, 1).onChange(() => this.drone.update());
        droneFolder.add(this.config.drone, 'endy', -size, size, 1).onChange(() => this.drone.update());

        // camera folder
        const cameraFolder = droneFolder.addFolder('camera');
        cameraFolder.add(this.config.drone.camera, 'view', 10, 160, 1).onChange(() => this.drone.update()).onFinishChange(() => this.forest.update());
        //cameraFolder.add(this.config.drone.camera, 'images', 0, 60, 1).onChange(() => this.drone.update());
        cameraFolder.add(this.config.drone.camera, 'sampling', 0.5, 10.0, 0.5).onChange(() => this.drone.update());
        cameraFolder.add(this.config.drone.camera, 'resolution', 128, 1024, 1).onChange(() => this.drone.update());
        cameraFolder.add(this.config.drone.camera, 'orientation', 0, 360, 45).onChange(() => this.drone.update());
        cameraFolder.add(this.config.drone.camera, 'type', ['infrared', 'monochrome']).onChange(() => this.drone.reset());

        // cpu folder
        //const cpuFolder = droneFolder.addFolder('cpu');
        //cpuFolder.add(this.config.drone.cpu, 'speed', 0.1, 2.0, 0.1).onChange(() => this.drone.update());

        // forest folder
        const forestFolder = this.gui.addFolder('forest');
        forestFolder.add(this.config.forest, 'size', 1, 2000, 1).onFinishChange(() => {
            this.drone.clear();
            this.drone.update();

            this.forest.clear();
            this.forest.update();
            this.forest.addTrees();
            this.forest.addPersons();
        });

        forestFolder.add(this.config.forest, 'persons', 0, 20, 1).onFinishChange(() => {
            this.reset();
        });
        forestFolder.add(this.config.forest, 'personstartx', -size, size, 1).onFinishChange(() => {
            this.reset();
        });
        forestFolder.add(this.config.forest, 'personstarty', -size, size, 1).onFinishChange(() => {
            this.reset();
        });
        forestFolder.add(this.config.forest, 'personendx', -size, size, 1).onFinishChange(() => {
            this.reset();
        });
        forestFolder.add(this.config.forest, 'personendy', -size, size, 1).onFinishChange(() => {
            this.reset();
        });
        forestFolder.add(this.config.forest, 'personSpeed', 0, 20, 1).onFinishChange(() => {
            this.reset();
        });

        forestFolder.add(this.config.forest, 'personOrientation', 0, 360, 45).onFinishChange(() => {
            this.reset();
        });
       
        forestFolder.add(this.config.forest, 'ground', 10, 500, 1).onFinishChange(() => {
            this.drone.clear();
            this.drone.update();

            this.forest.clear(true);
            this.forest.update();
            this.forest.addTrees();
            this.forest.addPersons();

            this.drone.setEastWest(0.0);
            this.drone.setNorthSouth(0.0);
        });

        // tree folder
        const treeFolder = forestFolder.addFolder('trees');
        const treeFolders = [
            treeFolder.add(this.config.forest.trees, 'levels', 0, 10, 1),
            treeFolder.add(this.config.forest.trees, 'twigScale', 0.0, 1.0, 0.05),
            treeFolder.add(this.config.forest.trees, 'homogeneity', 50, 100, 1),
            treeFolder.add(this.config.forest.trees, 'type', ['needle-leaf', 'broad-leaf','ash-leaf','mixed-leaf','maple-leaf','texture1-leaf','texture2-leaf','texture3-leaf'])
        ];

        // branching folder
        const branchingFolder = treeFolder.addFolder('branching');
        const branchingFolders = [
            branchingFolder.add(this.config.forest.trees.branching, 'initialBranchLength', 0.1, 1.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'lengthFalloffFactor', 0.1, 1.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'lengthFalloffPower', 0.1, 1.5, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'clumpMax', 0.0, 1.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'clumpMin', 0.0, 1.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'branchFactor', 2.0, 4.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'dropAmount', -1.0, 1.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'growAmount', -1.0, 1.0, 0.05),
            branchingFolder.add(this.config.forest.trees.branching, 'sweepAmount', -1.0, 1.0, 0.05)
        ];

        // trunk folder
        const trunkFolder = treeFolder.addFolder('trunk');
        const trunkFolders = [
            trunkFolder.add(this.config.forest.trees.trunk, 'maxRadius', 0.05, 0.5, 0.05),
            trunkFolder.add(this.config.forest.trees.trunk, 'climbRate', 0.05, 2.0, 0.05),
            trunkFolder.add(this.config.forest.trees.trunk, 'trunkKink', 0.0, 0.5, 0.05),
            trunkFolder.add(this.config.forest.trees.trunk, 'treeSteps', 0.0, 20.0, 0.05),
            trunkFolder.add(this.config.forest.trees.trunk, 'taperRate', 0.7, 1.0, 0.05),
            trunkFolder.add(this.config.forest.trees.trunk, 'radiusFalloffRate', 0.5, 0.9, 0.05),
            trunkFolder.add(this.config.forest.trees.trunk, 'twistRate', 0.0, 20.0, 1),
            trunkFolder.add(this.config.forest.trees.trunk, 'trunkLength', 0.1, 5.0, 0.05)
        ];

        // forest folder
        [treeFolders, branchingFolders, trunkFolders].forEach((folder) => {
            folder.forEach((v) => {
                v.onChange(() => {
                    this.forest.clear();
                    this.forest.addTrees();
                    this.forest.addPersons();
                });
            });
        });

        // materials folder
        const materialsFolder = this.gui.addFolder('material');

        // color folder
        const colorFolder = materialsFolder.addFolder('color');
        //colorFolder.addColor(this.config.material.color, 'tree').onChange((v) => this.forest.treeMaterial.color.setHex(v));
        //colorFolder.addColor(this.config.material.color, 'twig').onChange((v) => this.forest.twigMaterial.color.setHex(v));
        colorFolder.addColor(this.config.material.color, 'ground').onChange((v) => this.forest.groundMaterial.color.setHex(v));
        colorFolder.addColor(this.config.material.color, 'plane').onChange((v) => this.drone.camera.planeMaterial.color.setHex(v));
        colorFolder.addColor(this.config.material.color, 'person').onFinishChange(this.reset.bind(this));
        colorFolder.addColor(this.config.material.color, 'background').onChange(this.background.bind(this));

        // config preset
        this.gui.add(this.config, 'preset', this.files).onChange((v) => {
            this.gui.load.preset = v;
            window.location.reload();
        });

        // simulation data

        this.gui.add(this, 'capture');
        this.gui.add(this, 'export');
        this.gui.add(this, 'reset');
    }

    splitter(elements) {
        // init split
        Split(elements, {
            gutterSize: 5,
            sizes: [80, 20],
            minSize: [0, 0],
            cursor: 'ns-resize',
            direction: 'vertical',
            onDrag: () => { this.stage.update(); },
            gutter: () => {
                const gutter = document.createElement('div');
                gutter.id = 'gutter';
                return gutter;
            }
        });

        // update stage canvas
        this.stage.update();
    }

    capture() {
        
        //sthis.reset();
        
        
        
       
        
        // capture images and export
        
        this.drone.capture();
        this.forest.personMoveTest();
        //this.forest.personMoveTest1();
        //this.stage.reset();
        //this.reset();
        //this.stage.reset();
        //this.forest.personMoveTest1();
            
           // this.stage.reset();
            //this.export();
        
       
                
        //});
        
        
        
    }

    export() {
        const zip = new JSZip();
        let dstr = (new Date()).yyyymmddhhmm();
        console.log(dstr)
        const name = `${document.title}-${dstr}.zip`;

        // add folders
        this.stage.export(zip);
        this.forest.export(zip);
        this.drone.export(zip);

        // add config file
        zip.file('config.json', JSON.stringify(this.config, null, 4));

        // generate zip
        zip.generateAsync({ type: 'blob' }).then((data) => {
            saveAs(data, name);
        });
    }

    reset() {
        this.forest.reset();

        this.drone.reset();
        
    }

    automaticDownload() {
        // wait till all trees are initialized with peridic checks
        var intervalId = setInterval(() => {
            
            // this checks if no element in trees (array) is undefined
            // very hacky, maybe there is a better way to work for the workers???
            //console.log( this.forest.trees.includes(undefined)

            if(this.forest.trees.includes(undefined)==false){ // all trees are initialized
                this.capture();             

                clearInterval(intervalId); // stop periodic checks

                // drone reached event: 'droneReached'
                this.drone.root.addEventListener( 'droneReached', () => {
                    this.export();        
                }, false);
            }

          }, 500);
        
        
        // drone reached event: 'droneReached'
        /*
        this.drone.root.addEventListener( 'droneReached', () => {
            this.export();        
        }, false);
        */
    }
}

const getPreset = async (files) => {
    // load presets from local storage
    let load = JSON.parse(localStorage.getItem(getLocalStorageKey('gui')) || '{}');
    if (load.preset) {
        return load.preset;
    }

    // load presets from json
    const presets = (configRoot, config, guiRoot, gui) => {
        for (let key in config) {
            if (!config.hasOwnProperty(key)) {
                continue;
            }

            if (typeof config[key] == 'object') {
                // get config subfolder
                presets(configRoot, config[key], guiRoot, gui.addFolder(key));
            }
            else {
                // get config parent keys
                let guiParent = gui;
                let configParents = [];
                while (guiParent.parent) {
                    configParents.unshift(guiParent.name);
                    guiParent = guiParent.parent;
                }

                // set config target
                let configTarget = configRoot;
                let configSource = clone(configRoot);
                configParents.forEach((key) => {
                    configTarget = configTarget[key];
                    configSource = configSource[key];
                });

                // add config properties
                if (configParents.includes('color')) {
                    gui.addColor(configTarget, key);
                }
                else {
                    gui.add(configTarget, key);
                }

                // remember config value
                Object.assign(configTarget, configSource);
                guiRoot.remember(configTarget);
            }
        }
    };

    await Promise.all([...files].reverse().map(getConfig)).then((configs) => {
        configs.forEach((config) => {
            const gui = new dat.GUI({ autoPlace: false });
            gui.useLocalStorage = true;

            // generate and save presets
            presets(config, config, gui, gui);
            gui.saveAs(config.preset);
            gui.destroy();
        });
    });

    return JSON.parse(localStorage.getItem(getLocalStorageKey('gui'))).preset;
}

const getConfig = async (preset) => {
    return new Promise((resolve) => {
        fetch(`config/${preset}.json`).then((response) => {
            return response.json();
        }).then((config) => {
            config.preset = preset;
            for (key in config.material.color) {
                config.material.color[key] = parseInt(config.material.color[key], 16);
            }
            resolve(config);
        }).catch(async () => {
            return resolve(await getConfig('demo'));
        });
    });
}

var view = null;

document.addEventListener('DOMContentLoaded', async () => {

    // make Math.random() predictable globally
    Math.seedrandom(document.title);

    // define preset files
    const files = [
        'demo',
        'forest-test',
        'forest-01',
        'forest-02',
        'forest-03',
        'forest-04',
        'forest-05',
        'forest-06',
        'forest-12',
        'forest-13',
        'forest-14',
        'forest-21',
        'forest-22',
        'forest-23',
        'forest-31',
        'forest-32',
        'forest-33',
        'forest-41',
        'forest-42',
        'forest-43'
    ];

  
        const queryString = window.location.search;
        console.log(queryString);
        // ?product=shirt&color=blue&newuser&size=m
        preset = 'demo'; ///await getPreset(files);    
        const urlParams = new URLSearchParams(queryString);
        console.log("urldownload: " + urlParams.get('download'));
        if (urlParams.get('download') == null)
        {
            preset = 'demo'; ///await getPreset(files);
            console.log("enx4: " + preset);
        }
        if (urlParams.get('download') >= 1)
        {
            preset = files[parseInt(urlParams.get('download'))]; ///await getPreset(files);
            console.log("e1x4: " + preset);
        }
        else
        {
            preset = 'demo'; ///await getPreset(files);
            console.log("eax4: " + preset);
        }
        //const preset = 'demo'; ///await getPreset(files);
        console.log("x4: " + preset);
        const config = await getConfig(preset);
       


        // init view
        view = new View(document.querySelector('#top'), config, files, true);
        console.log("inti view  done and url has download " + urlParams.has('download') + "and url get download is " +  urlParams.get('download'));
        if(urlParams.has('download') && parseInt(urlParams.get('download')) >= 1)
        {
            console.log('Download!');
            console.log(view);
            view.automaticDownload();
            //view.capture();
            //view.export();

        }
        await timeout(40000)
        if (urlParams.get('download') != null)
        {
            val = parseInt(urlParams.get('download')) + 1
            console.log("val: " + val);
            urlstring =   'http://127.0.0.1:5501/?download=' + val.toString()
        }
        else{
            urlstring = 'http://127.0.0.1:5501/?download=1'
        }
        window.location.replace(urlstring);
    //}, 5000);

    
    
});
