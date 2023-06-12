import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

/* const gui = new GUI();
 */
let scene, renderer, mixer, totalAnimationDuration, controls, targetObject, targetObject1, targetObject2, targetObject3;
let actions = [];
let childObject = null; // Declare a variable to store the "hout24" child object
let initialColor = 0x000000;
let sphereInitialColor = 0xffffff;
let sunLight, ambientLight;
let sphereObject = null;
let sphere1Object = null;
let sphere2Object = null;
let sphere3Object = null;
let sphere4Object = null;
let sphere5Object = null;
let sphere6Object = null;
let sphere7Object = null;
let sphere8Object = null;
let sphere9Object = null;
let sphere10Object = null;
let cylinderObject = null;
let cylinderInitialColor = 0x000000;
let sphere1InitialColor = 0x000000;
var objectGroup = new THREE.Group();
const clock = new THREE.Clock();
const imageElement1 = document.getElementById('image1');
const imageElement2 = document.getElementById('image2');
const imageElement3= document.getElementById('image3');



// Set up the scene, camera, and renderer
scene = new THREE.Scene();

// Load GLB file using GLTFLoader
const loader = new GLTFLoader();
let sceneCamera = null;
loader.load("/camera-path7.glb", (gltf) => {
  /*   objectGroup.add(gltf.scene);
   */ scene.add(gltf.scene);
  sceneCamera = gltf.scene.getObjectByName("test");
  sceneCamera.fov = 30;
console.log(scene);


  /*   controls = new OrbitControls(sceneCamera, renderer.domElement);
   */
  // Create AnimationMixer and save the duration of the animation
  mixer = new THREE.AnimationMixer(gltf.scene);

  gltf.animations.forEach((animation) => {
    const action = mixer.clipAction(animation);
    action.clampWhenFinished = true;
    actions.push(action);
    action.play();
  });




  // Add directional light with shadow casting
  sunLight = new THREE.DirectionalLight("#ffffff", 0.5);
  sunLight.castShadow = true;
  sunLight.shadow.camera.far = 20;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.normalBias = 0.05;
  sunLight.position.set(5.5, 7, 3);
  scene.add(sunLight);
/*   let sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 5);
  scene.add(sunLightHelper);
  const cameraHelper = new THREE.CameraHelper(sunLight.shadow.camera);
  scene.add(cameraHelper); */

/*   gui.add(sunLight.position, "x", -10, 10, 0.01);
  gui.add(sunLight.position, "y", -10, 10, 0.01);
  gui.add(sunLight.position, "z", -10, 10, 0.01); */

  function updateCamera() {
    sunLight.target.updateMatrixWorld();
    sunLightHelper.update();
    sunLight.shadow.camera.updateProjectionMatrix();
    cameraHelper.update();
  }

/*   gui
    .add(sunLight.shadow.camera, "right", -10, 10, 0.01)
    .onChange(updateCamera);
  gui.add(sunLight.shadow.camera, "left", -10, 10, 0.01).onChange(updateCamera); */

  // Add ambient light
  ambientLight = new THREE.AmbientLight("#ffffff", 1);
  scene.add(ambientLight);



  sphereObject = gltf.scene.getObjectByName("Sphere");
  sphereInitialColor = sphereObject.material.color.clone();
  sphere1Object = gltf.scene.getObjectByName("Sphere004");
  sphere2Object = gltf.scene.getObjectByName("Sphere005");
  sphere3Object = gltf.scene.getObjectByName("Sphere006");
  sphere4Object = gltf.scene.getObjectByName("Sphere007");
  sphere5Object = gltf.scene.getObjectByName("Sphere008");
  sphere6Object = gltf.scene.getObjectByName("Sphere009");
  sphere7Object = gltf.scene.getObjectByName("Sphere010");
  sphere8Object = gltf.scene.getObjectByName("Sphere011");
  sphere9Object = gltf.scene.getObjectByName("Sphere012");
  sphere10Object = gltf.scene.getObjectByName("Sphere013");

  cylinderObject = gltf.scene.getObjectByName("Cylinder");
  cylinderInitialColor = cylinderObject.material.color.clone();

  // Set material color for child object with name "hout24"
  // Set material color for child object with name "hout24"
  childObject = gltf.scene.getObjectByName("hout24");
  initialColor = childObject.material.color.clone(); // Store the initial color



  // Make all objects receive shadow
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });


  targetObject = scene.getObjectByName('Asset_53_Asset_53001');
  targetObject1 = scene.getObjectByName('ringbeneden');
  targetObject2 = scene.getObjectByName('ringboven');
  const group = new THREE.Group();

  for (let i = 1; i <= 24; i++) {
    const meshName = `hout${i}`;
    const mesh = scene.getObjectByName(meshName);
    
    if (mesh) {
      group.add(mesh);
    } else {
      console.warn(`Mesh ${meshName} not found in the GLB file.`);
    }
  }

  group.add(targetObject1);
  group.add(targetObject2);
  console.log(group.children);

  scene.add(group);

  targetObject3 = scene.getObjectByName('Asset_157');


  if (targetObject) {
    // Hide the object initially
    targetObject.visible = false;
  }

  if (targetObject3) {
    // Hide the object initially
    targetObject3.visible = false;
  }

  
  imageElement1.addEventListener('click', toggleObjectVisibility1, true);
  imageElement2.addEventListener('click', toggleObjectVisibility2, true);
  imageElement3.addEventListener('click', toggleObjectVisibility3, true);
  
  let lastClickedElement = null; // Variable to store the last clicked element
  
  function toggleObjectVisibility1() {
      if (lastClickedElement === imageElement1 && group.visible) {
          return; // Skip toggling if the same element is clicked and it's already visible
      }
  
      group.visible = !group.visible;
      targetObject.visible = false;
      targetObject3.visible = false;
  
      lastClickedElement = imageElement1; // Update the last clicked element
  }
  
  function toggleObjectVisibility2() {
      if (lastClickedElement === imageElement2 && targetObject.visible) {
          return; // Skip toggling if the same element is clicked and it's already visible
      }
  
      if (targetObject) {
          targetObject.visible = !targetObject.visible;
          group.visible = false;
          targetObject3.visible = false;


        }
  
      lastClickedElement = imageElement2; // Update the last clicked element
  }
  
  function toggleObjectVisibility3() {
      if (lastClickedElement === imageElement3 && targetObject3.visible) {
          return; // Skip toggling if the same element is clicked and it's already visible
      }
  
      if (targetObject3) {
          targetObject3.visible = !targetObject3.visible;
          group.visible = false;
          targetObject.visible = false;
      }
  
      lastClickedElement = imageElement3; // Update the last clicked element
  }
  

  totalAnimationDuration = 5;
  updateAnimationAndColor();

  onResize();
  render();
});

