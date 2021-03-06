import {
  Renderer,
  Scene,
  OrthographicCamera,
  Mesh,
  Material,
  PlaneGeometry
} from '../../../../src/index.ts';
import stats from '../stats';

const { guiController } = require('../gui')();

// Renderer
const renderer = new Renderer({
  ratio: window.innerWidth / window.innerHeight,
  prefferedContext: guiController.context
});
renderer.setDevicePixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.canvas);

// Scene
const scene = new Scene();

// Camera
// const camera = new PerspectiveCamera();
const camera = new OrthographicCamera();
camera.position.set(0, 0, 1);
camera.lookAt();

const geometry = new PlaneGeometry(2, 2);
const material = new Material({
  name: 'Plane',
  hookFragmentEnd: 'outgoingColor = vec4(vUv, 1.0, 1.0);'
});

const plane = new Mesh(geometry, material);

scene.add(plane);

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
resize();

window.addEventListener('resize', resize);

function update() {
  requestAnimationFrame(update);

  stats.begin();

  camera.updateMatrixWorld();

  renderer.render(scene, camera);

  stats.end();
}
update();
