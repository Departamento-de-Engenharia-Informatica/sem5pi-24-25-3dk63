import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  width: Number,
 *  height: Number
 * }
 */

export default class WallWithDoorFrame {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a texture
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create a group of objects
        this.object = new THREE.Group();

        // Define the height and width of the wall
        const height = 4;
        const width = 1;
        const halfheight = (height / 2 - 0.5);

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(width, height);
        let material = new THREE.MeshPhongMaterial({
            color: 0x9cacb2,
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            side: THREE.FrontSide
        });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, halfheight, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the rear face (a rectangle)
        const rearMaterial = material.clone();  // Clone the material to modify texture separately
        rearMaterial.map = texture.clone(); // Clone the texture for the back face
        rearMaterial.map.wrapS = THREE.RepeatWrapping;
        rearMaterial.map.repeat.x = -1;  // Flip the texture horizontally
        face = new THREE.Mesh(geometry, rearMaterial);
        face.rotateY(Math.PI);
        face.position.set(0.0, halfheight, -0.025);
        this.object.add(face);

        // Create the left face (a rectangle)
        geometry = new THREE.PlaneGeometry(0.05, height);
        material = new THREE.MeshPhongMaterial({ color: 0x9cacb2, side: THREE.DoubleSide });
        face = new THREE.Mesh(geometry, material);
        face.position.set(-width / 2, halfheight, 0);
        face.rotateY(Math.PI / 2);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the right face (a rectangle)
        face = new THREE.Mesh().copy(face, false);
        face.position.set(width / 2, halfheight, 0);
        this.object.add(face);

        // Create the top face (a rectangle)
        geometry = new THREE.PlaneGeometry(width, 0.05);
        face = new THREE.Mesh(geometry, material);
        face.position.set(0, height - 0.5, 0);
        face.rotateX(-Math.PI / 2);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);
    }
}
