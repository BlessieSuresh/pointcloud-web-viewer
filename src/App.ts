import * as THREE from 'three';
// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// @ts-ignore
//import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";


export class App {

    private readonly canvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
    private readonly renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
    private readonly scene = new THREE.Scene();
    private readonly camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
    private readonly controls = new OrbitControls(this.camera, this.renderer.domElement);

    private brick: THREE.Mesh;

    constructor() {
        this.camera.position.set(0, 200, 200);
        this.camera.lookAt(0,0,0);
        this.scene.add(this.camera);

        this.brick = new THREE.Mesh(new THREE.BoxGeometry(20,20,20));
        this.brick.material = new THREE.MeshNormalMaterial();
        this.scene.add(this.brick);

        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color("rgb(22,22,22)"));

        //DRACOLoader.setDecoderPath('libs/draco/');
        //let loader = new DRACOLoader();

        this.render();
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.controls.update();
            this.render()
        });
        this.adjustCanvasSize();

        this.brick.rotateY(0.01);
    }
}
