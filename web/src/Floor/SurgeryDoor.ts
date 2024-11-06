// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as THREE from "three";

// Define a type or interface for parameters
interface SurgeryRoomDoorParameters {
    textureUrl: string;  // URL for the texture
    width: number;       // Width of the wall
    height: number;      // Height of the wall
}

/*
 * SurgeryRoomDoor class with a typed constructor parameter
 */
export default class SurgeryRoomDoor {
    object: THREE.Group;
    textureUrl: string;
    width: number;
    height: number;

    // Constructor with a typed parameter
    constructor(parameters:SurgeryRoomDoorParameters) {
        // Destructure the parameters and assign to class properties
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

        // Ensure that the geometry used is PlaneGeometry (not BufferGeometry)
        let geometry = new THREE.PlaneGeometry(width, height);  // Correct type
        let material = new THREE.MeshPhongMaterial({
            color: 0x9cacb2,
            map: texture,
            side: THREE.DoubleSide,  // Using DoubleSide here
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
        geometry = new THREE.PlaneGeometry(0.05, height);  // Correct type
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
        geometry = new THREE.PlaneGeometry(width, 0.05);  // Correct type
        face = new THREE.Mesh(geometry, material);
        face.position.set(0, height - 0.5, 0);
        face.rotateX(-Math.PI / 2);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);
    }
}