// Update the animation and material color based on scrollbar position and time
function updateAnimationAndColor() {
  if (!mixer || !childObject) return;

  const scrollPosition = window.scrollY || window.pageYOffset;
  const scrollPercentage =
    scrollPosition / (document.body.scrollHeight - window.innerHeight);
  const animationTime = scrollPercentage * totalAnimationDuration;

  actions.forEach((action) => {
    action.time = Math.min(animationTime, action.getClip().duration);
  });

  mixer.update(0);

  if (initialColor) {
    const currentColor = initialColor.clone();
    // Calculate the new color based on the scroll position or time
    // Example: linear interpolation between initial color and target color
    if (scrollPosition >= 1700) {
      const targetColor = new THREE.Color(0x88c5dc);
      const t = Math.min((scrollPosition - 1700) / 1000, 1); // Ensure t is between 0 and 1
      currentColor.lerp(targetColor, t);
    }
    childObject.material.color.copy(currentColor);
  }

  const sphereColor = sphereInitialColor.clone();
  if (scrollPosition >= 1700) {
    const targetColor = new THREE.Color(0xB8ABD4);
    const t = Math.min((scrollPosition - 1700) / 1000, 1);
    sphereColor.lerp(targetColor, t);
  }
  sphereObject.material.color.copy(sphereColor);
  

  const cylinderColor = cylinderInitialColor.clone();
  if (scrollPosition >= 2700) {
    const targetColor = new THREE.Color(0xB8ABD4);
    const t = Math.min((scrollPosition - 2700) / 1000, 1);
    cylinderColor.lerp(targetColor, t);
  }
  cylinderObject.material.color.copy(cylinderColor);

  // Update the background color
  const backgroundColor = new THREE.Color(0xffffff);
  if (scrollPosition >= 1700) {
    const targetColor = new THREE.Color(0xFAF4EB);
    const t = Math.min((scrollPosition - 1700) / 1000, 1);
    backgroundColor.lerp(targetColor, t);
  }
  renderer.setClearColor(backgroundColor);

  //update sunlight position x
/*   if (scrollPosition >= 1000) {
    sunLight.position.x = 1.5;
  }
  console.log(sunLight.position.x); */

}

