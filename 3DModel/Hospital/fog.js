import * as THREE from "three";

/*
 * parameters = {
 *  enabled: Boolean,
 *  color: Integer,
 *  near: Float,
 *  far: Float
 * }
 */

export default class Fog {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create the fog
        this.object = new THREE.Fog(this.color, this.near, this.far);
    }
}