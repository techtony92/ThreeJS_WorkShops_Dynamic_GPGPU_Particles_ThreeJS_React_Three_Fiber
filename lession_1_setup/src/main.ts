import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
const app = document.querySelector<HTMLDivElement>('#app');


export default class Sketch{
  container:HTMLElement;
  scene:Three.Scene;
  width:number;
  height:number;
  renderer:Three.WebGLRenderer;
  camera:Three.Camera;
  time:number;
  geometry:Three.BufferGeometry;
  material:Three.Material;
  mesh:Three.Object3D;
  controls:OrbitControls;
  constructor(options:{dom:HTMLDivElement}){

    this.container = options.dom;
    this.scene = new Three.Scene();
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new Three.WebGLRenderer({
      alpha:true,
    });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new Three.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
    this.camera.position.z = 1;
    this.time = 0;
    this.geometry = new Three.PlaneGeometry(1,1);
    this.material = new Three.MeshNormalMaterial();
    this.mesh = new Three.Mesh(this.geometry, this.material);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.addObjects();
    this.render()
  }
  setUpResize(){
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height);
    (this.camera as Three.PerspectiveCamera).aspect = this.width / this.height;
    (this.camera as Three.PerspectiveCamera).updateProjectionMatrix();
  }
  addObjects(){
   this.geometry = new Three.PlaneGeometry(1,1, 50, 50);
   this.material = new Three.MeshNormalMaterial();
   this.material = new Three.ShaderMaterial({
    uniforms:{
        time:{value:0}
    },
    fragmentShader:fragmentShader,
    vertexShader:vertexShader,
    /* + */ wireframe:true, // +: wireframe Shows geometric data on the screen, does not work with points
   })

   /*
   * Note: Replace Mesh with Points to create a low level particle system:
   */
   this.mesh = new Three.Points(this.geometry, this.material); 
   // glPointSize within vertexShader controls the size of the points
   this.scene.add(this.mesh);
  }

  render(){
    this.time += 0.05;
    // this.mesh.rotation.x = this.time / 2000;
    // this.mesh.rotation.y = this.time / 1000;
    (this.material as Three.ShaderMaterial).uniforms.time.value = this.time;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }

}
if(app !== null)
  new Sketch({dom:app})