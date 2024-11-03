import * as THREE from "three";
import Orientation from "./orientation.js";

/*
 * parameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 */

export default class Camera {
    constructor(parameters, windowWidth, windowHeight) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.viewport = this.multipleViewsViewport.clone();
        this.target = this.target.clone();

        // Compute half of the size of the target plane as a function of the camera's distance to the target and the field-of-view
        this.initialHalfSize = Math.tan(THREE.MathUtils.degToRad(this.initialFov / 2.0)) * this.initialDistance;

        // The player direction (expressed in degrees) is needed to compute the horizontal orientation of the first- and third-person view cameras
        this.playerDirection = 0.0;

        // Create two cameras (perspective and orthographic projection)
        this.perspective = new THREE.PerspectiveCamera();
        this.orthographic = new THREE.OrthographicCamera();

        this.setWindowSize(windowWidth, windowHeight);
        this.initialize();
    }

    /*
     *        Y
     *        |
     *        O -- X
     *       /
     *      Z
     */

    // Set the camera's position, orientation and target (positive Y-semiaxis up)
    setViewingParameters() {
        const orientation = new Orientation(this.orientation.h + this.playerDirection, this.orientation.v);
        const cosH = Math.cos(THREE.MathUtils.degToRad(orientation.h));
        const sinH = Math.sin(THREE.MathUtils.degToRad(orientation.h));
        const cosV = Math.cos(THREE.MathUtils.degToRad(orientation.v));
        const sinV = Math.sin(THREE.MathUtils.degToRad(orientation.v));
        // Position
        let positionX = this.target.x;
        let positionY = this.target.y;
        let positionZ = this.target.z;
        if (this.view != "first-person") {
            positionX -= this.distance * sinH * cosV;
            positionY -= this.distance * sinV;
            positionZ -= this.distance * cosH * cosV;
        }
        this.perspective.position.set(positionX, positionY, positionZ);
        this.orthographic.position.set(positionX, positionY, positionZ);
        // Up vector
        const upX = -sinH * sinV;
        const upY = cosV;
        const upZ = -cosH * sinV;
        this.perspective.up.set(upX, upY, upZ);
        this.orthographic.up.set(upX, upY, upZ);
        // Target
        const target = this.target.clone();
        if (this.view == "first-person") {
            target.x += sinH * cosV;
            target.y += sinV;
            target.z += cosH * cosV;
        }
        this.perspective.lookAt(target);
        this.orthographic.lookAt(target);
    }

    setProjectionParameters() {
        // Adjust the camera's field-of-view if needed; Set the left, right, top and bottom clipping planes
        let fov, left, right, top, bottom;
        if (this.aspectRatio < 1.0) {
            fov = 2.0 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(this.initialFov / 2.0)) / this.aspectRatio));
            right = this.initialHalfSize;
            left = -right;
            top = right / this.aspectRatio;
            bottom = -top;
        }
        else {
            fov = this.initialFov;
            top = this.initialHalfSize;
            bottom = -top;
            right = top * this.aspectRatio;
            left = -right;
        }

        // Perspective projection camera: the zoom effect is achieved by changing the value of the field-of-view; the PerspectiveCamera.zoom property does just that
        this.perspective.fov = fov;
        this.perspective.aspect = this.aspectRatio;
        this.perspective.near = this.near;
        this.perspective.far = this.far;
        this.perspective.zoom = this.zoom;
        this.perspective.updateProjectionMatrix();

        // Orthographic projection camera: the zoom effect is achieved by changing the values of the left, right, top and bottom clipping planes; the OrthographicCamera.zoom property does just that
        this.orthographic.left = left;
        this.orthographic.right = right;
        this.orthographic.top = top;
        this.orthographic.bottom = bottom;
        this.orthographic.near = this.near;
        this.orthographic.far = this.far;
        this.orthographic.zoom = this.zoom;
        this.orthographic.updateProjectionMatrix();
    }

    setActiveProjection(projection) {
        this.projection = projection;
        if (this.projection != "orthographic") {
            this.object = this.perspective;
        }
        else {
            this.object = this.orthographic;
        }
    }

    initialize() {
        this.orientation = this.initialOrientation.clone();
        this.distance = this.initialDistance;
        this.zoom = this.initialZoom;

        // Set the viewing parameters (position, orientation and target)
        this.setViewingParameters();

        // Set the projection parameters (perspective: field-of-view, aspect ratio, near and far clipping planes; orthographic: left, right, top, bottom, near and far clipping planes)
        this.setProjectionParameters();

        // Set the default camera projection: mini-map: orthographic; remaining views: perspective
        if (this.view != "mini-map") {
            this.setActiveProjection("perspective");
        }
        else {
            this.setActiveProjection("orthographic");
        }
    }

    getViewport() { // Converted from % to pixels
        const windowMinSize = Math.min(this.windowWidth, this.windowHeight);
        let x;
        let y;
        let width = this.viewport.width;
        let height = this.viewport.height;
        if (this.view != "mini-map") {
            x = this.viewport.x * (1.0 - this.viewport.width);
            y = this.viewport.y * (1.0 - this.viewport.height);
            if (this.windowWidth < this.windowHeight) {
                x *= windowMinSize;
                y *= this.windowHeight;
                width *= windowMinSize;
                height *= this.windowHeight;
            }
            else {
                x *= this.windowWidth;
                y *= windowMinSize;
                width *= this.windowWidth;
                height *= windowMinSize;
            }
        }
        else {
            width *= windowMinSize;
            height *= windowMinSize;
            x = this.viewport.x * (this.windowWidth - width);
            y = this.viewport.y * (this.windowHeight - height);
        }
        return new THREE.Vector4(x, y, width, height);
    }

    setViewport(multipleViews) {
        if (multipleViews) {
            this.viewport = this.multipleViewsViewport.clone();
        }
        else {
            this.viewport = new THREE.Vector4(0.0, 0.0, 1.0, 1.0);
        }
        const viewport = this.getViewport();
        this.aspectRatio = viewport.width / viewport.height;
        this.setProjectionParameters();
    }

    setWindowSize(windowWidth, windowHeight) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        const viewport = this.getViewport();
        this.aspectRatio = viewport.width / viewport.height;
    }

    updateWindowSize(windowWidth, windowHeight) {
        this.setWindowSize(windowWidth, windowHeight);
        this.setProjectionParameters();
    }

    setTarget(target) {
        this.target.copy(target);
        this.setViewingParameters();
    }

    updateTarget(targetIncrement) {
        this.setTarget(this.target.add(targetIncrement));
    }

    setOrientation(orientation) {
        this.orientation.copy(orientation).clamp(this.orientationMin, this.orientationMax);
        this.setViewingParameters();
    }

    updateOrientation(orientationIncrement) {
        this.setOrientation(this.orientation.add(orientationIncrement));
    }

    setDistance(distance) {
        this.distance = THREE.MathUtils.clamp(distance, this.distanceMin, this.distanceMax);
        this.setViewingParameters();
    }

    updateDistance(distanceIncrement) {
        this.setDistance(this.distance + distanceIncrement);
    }

    setZoom(zoom) {
        this.zoom = THREE.MathUtils.clamp(zoom, this.zoomMin, this.zoomMax);
        this.perspective.zoom = this.zoom;
        this.perspective.updateProjectionMatrix();
        this.orthographic.zoom = this.zoom;
        this.orthographic.updateProjectionMatrix();
    }

    updateZoom(zoomIncrement) {
        this.setZoom(this.zoom + zoomIncrement);
    }
}