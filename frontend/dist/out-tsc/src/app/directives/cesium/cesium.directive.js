"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CesiumDirective = /** @class */ (function () {
    function CesiumDirective(el) {
        this.el = el;
    }
    CesiumDirective.prototype.ngOnInit = function () {
        Cesium.BingMapsApi.defaultKey = 'Ah3eY7hA-LBI8Bwm7IZBoQYdl0sAJONdh9NdgsN1TnV1yr7uFsZTLyhuPJ_4IBei';
        this.viewer = new Cesium.Viewer(this.el.nativeElement, {
            shadows: false,
            animation: false,
            navigationHelpButton: false,
            homeButton: false,
            selectionIndicator: false,
            baseLayerPicker: true,
            timeline: false,
            //skyAtmosphere : true,
            //skyBox : false,
            scene3DOnly: true,
            targetFrameRate: 30
        });
        this.initCamera();
        //wait until scene is rendered properly
        setTimeout(function () {
            // default navigation mode is now pedestrian
            this.pedestrianView();
        }, 5000);
    };
    CesiumDirective.prototype.initCamera = function () {
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        var camera = this.viewer.camera;
        camera.setView({
            destination: new Cesium.Cartesian3.fromDegrees(-0.198318, 51.499100, 0.0),
            orientation: {
                heading: -1.5,
                pitch: 0,
                roll: 0.0
            }
        });
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
        this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1.8;
    };
    CesiumDirective.prototype.pedestrianView = function () {
        var defaultHeight;
        var defaultPitch;
        var startMousePosition;
        var mousePosition;
        var flags = {
            looking: false,
            moveForward: false,
            moveBackward: false,
            moveUp: false,
            moveDown: false,
            moveLeft: false,
            moveRight: false
        };
        var leftMouseClicked = false;
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
        this.viewer.scene.screenSpaceCameraController.enableTilt = false;
        this.viewer.scene.screenSpaceCameraController.enableLook = false;
        //Bug: This camera set jams cesium as a lot of variables are not initialised at this time => async race
        // --> Temporarily solved by setting a Timeout in viewerInit() for 5sec. 
        // 					-> Better approach: find a cesium method which tells you that the rendering is done and
        //										then execute pedestrianView()
        var currentHeight = this.viewer.scene.globe.getHeight(this.viewer.camera.positionCartographic);
        var newCameraPosition = Cesium.Cartesian3.fromRadians(this.viewer.camera.positionCartographic.longitude, this.viewer.camera.positionCartographic.latitude, this.currentHeight + 1.8);
        this.viewer.camera.flyTo({
            destination: this.newCameraPosition,
            orientation: {
                heading: this.viewer.camera.heading,
                pitch: 0,
                roll: 0.0
            }
        });
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        handler.setInputAction();
        handler.setInputAction(function (movement) {
            //flags.looking = true;
            leftMouseClicked = true;
            mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        handler.setInputAction(function (movement) {
            mousePosition = movement.endPosition;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(function (position) {
            leftMouseClicked = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        handler.setInputAction(function (movement) {
            flags.looking = true;
            mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
        }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        handler.setInputAction(function (position) {
            flags.looking = false;
        }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
        viewer.clock.onTick.addEventListener(function (clock) {
            var camera = this.viewer.camera;
            if (leftMouseClicked) {
                var width = this.viewer.canvas.clientWidth;
                var height = this.viewer.canvas.clientHeight;
                // Coordinate (0.0, 0.0) will be where the mouse was clicked.
                var x = (mousePosition.x - startMousePosition.x) / width;
                var y = -(mousePosition.y - startMousePosition.y) / height;
                //adjust moving speed foward/backward (by lowering the number you slow down the moving speed)
                var moveFactor = 0.01;
                //adjust Looking Factor when moving left or right
                var lookFactorHorizontal = 0.5;
                if (startMousePosition.y > mousePosition.y) {
                    this.camera.moveForward(-(mousePosition.y - startMousePosition.y) * moveFactor);
                    this.camera.lookRight(x * lookFactorHorizontal);
                    //comment out if using left and right movement with the left click
                    this.camera.setView({
                        orientation: {
                            heading: this.camera.heading,
                            pitch: this.camera.pitch,
                            roll: 0
                        }
                    });
                }
                else if (startMousePosition.y < mousePosition.y) {
                    this.camera.moveBackward((mousePosition.y - startMousePosition.y) * moveFactor);
                    this.camera.lookRight(x * lookFactorHorizontal);
                    //comment out if using left and right movement with the left click
                    this.camera.setView({
                        orientation: {
                            heading: this.camera.heading,
                            pitch: this.camera.pitch,
                            roll: 0
                        }
                    });
                }
                //+++++ description for the commented out code below: ++++++++++++++++
                //use this if condition to add left and right movement with left click
                //when doing so comment out the "camera.setView(...)" from above
                /*
                            if (startMousePosition.x > mousePosition.x) {
                                camera.moveLeft(-(mousePosition.x - startMousePosition.x) * moveFactor);
                
                                //camera.lookRight(x * lookFactorHorizontal * -((mousePosition.x - startMousePosition.x)/2) );
                                camera.lookRight(x * lookFactorHorizontal);
                
                                camera.setView({
                                    orientation: {
                                        heading: camera.heading,
                                        pitch: camera.pitch,
                                        roll: 0
                                    }
                                });
                
                
                            } else if (startMousePosition.x < mousePosition.x) {
                                camera.moveRight((mousePosition.x - startMousePosition.x) * moveFactor);
                                //camera.lookRight(x * lookFactorHorizontal * ((mousePosition.x - startMousePosition.x)/2));
                                camera.lookRight(x*lookFactorHorizontal);
                
                                camera.setView({
                                    orientation: {
                                        heading: camera.heading,
                                        pitch: camera.pitch,
                                        roll: 0
                                    }
                                });
                
                            }*/
            }
            if (flags.looking) {
                var width = this.viewer.canvas.clientWidth;
                var height = this.viewer.canvas.clientHeight;
                // Coordinate (0.0, 0.0) will be where the mouse was clicked.
                var x = (mousePosition.x - startMousePosition.x) / width;
                var y = -(mousePosition.y - startMousePosition.y) / height;
                var lookFactorHorizontal = 0.2;
                var lookFactorVertical = 0.1;
                this.camera.lookRight(x * lookFactorHorizontal);
                this.camera.lookUp(y * lookFactorVertical);
                this.camera.setView({
                    orientation: {
                        heading: this.camera.heading,
                        pitch: this.camera.pitch,
                        roll: 0
                    }
                });
            }
            // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
            var cameraHeight = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(this.camera.position).height;
            var moveRate = cameraHeight / 100.0;
            if (flags.moveForward) {
                this.camera.moveForward(moveRate);
            }
            if (this.flags.moveBackward) {
                this.camera.moveBackward(moveRate);
            }
            if (this.flags.moveUp) {
                this.camera.moveUp(moveRate);
            }
            if (this.flags.moveDown) {
                this.camera.moveDown(moveRate);
            }
            if (this.flags.moveLeft) {
                this.camera.moveLeft(moveRate);
            }
            if (this.flags.moveRight) {
                this.camera.moveRight(moveRate);
            }
            var currentHeight = this.viewer.scene.globe.getHeight(this.camera.positionCartographic);
            if (height)
                this.camera.position = Cesium.Cartesian3.fromRadians(this.camera.positionCartographic.longitude, this.camera.positionCartographic.latitude, currentHeight + 1.8);
        });
        leftMouseClicked = false;
    };
    CesiumDirective.prototype.helicopterView = function () {
        //	alert("HE");
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        this.viewer.scene.screenSpaceCameraController.enableZoom = true;
        this.viewer.scene.screenSpaceCameraController.enableTilt = true;
        this.viewer.scene.screenSpaceCameraController.enableLook = true;
        //disable event handler. Otherwise it continues to listen to pedestrianview´s handler for some reason.. 
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MIDDLE_UP);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        var newCameraPosition = Cesium.Cartesian3.fromRadians(viewer.camera.positionCartographic.longitude, viewer.camera.positionCartographic.latitude, defaultHeight);
        this.viewer.camera.flyTo({
            destination: newCameraPosition,
            orientation: {
                heading: viewer.camera.heading,
                pitch: defaultPitch,
                roll: 0.0
            }
        });
    };
    CesiumDirective = __decorate([
        core_1.Directive({
            selector: 'app-cesium'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], CesiumDirective);
    return CesiumDirective;
}());
exports.CesiumDirective = CesiumDirective;
//# sourceMappingURL=cesium.directive.js.map