// Call the updateAnimationAndColor function on scroll event
window.addEventListener("scroll", updateAnimationAndColor);

//anti-aliasing
renderer = new THREE.WebGLRenderer({
  antialias: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  shadowMap: THREE.PCFSoftShadowMap,
});
renderer.setPixelRatio(window.devicePixelRatio);
// Better colors
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0xffffff); // Set the background color to black
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#hero").appendChild(renderer.domElement);

// Render the scene
function render() {
  if (!sceneCamera) return;
  requestAnimationFrame(render);
  renderer.render(scene, sceneCamera);
}

const onResize = () => {
  sceneCamera.aspect = window.innerWidth / window.innerHeight;
  sceneCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onResize);

render();

const onMouseMove = (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  sphere1Object.position.x = mouseX * 0.0002 + 14.100000381469727;
  sphere1Object.rotation.y = mouseX * 0.0002;
  sphere2Object.position.x = mouseX * 0.0002 + 14.100000381469727;
  sphere2Object.rotation.y = mouseX * 0.0002;
  sphere3Object.position.x = mouseX * 0.0002 + -11.899999618530273;
  sphere3Object.rotation.y = mouseX * 0.0002;
  sphere4Object.position.x = mouseX * 0.0002 + -11.899999618530273;
  sphere4Object.rotation.y = mouseX * 0.0002;
  sphere5Object.position.x = mouseX * 0.0002 + -4.900000095367432;
  sphere5Object.rotation.y = mouseX * 0.0002;
  sphere6Object.position.x = mouseX * 0.0002 + -4.900000095367432;
  sphere6Object.rotation.y = mouseX * 0.0002;
  sphere7Object.position.x = mouseX * 0.0002 + -15.899999618530273;
  sphere7Object.rotation.y = mouseX * 0.0002;
  sphere8Object.position.x = mouseX * 0.0002 + -15.899999618530273;
  sphere8Object.rotation.y = mouseX * 0.0002;
  sphere9Object.position.x = mouseX * 0.0002 + 10.100000381469727;
  sphere9Object.rotation.y = mouseX * 0.0002;
  sphere10Object.position.x = mouseX * 0.0002 + 10.100000381469727;
  sphere10Object.rotation.y = mouseX * 0.0002;
};

window.addEventListener("mousemove", onMouseMove);

// Update the animation based on scrollbar position
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY || window.pageYOffset;
  const scrollPercentage =
    scrollPosition / (document.body.scrollHeight - window.innerHeight);
  const animationTime = scrollPercentage * totalAnimationDuration;

  actions.forEach((action) => {
    // Make sure the animation time doesn't exceed the clip duration
    action.time = Math.min(animationTime, action.getClip().duration);
  });
});
