import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
const app = document.querySelector<HTMLDivElement>('#app');
import Texture from "../test.jpg";

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
  size:number;
  count:number;
  data:Float32Array;
  positions:Three.DataTexture;
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
    this.size = 64; // number of pixes - data points 
    this.count = this.size * this.size;
    this.data = new Float32Array(4 * this.count);
    
    this.geometry = new Three.PlaneGeometry(1,1);
    this.material = new Three.MeshNormalMaterial();
    this.mesh = new Three.Mesh(this.geometry, this.material);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.positions = new Three.DataTexture();
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
  /**
   * Because we are using planeGeometry. Its not clear on how many verts are here.
   * Its not 50 x 50 its actually 51 x 51.
   * To control the number of verts exactly, using a buffer geometry
   * */ 
   this.geometry = new Three.BufferGeometry();
   const bufferPosition = new Float32Array(this.count * 3);
   const uvs = new Float32Array(this.count * 2);

   for(let iterator = 0; iterator < this.count; iterator++){
        for(let innerIterator = 0;innerIterator < this.count; innerIterator++){
          const index = iterator * this.size + innerIterator;
          bufferPosition[3 * index] = (innerIterator / this.size) - 0.5;
          bufferPosition[3 * index + 1] = ( iterator / this.size) - 0.5;
          bufferPosition[3 * index + 2] = 0;
          uvs[2 * index ] = innerIterator / (this.size -1); 
          uvs[2 * index + 1] = iterator / (this.size -1); 
        }
   }
   this.geometry.setAttribute("position", new Three.BufferAttribute(bufferPosition, 3));
   this.geometry.setAttribute("uv", new Three.BufferAttribute(uvs, 2));
   this.material = new Three.MeshNormalMaterial();

   for(let iterator = 0; iterator < this.count; iterator++){
        for(let innerIterator = 0;innerIterator < this.count; innerIterator++){
          const index = iterator * this.size + innerIterator;
          this.data[4 * index] = Math.random();
          this.data[4 * index + 1] = Math.random();
          this.data[4 * index + 2] = 0
          this.data[4 * index + 3] = 1 
        }
   }
   this.positions = new Three.DataTexture(this.data, this.size, this.size, Three.RGBAFormat, Three.FloatType);
   this.positions.needsUpdate = true;
   this.material = new Three.ShaderMaterial({
    uniforms:{
        time:{value:0},
        uTexture:{value: new Three.TextureLoader().load(Texture)},
        //uTexture:{value:this.positions},
    },
    fragmentShader:fragmentShader,
    vertexShader:vertexShader,
    /* + */ //wireframe:true, // +: wireframe Shows geometric data on the screen, does not work with points
   })

   /*
   * Note: Replace Mesh with Points to create a low level particle system:
   */
   this.mesh = new Three.Points(this.geometry, this.material); 
   //this.mesh = new Three.Mesh(this.geometry, this.material); 
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