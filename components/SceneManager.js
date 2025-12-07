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

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Lights - Sistema de iluminación estilo productora (sombras dramáticas)
        // Luz ambiental moderada
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Luz direccional principal (Key Light) desde arriba
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(2, 10, 4);
        dirLight.castShadow = true;

        // Configuración de sombras más dramáticas
        dirLight.shadow.mapSize.width = 4096;
        dirLight.shadow.mapSize.height = 4096;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        dirLight.shadow.bias = -0.0005;
        dirLight.shadow.radius = 4; // Sombras suaves pero definidas
        this.scene.add(dirLight);

        // Luz de relleno muy sutil desde el frente
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(0, 2, 8);
        this.scene.add(fillLight);

        // Luz de borde desde atrás a la izquierda
        const rimLight = new THREE.DirectionalLight(0xffe4c4, 0.4);
        rimLight.position.set(-5, 4, -2);
        this.scene.add(rimLight);

        // Plano para recibir sombras con efecto de reflejo
        const shadowPlaneGeometry = new THREE.PlaneGeometry(25, 25);
        const shadowPlaneMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Sombra más pronunciada
        this.shadowPlane = new THREE.Mesh(shadowPlaneGeometry, shadowPlaneMaterial);
        this.shadowPlane.rotation.x = -Math.PI / 2;
        this.shadowPlane.position.y = -2.26; // Muy cerca del libro
        this.shadowPlane.receiveShadow = true;
        this.scene.add(this.shadowPlane);

        // Book
        this.book = new BookMesh();
        this.scene.add(this.book.mesh);

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
