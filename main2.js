import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene,
  renderer,
  mixer,
  totalAnimationDuration,
  sceneCamera,
  actions = [],
  allAnimationsFinished = false,
  initialFOV = 35,
  finalFOV = 30,
  messageAdded = false;

// Set up the scene, camera, and renderer
scene = new THREE.Scene();

// Set up renderer
renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setClearColor(0xffffff); // Set background color to white
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#hero").appendChild(renderer.domElement);

// Load GLB file using GLTFLoader
const loader = new GLTFLoader();
loader.load("/packagev_finalv8.glb", (gltf) => {
  scene.add(gltf.scene);
  sceneCamera = gltf.scene.getObjectByName("Camera001");

  // Create AnimationMixer and save the duration of the animation
  mixer = new THREE.AnimationMixer(gltf.scene);

  gltf.animations.forEach((animation) => {
    const action = mixer.clipAction(animation);
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce; // Make the animation stop at the end
    actions.push(action);
    action.play();
  });

  // Check when all animations are finished
  mixer.addEventListener("finished", () => {
    allAnimationsFinished = true;
    displayThankYouMessage();
  });

  // Add lights
  const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight("#ffffff", 0.4);
  sunLight.position.set(-2.5, 7, 3);
  scene.add(sunLight);

  // Make all objects receive shadow and set anisotropy
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.map) {
        child.material.map.anisotropy = maxAnisotropy;
      }
    }
  });

  // Set initial camera position and orientation
  sceneCamera.position.set(0, 0, 10); // Adjust position as needed
  sceneCamera.lookAt(0, 0, 0); // Look at the center of the scene
  sceneCamera.fov = initialFOV; // Set initial FOV
  sceneCamera.updateProjectionMatrix();

  // Render the scene
  render();
});

// Render the scene
function render() {
  requestAnimationFrame(render);
  if (mixer) {
    mixer.update(0.02); // Increase speed by updating with a larger delta time
    if (!allAnimationsFinished) {
      // Interpolate FOV
      const progress = mixer.time / mixer._actions[0]._clip.duration;
      const interpolatedFOV = initialFOV + (finalFOV - initialFOV) * progress;
      sceneCamera.fov = interpolatedFOV;
      sceneCamera.updateProjectionMatrix();
    }
  }
  renderer.render(scene, sceneCamera);
}

// Function to display the "Thank you" message
function displayThankYouMessage() {
  if (allAnimationsFinished && !messageAdded) {
    const container = document.createElement("div");
    container.classList.add("message-container");

    const thankYouMessage = document.createElement("h1");
    thankYouMessage.textContent = "Bedankt!";
    thankYouMessage.classList.add("thank-you-message"); // Add the class
    container.appendChild(thankYouMessage);

    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = "Wij versturen je pakket zo snel mogelijk."; // Add your message here
    container.appendChild(messageParagraph);

    document.body.appendChild(container);

    // Set opacity to 1 to trigger fade in
    container.offsetHeight; // eslint-disable-line no-unused-expressions
    container.style.opacity = 1;

    messageAdded = true;
  }
}

// Resize handling
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  sceneCamera.aspect = width / height;
  sceneCamera.updateProjectionMatrix();
});
