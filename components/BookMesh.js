import * as THREE from 'three';

export class BookMesh {
    constructor() {
        this.mesh = new THREE.Group(); // Group to hold everything

        this.width = 3.0;
        this.height = 4.5;
        this.thickness = 0.8;
        this.format = 'hardcover'; // 'hardcover' | 'softcover'

        // Materials - Mejorados para respuesta realista a iluminación
        this.materials = {
            cover: new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                roughness: 0.4,
                metalness: 0.1
            }),
            spine: new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                roughness: 0.5,
                metalness: 0.05
            }),
            back: new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                roughness: 0.4,
                metalness: 0.1
            }),
            pages: new THREE.MeshStandardMaterial({
                color: 0xfdfdfd,
                roughness: 0.9,
                metalness: 0.0
            })
        };

        this.initGeometry();
    }

    initGeometry() {
        this.clearGroup();

        if (this.format === 'hardcover') {
            this.buildHardcover();
        } else {
            this.buildSoftcover();
        }

        // Default pose adjustment
        // The default mesh building might center it at 0,0,0
        // We might want to offset so the spine is centered or the bottom is at y=0?
        // keeping it centered for OrbitControls is usually best.
    }

    clearGroup() {
        while (this.mesh.children.length > 0) {
            const obj = this.mesh.children[0];
            if (obj.geometry) obj.geometry.dispose();
            this.mesh.remove(obj);
        }
    }

    buildHardcover() {
        const coverThickness = 0.08;
        const overhang = 0.1;
        const pageThickness = this.thickness - (coverThickness * 2);

        // 1. Front Cover
        const frontGeo = new THREE.BoxGeometry(this.width, this.height, coverThickness);
        const frontMesh = new THREE.Mesh(frontGeo, this.materials.cover);
        frontMesh.position.z = (this.thickness / 2) - (coverThickness / 2);
        frontMesh.castShadow = true;
        frontMesh.receiveShadow = true;
        // Map UVs so the face (Z+) displays the texture correctly
        this.correctUVs(frontGeo, [4]); // 4 is usually the front face

        // 2. Back Cover
        const backGeo = new THREE.BoxGeometry(this.width, this.height, coverThickness);
        const backMesh = new THREE.Mesh(backGeo, this.materials.back);
        backMesh.position.z = -(this.thickness / 2) + (coverThickness / 2);
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;

        // 3. Spine
        // Hardcover spine is usually curved but Box is easier for MVP. 
        // Let's use a box for now, slightly taller?
        const spineGeo = new THREE.BoxGeometry(coverThickness, this.height, this.thickness);
        const spineMesh = new THREE.Mesh(spineGeo, this.materials.spine);
        spineMesh.position.x = -(this.width / 2) - (coverThickness / 2);
        spineMesh.castShadow = true;
        spineMesh.receiveShadow = true;

        // 4. Pages block
        const pagesWidth = this.width - overhang;
        const pagesHeight = this.height - (overhang * 2);
        const pagesGeo = new THREE.BoxGeometry(pagesWidth, pagesHeight, pageThickness);
        const pagesMesh = new THREE.Mesh(pagesGeo, this.materials.pages);
        // Shift pages to align with opposite of spine
        pagesMesh.position.x = (overhang / 2);
        pagesMesh.castShadow = true;
        pagesMesh.receiveShadow = true;

        this.mesh.add(frontMesh, backMesh, spineMesh, pagesMesh);
    }

    buildSoftcover() {
        // Softcover is essentially one block, but we separate faces for materials
        // Actually, BoxGeometry with multi-material is best here.

        // Materials array order for BoxGeometry:
        // 0: right (pages)
        // 1: left (spine)
        // 2: top (pages)
        // 3: bottom (pages)
        // 4: front (cover)
        // 5: back (back cover)

        const geometry = new THREE.BoxGeometry(this.width, this.height, this.thickness);

        const mats = [
            this.materials.pages, // Right
            this.materials.spine, // Left
            this.materials.pages, // Top
            this.materials.pages, // Bottom
            this.materials.cover, // Front
            this.materials.back   // Back
        ];

        const bookObj = new THREE.Mesh(geometry, mats);
        bookObj.castShadow = true;
        bookObj.receiveShadow = true;
        this.mesh.add(bookObj);
    }

    correctUVs(geometry, faceIndices) {
        // Basic reminder: customized UV mapping might be needed if textures look stretched.
        // For BoxGeometry, default mapping is usually 0..1 per face.
        // If we want to ensure specific orientation, we might need rotation.
        // For now, assume default is OK and we can rotate texture if needed.
    }

    updateTexture(type, imageSrc) {
        const loader = new THREE.TextureLoader();
        loader.load(imageSrc, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;

            if (this.materials[type]) {
                const mat = this.materials[type];
                mat.map = tex;
                mat.needsUpdate = true;

                // If cover is updated, adjust dimensions to match aspect ratio
                if (type === 'cover') {
                    const aspectRatio = tex.image.width / tex.image.height;
                    const newWidth = this.height * aspectRatio;
                    this.width = newWidth;
                    this.initGeometry();
                }
            }
        });
    }

    setThickness(val) {
        this.thickness = val;
        this.initGeometry();
        // Note: Rebuilding geometry is expensive but fine for this simple scale.
    }

    setFormat(val) {
        if (this.format !== val) {
            this.format = val;
            this.initGeometry();
        }
    }
}
