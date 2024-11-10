import * as THREE from 'three';

declare class Floor {
    constructor(
        generalParams: object,
        mazeParams: { scale: THREE.Vector3 },
        lightParams: { ambientLight: { intensity: number }, pointLight1: object, pointLight2: object },
        fogParams: object,
        cameraParams: { view: string, multipleViewsViewport: THREE.Vector4 }
    );
    update(): void;
}

export default Floor;
