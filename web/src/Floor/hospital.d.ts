import * as THREE from 'three';

declare class Floor {
    constructor(
        generalParams: object,
        mazeParams: { scale: THREE.Vector3 },
        lightParams: { 
            ambientLight: { intensity: number }, 
            directionalLight: { 
                color: number, 
                intensity: number, 
                position: THREE.Vector3, 
                target: THREE.Vector3 
            } 
        },
        fogParams: object,
        cameraParams: { view: string, multipleViewsViewport: THREE.Vector4 }
    );
    update(): void;
}

export default Floor;
