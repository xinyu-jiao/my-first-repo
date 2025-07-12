/* =========================================================
   P5.js and Three.js Sketches
========================================================= */
function initializeSketches() {
    const sketch1 = (p) => {
        p.setup = () => {
            p.createCanvas(500, 300);
            p.noLoop();

            const forestBackground = p.color('#a6cdb3');
            const lakeColor = p.color('#75e6d4');
            const grassColor = p.color('#b6eeb3');
            const islandColors = [p.color('#77dd77'), p.color('#4caf50'), p.color('#a4de02')];

            p.noStroke();
            p.fill(forestBackground);
            p.rect(0, 0, p.width, 50);

            p.fill(lakeColor);
            p.rect(0, 50, p.width, 200);

            for (let i = 0; i < 8; i++) {
                const islandX = p.random(20, p.width - 80);
                const islandY = p.random(120, 190);
                const w = p.random(50, 100);
                const h = p.random(8, 20);
                p.fill(p.random(islandColors));
                p.ellipse(islandX, islandY, w, h);
            }

            const swanX = p.width / 2;
            const swanY = 140;
            p.fill(255);
            p.ellipse(swanX, swanY, 10, 6);
            p.triangle(swanX + 4, swanY - 1, swanX + 8, swanY - 1, swanX + 4, swanY - 4);

            p.fill(grassColor);
            p.rect(0, 250, p.width, 50);
        };
    };

    const sketch2 = (p) => {
        p.setup = () => {
            p.createCanvas(500, 250);
            p.background(20, 20, 30);
        };

        p.draw = () => {
        };

        p.mouseMoved = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                let r = p.map(p.mouseX, 0, p.width, 100, 255);
                let b = p.map(p.mouseX, 0, p.width, 255, 100);

                let size = p.map(p.mouseY, 0, p.height, 5, 40);

                p.noStroke();
                p.fill(r, 100, b, 150);
                p.circle(p.mouseX, p.mouseY, size);
            }
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                p.background(20, 20, 30);
            }
        }
    };

    const sketch3 = () => {
        const container = document.getElementById('canvas-container-3');
        if (!container) return;

        // scene, camera, renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 500 / 250, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 250);
        renderer.setClearColor(0x000000);
        container.appendChild(renderer.domElement);

        // lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
        topLight.position.set(0, 10, 0);
        scene.add(topLight);

        // create heart shape
        const heartShape = new THREE.Shape();
        const scale = 0.05;
        const points = [];
        for (let t = 0; t < Math.PI * 2; t += 0.01) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            points.push(new THREE.Vector2(x * scale, y * scale));
        }
        heartShape.setFromPoints(points);

        // extrude to 3D
        const extrudeSettings = {
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.15,
            bevelSegments: 1
        };
        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 100 });

        // create 3 hearts 
        const hearts = [];
        const positions = [-4, 0, 4];

        positions.forEach((xPos) => {
            const heart = new THREE.Mesh(geometry, material);
            heart.rotation.x = Math.PI;
            heart.rotation.z = Math.PI;
            heart.position.set(xPos, 0.5, 0);
            scene.add(heart);
            hearts.push(heart);
        });

        // camera setup
        camera.position.set(0, 2.5, 7);
        camera.lookAt(0, 0.5, 0);

        // animate
        function animate() {
            requestAnimationFrame(animate);
            hearts.forEach((heart, i) => {
                heart.rotation.y += 0.01 + i * 0.002;
                heart.rotation.x += 0.005 + i * 0.001;
            });
            renderer.render(scene, camera);
        }
        animate();
    };

    const sketch4 = () => {
        const container = document.getElementById('canvas-container-4');
        if (!container) return;

        // scene, camera, renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 500 / 250, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 250);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true; // shadow enabled
        container.appendChild(renderer.domElement);

        // orbit controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.05;

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 2);
        scene.add(hemiLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 7.5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);
        
        // fogs
        scene.fog = new THREE.Fog(0x080820, 10, 30);
        scene.background = scene.fog.color;

        // geoms and meshes
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
        
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.9,
            roughness: 0.1
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.y = 1.5;
        sphere.castShadow = true;
        scene.add(sphere);

        const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
        const torusKnotMaterial = new THREE.MeshNormalMaterial();
        const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnot.position.set(-3, 1, 0);
        torusKnot.castShadow = true;
        scene.add(torusKnot);

        // camera position and controls
        camera.position.set(0, 4, 10);
        controls.update();

        // animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            torusKnot.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    };

    if (document.getElementById('canvas-container-1')) {
        new p5(sketch1, 'canvas-container-1');
    }
    if (document.getElementById('canvas-container-2')) {
        new p5(sketch2, 'canvas-container-2');
    }
    if (document.getElementById('canvas-container-3')) {
        sketch3();
    }
    if (document.getElementById('canvas-container-4')) {
        sketch4();
    }
}