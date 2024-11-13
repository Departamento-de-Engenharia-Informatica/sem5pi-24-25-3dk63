import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object, animations) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            });
        }

        // Create the graphical user interface
        this.gui = new GUI({ hideable: false });

        // Create the lights folder
        const lightsFolder = this.gui.addFolder("Lights");

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: "#" + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.addColor(ambientColor, "color").onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(lights.object.ambientLight, "intensity", 0.0, 1.0, 0.01);

        // Create directional light folder
        const directionalLightFolder = lightsFolder.addFolder("Directional light");
        const directionalLight = lights.object.directionalLight;
        const directionalColor = { color: "#" + new THREE.Color(directionalLight.color).getHexString() };
        directionalLightFolder.addColor(directionalColor, "color").onChange(color => colorCallback(directionalLight, color));
        directionalLightFolder.add(directionalLight, "intensity", 0.0, 1.0, 0.1);
        directionalLightFolder.add(directionalLight.position, "x", -10.0, 10.0, 0.01);
        directionalLightFolder.add(directionalLight.position, "y", 0.0, 20.0, 0.01);
        directionalLightFolder.add(directionalLight.position, "z", -10.0, 10.0, 0.01);
        directionalLightFolder.add(directionalLight.target.position, "x", -10.0, 10.0, 0.01).name("target x");
        directionalLightFolder.add(directionalLight.target.position, "y", -10.0, 10.0, 0.01).name("target y");
        directionalLightFolder.add(directionalLight.target.position, "z", -10.0, 10.0, 0.01).name("target z");

        // Create the shadows folder
        const shadowsFolder = this.gui.addFolder("Shadows");
        shadowsFolder.add(renderer.shadowMap, "enabled").onChange(enabled => shadowsCallback(enabled));

        // Create the fog folder
        const fogFolder = this.gui.addFolder("Fog");
        const fogColor = { color: "#" + new THREE.Color(fog.color).getHexString() };
        fogFolder.add(fog, "enabled").listen();
        fogFolder.addColor(fogColor, "color").onChange(color => colorCallback(fog.object, color));
        fogFolder.add(fog.object, "near", 0.01, 1.0, 0.01);
        fogFolder.add(fog.object, "far", 1.01, 20.0, 0.01);
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.show();
        }
        else {
            this.gui.hide();
        }
    }
}
