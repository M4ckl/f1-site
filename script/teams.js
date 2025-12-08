import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const manager = new THREE.LoadingManager();

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const percent = (itemsLoaded / itemsTotal) * 100;

    if (window.F1Loader) {
        window.F1Loader.update(percent);
    }
};

manager.onLoad = function () {
    console.log('Loading complete!');
    if (window.F1Loader) {
        window.F1Loader.update(100);
        setTimeout(() => {
            window.F1Loader.finish();
        }, 500);
    }
    changeTeam(0, true);
};

const TEAMS = [
    {
        id: 'ferrari',
        name: 'SCUDERIA FERRARI',
        base: 'MARANELLO, ITALY',
        color: 0xff3333,
        titles: 16,
        wins: 639,
        currentPoints: 378,
        drivers: [
            { name: 'LECLERC', num: '16', pts: '226', img: 'assets/img_drivers/leclerc.png' },
            { name: 'HAMILTON', num: '44', pts: '152', img: 'assets/img_drivers/hamilton.png' }
        ],
        logo: 'assets/img_icon_team/ferrari.png',
        path: 'assets/models/ferrari_glft/',
        file: 'scene.gltf',
        yOffset: 0,
        camOffset: { x: 10, y: 1, z: 4 }
    },
    {
        id: 'mclaren',
        name: 'MCLAREN F1 TEAM',
        base: 'WOKING, UK',
        color: 0xff9b00,
        titles: 10,
        wins: 443,
        currentPoints: 756,
        drivers: [
            { name: 'NORRIS', num: '4', pts: '390', img: 'assets/img_drivers/norris.png' },
            { name: 'PIASTRI', num: '81', pts: '366', img: 'assets/img_drivers/piastri.png' }
        ],
        logo: 'assets/img_icon_team/mclaren.png',
        path: 'assets/models/mclaren_glft/',
        file: 'scene.gltf',
        yOffset: 0.5,
        camOffset: { x: -9, y: -1, z: -4 }
    },
    {
        id: 'redbull',
        name: 'RED BULL RACING',
        base: 'MILTON KEYNES, UK',
        color: 0x3671c6,
        titles: 6,
        wins: 231,
        currentPoints: 391,
        drivers: [
            { name: 'VERSTAPPEN', num: '1', pts: '366', img: 'assets/img_drivers/max.png' },
            { name: 'TSUNODA', num: '22', pts: '28', img: 'assets/img_drivers/tsunoda.png' }
        ],
        logo: 'assets/img_icon_team/redbull.png',
        path: 'assets/models/red_bull_glft/',
        file: 'scene.gltf',
        yOffset: 0,
        camOffset: { x: 8, y: 1, z: 3 }
    },
    {
        id: 'mercedes',
        name: 'MERCEDES-AMG',
        base: 'BRACKLEY, UK',
        color: 0x03bfb5,
        titles: 8,
        wins: 201,
        currentPoints: 431,
        drivers: [
            { name: 'ANTONNELLI', num: '12', pts: '137', img: 'assets/img_drivers/antonneli.png' },
            { name: 'RUSSELL', num: '63', pts: '294', img: 'assets/img_drivers/russell.png' }
        ],
        logo: 'assets/img_icon_team/mercedes.png',
        path: 'assets/models/mercedes_glft/',
        file: 'scene.gltf',
        yOffset: 0,
        camOffset: { x: -10, y: -1, z: -4 }
    }
];

const SCENE_RADIUS = 45;
let currentTeamIndex = 0;

const START_POS = new THREE.Vector3(0, 40, 80);
const START_TARGET = new THREE.Vector3(0, 0, 0);

const targetCameraPos = new THREE.Vector3().copy(START_POS);
const targetControlsTarget = new THREE.Vector3().copy(START_TARGET);
const currentBackgroundColor = new THREE.Color(0x111111);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.FogExp2(0x111111, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.copy(START_POS);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 400;
controls.target.copy(START_TARGET);
controls.autoRotate = false;
controls.enableRotate = false;
controls.enablePan = false;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2 - 0.1;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
    metalness: 0.2
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotateX(-Math.PI / 2);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const loader = new GLTFLoader(manager);

const teamCameraPositions = [];
const teamTargets = [];

TEAMS.forEach((teamConfig, index) => {
    const teamGroup = new THREE.Group();
    const angle = (index / TEAMS.length) * Math.PI * 2;
    const groupX = Math.cos(angle) * SCENE_RADIUS;
    const groupZ = Math.sin(angle) * SCENE_RADIUS;

    teamGroup.position.set(groupX, 0, groupZ);
    teamGroup.lookAt(0, 0, 0);
    teamGroup.rotateY(Math.PI);

    scene.add(teamGroup);

    const spotLight = new THREE.SpotLight(0xffffff, 2000);
    spotLight.position.set(0, 30, 0);
    spotLight.angle = 0.8;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    teamGroup.add(spotLight);

    const fullPath = teamConfig.path + teamConfig.file;

    loader.load(fullPath, (gltf) => {
        const car1 = gltf.scene;
        car1.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.5;
                }
            }
        });
        car1.position.set(0, teamConfig.yOffset, 0);
        teamGroup.add(car1);

        const car2 = car1.clone();
        car2.position.set(3.5, teamConfig.yOffset, 1.5);
        car2.rotation.y = -Math.PI / 5;
        teamGroup.add(car2);
    }, undefined, (err) => console.warn(err));

    const groupPos = new THREE.Vector3(groupX, 0, groupZ);

    const offsetX = teamConfig.camOffset ? teamConfig.camOffset.x : 0;
    const offsetY = teamConfig.camOffset ? teamConfig.camOffset.y : 3.5;
    const offsetZ = teamConfig.camOffset ? teamConfig.camOffset.z : 8;

    const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ);
    offsetVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);

    const finalCamPos = groupPos.clone().add(offsetVector);

    teamCameraPositions.push(finalCamPos);
    teamTargets.push(new THREE.Vector3(groupX, 1, groupZ));
});

