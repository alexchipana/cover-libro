import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BookMesh } from './BookMesh.js';

export class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.book = null;

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        // Default bg is transparent so CSS grid shows through, unless overridden
        // this.scene.background = null; 

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
        this.camera.position.set(0, 0, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Handle Resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    update() {
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // --- API for UIManager ---

    updateTexture(type, imageSrc) {
        if (this.book) this.book.updateTexture(type, imageSrc);
    }

    setThickness(val) {
        if (this.book) this.book.setThickness(val);
    }

    setFormat(format) {
        if (this.book) this.book.setFormat(format);
    }

    setPose(poseName) {
        // Reset rotation
        const mesh = this.book.mesh;
        mesh.rotation.set(0, 0, 0);
        mesh.position.set(0, 0, 0);

        // GSAP or simple linear interpolation could be better, but setting directly for now
        switch (poseName) {
            case 'standing':
                mesh.rotation.y = -Math.PI / 6; // Slight angle
                break;
            case 'lying':
                mesh.rotation.x = -Math.PI / 2;
                mesh.rotation.z = -Math.PI / 6;
                break;
            case 'angled':
                mesh.rotation.x = 0;
                mesh.rotation.y = -Math.PI / 4;
                mesh.rotation.z = Math.PI / 8;
                break;
        }
    }

    addToStack() {
        if (!this.stackGroup) {
            this.stackGroup = new THREE.Group();
            this.scene.add(this.stackGroup);
            this.stackGroup.position.x = 3.5; // Offset stack to the right
        }

        // Clone current book
        const clone = this.book.mesh.clone();

        // Calculate stack position
        const count = this.stackGroup.children.length;
        const thickness = this.book.thickness;
        const randomRot = (Math.random() - 0.5) * 0.2; // +/- 0.1 rad

        // Start from y=0, stack up
        clone.position.set(0, count * thickness, 0);

        // Force lying down with random spin
        clone.rotation.set(-Math.PI / 2, 0, randomRot);

        this.stackGroup.add(clone);
    }

    clearStack() {
        if (this.stackGroup) {
            this.scene.remove(this.stackGroup);
            this.stackGroup = null;
        }
    }

    setBackground(bgValue) {
        if (bgValue === 'transparent') {
            this.scene.background = null;
        } else if (bgValue.startsWith('#')) {
            this.scene.background = new THREE.Color(bgValue);
        } else if (bgValue === 'wood') {
            // Placeholder: would handle texture load
            new THREE.TextureLoader().load('assets/wood_thumb.jpg', (texture) => {
                this.scene.background = texture;
            });
        }
    }

    getCanvasBlob() {
        return new Promise((resolve) => {
            this.render(); // Force a render
            this.renderer.domElement.toBlob(resolve, 'image/png');
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
