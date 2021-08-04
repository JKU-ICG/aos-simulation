class Drone {
    constructor(forest) {
        this.root = forest.root;
        this.config = forest.config;
        this.scene = forest.scene;
        this.stage = forest.stage;
        this.forest = forest;
        //this.goal = { x: 0, y: 0 };
        //this.position = { x: 0, y: 0, z: 0 };

        new THREE.STLLoader().load('stl/drone.stl', ((droneGeometry) => {
            this.flying = false;
            this.goal = { x: 0, y: 0 };


            droneGeometry.rotateX(-Math.PI / 2).translate(0, 0, 0);
            const droneMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,
                roughness: 0.8,
                metalness: 0.8
            });

            const scale = 0.15;
            const droneMesh = new THREE.Mesh(droneGeometry, droneMaterial);
            droneMesh.scale.set(scale, scale, scale);
            this.drone = droneMesh;

            this.drone.position.x = this.config.drone.eastWest = 0;  //Change the start coordinates of the drone
            this.drone.position.y = this.config.drone.height;
            this.drone.position.z = this.config.drone.northSouth = 0 ; 
            
            this.addDrone();
            this.addCamera();
            this.update();

            this.animate = this.animate.bind(this);
            this.droneMoveTest = this.droneMoveTest.bind(this);
            this.click = doubleClick(this.click.bind(this));

            window.addEventListener('pointerdown', this.click);
            window.addEventListener('pointerup', this.click);

        }).bind(this));
    }

    addDrone() {
        this.scene.add(this.drone);
    }

    addCamera() {
        this.camera = new Camera(this);
    }

    setEastWest(position) {
        this.drone.position.x = position;
        this.update();
    }
    

    setNorthSouth(position) {
        this.drone.position.z = position;
        this.update();
    }

    getView() {
        // drone position on sky
        const x = this.drone.position.x;
        const y = this.drone.position.y;
        const z = this.drone.position.z;

        // angles from sky to ground
        const a = this.config.drone.camera.view / 2;
        const b = 90 - a;
        const c = y / Math.sin(radian(b));

        // field of view "radius" on ground
        const r = Math.sqrt(c ** 2 - y ** 2);

        return {
            x: x,
            y: y,
            z: z,
            r: r
        };
    }

    click(e) {
        if (e.target.parentElement.id !== 'stage' || e.which != 1) {
            return;
        }

        // mouse click coordinates
        const mouse = {
            x: (e.clientX / this.root.clientWidth) * 2 - 1,
            y: (e.clientY / this.root.clientHeight) * -2 + 1
        };
        //var vector = new THREE.Vector3();
        //vector.set((e.clientX / this.root.clientWidth) * 2 - 1, - (e.clientY / this.root.clientHeight) * 2 + 1, 0.5);
        //vector.unproject(this.stage.camera);
        //var dir = vector.sub(this.stage.camera.position).normalize();
        //var distance = - this.stage.camera.position.y / dir.y;
        //var position = this.stage.camera.position.clone().add(dir.multiplyScalar(distance));
        //console.log("x1: " + position.x + " z1: " + position.z);
        //console.log("x2: " + e.clientX + " z2: " + e.clientY);
        //var x3 = ((e.clientX / this.root.clientWidth) * 2 - 1);
        //var z3 = ((e.clientY / this.root.clientHeight) * -2 + 1);
        //console.log("x3: " + x3 + " z3: " + z3);
        //console.log("x4: " + this.root.clientWidth + " z4: " + this.root.clientHeight);
        //vector.project( this.stage.camera );
        //vector.x = ( vector.x + 1) * this.root.clientWidth/ 2;
        //vector.y = - ( vector.y - 1) * this.root.clientHeight / 2;
        //vector.z = 0;
        //console.log("x5: " + vector.x + " z5: " + vector.y);
        // raycast target
        // raycast target
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector3(mouse.x, mouse.y, 1), this.stage.camera);

        const intersects = ray.intersectObject(this.forest.grounds[0]);
        if (intersects.length) {
            // set goal position
            this.goal = intersects[0].point;

            // update config position
            this.config.drone.eastWest = this.drone.position.x;
            this.config.drone.northSouth = this.drone.position.z;

            // set flying
            this.flying = true;

            // animate movement
            this.animate();
        }
    }

    droneMoveTest() {

        
        // mouse click coordinates
        var v = this.root.clientWidth / 2;
        var b =  this.root.clientHeight / 2;
        console.log("a1: " + v + " b1: " + b);
        var vector = new THREE.Vector3();
        vector.set((v / this.root.clientWidth) * 2 - 1, - (b / this.root.clientHeight) * 2 + 1, 0.5);
        vector.unproject(this.stage.camera);
        var dir = vector.sub(this.stage.camera.position).normalize();
        var distance = - this.stage.camera.position.y / dir.y;
        var position = this.stage.camera.position.clone().add(dir.multiplyScalar(distance));
        //var x1 = position.x;
        //var Z1 = position.z;
        var x1 = ((v / this.root.clientWidth) * 2 - 1);
        var z1 = ((b / this.root.clientHeight) * -2 + 1);
        console.log("x1: " + x1 + " z1: " + z1);
        var n = this.root.clientWidth ;
        var m =  this.root.clientHeight ;
        console.log("a2: " + n + " b2: " + m);
        //var vector = new THREE.Vector3();
        //vector.set((v / this.root.clientWidth) * 2 - 1, - (b / this.root.clientHeight) * 2 + 1, 0.5);
        //vector.unproject(this.stage.camera);
        //var dir = vector.sub(this.stage.camera.position).normalize();
        //var distance = - this.stage.camera.position.y / dir.y;
        //var position = this.stage.camera.position.clone().add(dir.multiplyScalar(distance));
        //var x1 = position.x;
        //var Z1 = position.z;
        var x2 = ((n / this.root.clientWidth) * 2 - 1);
        var z2 = ((m / this.root.clientHeight) * -2 + 1);
        console.log("x2: " + x2 + " z2: " + z2);
        var f1 = 0.178455 * (this.root.clientWidth * 0.5);
        var l1 = 0.17891 * (this.root.clientHeight * 0.5);
        console.log("x3: " + f1,"z3: " + l1);
        var x3 = ((x2 - x1)/ (f1));
        var z3 = ((z2 - z1)/ (l1));
        console.log("x4: " + x3 + " z4: " + z3);

        // mouse click coordinates
        //var g = 0.1863 / (this.root.clientWidth * 0.5);
        var g = (x3 * this.config.drone.endx) ;
        console.log("x5: " + g);
        var h = ( z3 * this.config.drone.endy) ;
        console.log("y5: " + h);
        const mouse = {
            x: g ,  //0.0078742D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1 range min is -0.45 range max +0.45
            y: h  //The NDC-to-pixel transformation will invert Y if necessary so that Y in NDC points up.
        };
        
        // raycast target
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector3(mouse.x, mouse.y, 1), this.stage.camera);

        const intersects = ray.intersectObject(this.forest.grounds[0]);
        if (intersects.length) {
            // set goal position
            this.goal = intersects[0].point;

            // update config position
            this.config.drone.eastWest = this.drone.position.x;
            this.config.drone.northSouth = this.drone.position.z;

            // set flying
            this.flying = true;

            // animate movement
            this.animate();
        }
    }

    
    animate(currentTime) {
        if (!currentTime) {
            this.startTime = 0;
            this.lastCapture = 0;
            requestAnimationFrame(this.animate);
            return;
        }
        else if (!this.startTime) {
            this.startTime = currentTime;
        }

        // trajectory coordinates
        const start = new THREE.Vector3(this.config.drone.eastWest, this.config.drone.height, this.config.drone.northSouth);
        const end = new THREE.Vector3(this.goal.x, this.config.drone.height, this.goal.z);

        const moveDuration = start.distanceTo(end) / this.config.drone.speed * 1000;
        if (moveDuration <= 0) {
            return;
        }

        // calculate time
        const deltaTime = currentTime - this.startTime;
        const trajectoryTime = deltaTime / moveDuration;

        // calculate distance
        const currentDistance = deltaTime * this.config.drone.speed / 1000; 
        const deltaDistance = currentDistance - this.lastCapture;

        // DEBUG
        // log('debug', moveDuration, deltaTime, start.distanceTo(end), currentDistance);

        // TODO use distance based logic
        if (deltaTime <= moveDuration) {
            const current = new THREE.Vector3();
            const trajectory = new THREE.Line3(start, end);
            trajectory.at(trajectoryTime, current);

            // update drone position
            this.drone.position.x = current.x;
            this.drone.position.z = current.z;
            this.update();

            // capture image
            if (deltaDistance >= this.config.drone.camera.sampling) {
                this.lastCapture = Math.fround(currentDistance);
                this.camera.capture(true);
            }

            // next animation
            if (this.flying) {
                requestAnimationFrame(this.animate);
            }
        }
        else {
            // goal reached
            this.config.drone.eastWest = this.goal.x;
            this.config.drone.northSouth = this.goal.z;
        

            // reset flying
            this.flying = false;

            // console.log("drone reached goal!");
            // console.log(this.drone)

            // create an event [see: https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events]
            const event = new Event('droneReached');
            // Dispatch the event.
            this.root.dispatchEvent(event);
        
        }
        
    }

    capture() {
        //if (this.camera) {
        //this.config.drone.eastWest = this.drone.position.x = 0;
        //this.config.drone.northSouth = this.drone.position.z = 0;
        this.droneMoveTest(); 
        
       
            /*
            return new Promise(async (resolve) => {
                const view = this.getView(); 

                const start = {
                    x: -35,  // mention the place where you want to start for ex: -35
                    y: 0,
                    z: -35
                };

                const end = {
                    x: 35,
                    y: 0,
                    z: 35
                };

                const step = {
                    x: this.config.drone.camera.sampling,
                    y: 0,
                    z: this.config.drone.camera.sampling,     //(view.r * 2)
                };

                // set flying
                this.flying = true;

                // update drone position
                /*
                let dir = 1 ;
                for (let z = start.z; z <= end.z && this.flying; z = z + step.z) {
                    this.setNorthSouth(z);

                    for (let x = start.x; x <= end.x && this.flying; x = x + step.x) {
                        this.setEastWest(x * dir);
                        
                        // capture image
                        await this.camera.capture(false);
                        await new Promise((r) => { setTimeout(r, 10); });
                    }

                    // swap direction
                    dir = dir * -1;
                }
                
                
                
                let dir = 1 ;              
                for (let x = start.x , z = start.z; x <= end.x && this.flying, z<= end.z && this.flying; x = x + step.x, z= z + step.z) {
                    this.setEastWest(x * dir);
                    this.setNorthSouth(z);
                   
                                   
                    
                    await this.camera.capture(false);
                    await new Promise((r) => { setTimeout(r, 10); });
                   
                
                }*/
               

                // reset drone position
               // this.drone.position.x = 0.0;
               // this.drone.position.z = 0.0;
 
                
                // reset config position
               // this.config.drone.eastWest = this.drone.position.x;
               // this.config.drone.northSouth = this.drone.position.z;

                // reset flying
                //this.flying = false;
                //this.update();

                //resolve();
            //});
        //}
    }
    

    update() {
        if (this.drone) {
            this.drone.position.y = this.config.drone.height;
            

            // update camera
            if (this.camera) {
                this.camera.update();
            }
        }
    }

    export(zip) {
        const drone = zip.folder('drone');

        // export drone
        const speed = this.config.drone.speed;
        const height = this.config.drone.height;
        const coverage = 2 * height * Math.tan(radian(this.config.drone.camera.view / 2));
        drone.file('drone.json', JSON.stringify({ speed: speed, height: height, coverage: coverage }, null, 4));

        // export camera
        if (this.camera) {
            this.camera.export(drone);
        }
    }

    clear() {
        this.flying = false;

        if (this.camera) {
            this.camera.clear();
        }
    }

    reset() {
        
        this.clear();
        //this.drone.position.x = 0;
        //this.drone.position.z = 0;
        this.drone.position.y = this.config.drone.height;
        
        this.update();
        
    }
}
