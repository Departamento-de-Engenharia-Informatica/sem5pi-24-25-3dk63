import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: string,
 *  width: number,
 *  height: number
 * }
 */

export default class SurgeryRoomDoor {
    constructor(parameters) {
        // Destructure parameters
        this.textureUrl = parameters.textureUrl;
        this.width = parameters.width;
        this.height = parameters.height;

        // Load the door texture
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create a group for the door and its outlines
        this.object = new THREE.Group();

        // Define the wall and door heights
        const wallHeight = 5;
        const doorHeight = 4;

        // Create the geometry for the door face
        const geometry = new THREE.PlaneGeometry(this.width, doorHeight);

        // Create a material for the front face of the door
        const frontMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true,
            side: THREE.FrontSide // Display only the front side
        });

        // Create a material for the back face of the door
        const backMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: texture,
            transparent: true,
            side: THREE.BackSide // Display only the back side
        });

        // Create the front face of the door
        const frontFace = new THREE.Mesh(geometry, frontMaterial);
        frontFace.position.set(0, 1.5, 0.01); // Slight offset to avoid z-fighting
        frontFace.castShadow = true;
        frontFace.receiveShadow = true;

        // Create the back face of the door
        const backFace = new THREE.Mesh(geometry, backMaterial);
        backFace.position.set(0, 1.5, -0.01); // Slight offset to avoid z-fighting
        backFace.castShadow = true;
        backFace.receiveShadow = true;

        frontFace.rotation.y = Math.PI ; // Adjust this value as needed
        backFace.rotation.y = Math.PI; // Ensure backFace matches frontFace

        // Add both faces to the door group
        this.object.add(frontFace);
        this.object.add(backFace);
    }
}
