import * as THREE from "three";

/*
 * parameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  directionalLight: { color: Integer, intensity: Float, position: Vector3, target: Vector3 }
 * }
 */

export default class Lights {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the ambient light
        this.object.ambientLight = new THREE.AmbientLight(this.ambientLight.color, this.ambientLight.intensity);
        this.object.add(this.object.ambientLight);

        // Create the directional light and enable shadows
        this.object.directionalLight = new THREE.DirectionalLight(this.directionalLight.color, this.directionalLight.intensity);
        this.object.directionalLight.position.set(
            this.directionalLight.position.x,
            this.directionalLight.position.y,
            this.directionalLight.position.z
        );
        this.object.directionalLight.castShadow = true;

        // Set up shadow properties for the directional light
        this.object.directionalLight.shadow.mapSize.width = 1024;
        this.object.directionalLight.shadow.mapSize.height = 1024;
        this.object.directionalLight.shadow.camera.near = 1;
        this.object.directionalLight.shadow.camera.far = 100;
        this.object.directionalLight.shadow.camera.left = -10;
        this.object.directionalLight.shadow.camera.right = 10;
        this.object.directionalLight.shadow.camera.top = 10;
        this.object.directionalLight.shadow.camera.bottom = -10;

        // Optionally, set the target for the directional light
        if (this.directionalLight.target) {
            const target = new THREE.Object3D();
            target.position.set(
                this.directionalLight.target.x,
                this.directionalLight.target.y,
                this.directionalLight.target.z
            );
            this.object.add(target);
            this.object.directionalLight.target = target;
        }

        this.object.add(this.object.directionalLight);
    }
}