function changeTeam(index, firstLoad = false) {
    resetRotation();

    const team = TEAMS[index];

    const cards = document.querySelectorAll('.info-card-3d');
    if (!firstLoad) {
        cards.forEach(card => card.classList.add('hidden-state'));
    }

    targetCameraPos.copy(teamCameraPositions[index]);
    targetControlsTarget.copy(teamTargets[index]);

    setTimeout(() => {
        const elName = document.getElementById('team-name');
        if (elName) {

            const hexColor = '#' + team.color.toString(16).padStart(6, '0');

            document.getElementById('ui-layer').style.setProperty('--team-color', hexColor);

            elName.innerText = team.name;
            document.getElementById('team-base').innerText = team.base;

            const elLogo = document.getElementById('team-logo');
            if (elLogo && team.logo) elLogo.src = team.logo;

            document.getElementById('stat-titles').innerText = team.titles;
            document.getElementById('stat-wins').innerText = team.wins;
            document.getElementById('stat-points').innerText = team.currentPoints;

            const bar = document.getElementById('team-points-bar');
            if (bar) {
                bar.style.backgroundColor = hexColor;
                bar.style.width = (team.currentPoints / 600 * 100) + '%';
            }

            if (team.drivers && team.drivers.length >= 2) {
                document.getElementById('d1-name').innerText = team.drivers[0].name;
                document.getElementById('d1-num').innerText = team.drivers[0].num;
                document.getElementById('d1-pts').innerText = team.drivers[0].pts + " PTS";
                if (team.drivers[0].img) document.getElementById('d1-img').src = team.drivers[0].img;

                document.getElementById('d2-name').innerText = team.drivers[1].name;
                document.getElementById('d2-num').innerText = team.drivers[1].num;
                document.getElementById('d2-pts').innerText = team.drivers[1].pts + " PTS";
                if (team.drivers[1].img) document.getElementById('d2-img').src = team.drivers[1].img;
            }

            const oldStyle = document.getElementById('dynamic-team-style');
            if (oldStyle) oldStyle.remove();

            const styleSheet = document.createElement("style");
            styleSheet.id = 'dynamic-team-style';
            styleSheet.innerText = `.info-card-3d::before { background: ${hexColor}; }`;
            document.head.appendChild(styleSheet);
        }

        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.remove('hidden-state');
            }, i * 80);
        });

    }, firstLoad ? 0 : 600);
}

const arrowRight = document.getElementById('arrow-right');
if (arrowRight) {
    arrowRight.addEventListener('click', () => {
        currentTeamIndex = (currentTeamIndex > 0) ? currentTeamIndex - 1 : TEAMS.length - 1;
        changeTeam(currentTeamIndex);
    });
}

const arrowLeft = document.getElementById('arrow-left');
if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
        currentTeamIndex = (currentTeamIndex < TEAMS.length - 1) ? currentTeamIndex + 1 : 0;
        changeTeam(currentTeamIndex);
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const rotationSlider = document.getElementById('rotation-slider');
const uiPanel = document.getElementById('team-info-panel');

let manualRotationAngle = 0;
let isUserRotating = false;

if (rotationSlider) {
    rotationSlider.addEventListener('input', (e) => {
        manualRotationAngle = (e.target.value * Math.PI) / 180;
    });

    const startRotating = () => {
        isUserRotating = true;
        if (uiPanel) uiPanel.classList.add('ui-hidden');
    };

    rotationSlider.addEventListener('mousedown', startRotating);
    rotationSlider.addEventListener('touchstart', startRotating);
    const stopRotating = () => {
        isUserRotating = false;
        if (uiPanel) uiPanel.classList.remove('ui-hidden');
    };

    rotationSlider.addEventListener('mouseup', stopRotating);
    rotationSlider.addEventListener('touchend', stopRotating);
}

function resetRotation() {
    manualRotationAngle = 0;
    isUserRotating = false;
    if (rotationSlider) rotationSlider.value = 0;
    if (uiPanel) uiPanel.classList.remove('ui-hidden');
}

function animate() {
    requestAnimationFrame(animate);

    if (!isUserRotating && Math.abs(manualRotationAngle) > 0.001) {

        manualRotationAngle = THREE.MathUtils.lerp(manualRotationAngle, 0, 0.1);

        if (rotationSlider) {
            rotationSlider.value = (manualRotationAngle * 180) / Math.PI;
        }
    } else if (!isUserRotating && Math.abs(manualRotationAngle) <= 0.001) {
        manualRotationAngle = 0;
        if (rotationSlider) rotationSlider.value = 0;
    }
    const tempCameraPos = targetCameraPos.clone();

    if (manualRotationAngle !== 0) {
        const offset = tempCameraPos.clone().sub(targetControlsTarget);

        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), manualRotationAngle);

        tempCameraPos.copy(targetControlsTarget).add(offset);
    }

    camera.position.lerp(tempCameraPos, 0.05);
    controls.target.lerp(targetControlsTarget, 0.05);

    const targetColorObj = new THREE.Color(TEAMS[currentTeamIndex].color);
    currentBackgroundColor.lerp(targetColorObj, 0.02);
    const darkColor = currentBackgroundColor.clone().multiplyScalar(0.2);

    scene.background.copy(darkColor);
    scene.fog.color.copy(darkColor);

    controls.update();
    renderer.render(scene, camera);
}

animate();