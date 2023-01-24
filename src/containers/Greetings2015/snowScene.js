import * as THREE from "three";

// scale for distances: 1 ft = 28.57, 1 inch = 2.381
const Constants = {
  width: 960, // pixels
  height: 640, // pixels
  viewAngle: 25,
  near: 10,
  far: 500,
  wallWidth: 340,
  topOfWreath: 175,
  totalFlakes: 20000,
  cameraToBackWall: 500,
  backWallToWhereFloorIsVisible: 350,
  cameraHeight: 85.71,
  daddyFaceHeight: 66,
  daddyFaceToBackWall: 109,
  framesPerSecond: 60,
  secondsToTransitionSnowSpeed: 2,
  secondsOfSnowBeforeConfused: 2.5,
  secondsFromConfusedToShivering: 4,
  secondsFromShiveringToWinterGear: 4,
  secondsFromWinterGearToUmbrella: 3,
  secondsBeforeUmbrellaDisappears: 10,
  secondsOfSnowDumpAnticipation: 1.5,
  initialSnowflakesPerSecond: 0,
  defaultSnowflakesPerSecond: 400,
  heavySnowflakesPerSecond: 1000,
  helpFigureOutWhereThingsAre: false,
  backgroundImageCount: 8,
};

const Backgrounds = {
  none: -1,
  indoorGearSmiling: 0,
  indoorGearConfused: 1,
  indoorGearShivering: 2,
  indoorGearShiveringWithUmbrella: 3,
  winterGearSmiling: 4,
  winterGearWithUmbrella: 5,
  winterGearAnticipatingSnowDump: 6,
  winterGearSillyFaces: 7,
};

const UpdateModes = {
  automatic: 0,
  manual: 1,
};

const SnowflakeLifestages = {
  notYetInView: 0,
  falling: 1,
  landed: 2,
  fallenOutOfView: 3,
  fallingFast: 4, // for when the snow is packed (like on the umbrella)
};

class Snowflake {
  constructor() {
    const minX = 0;
    const maxX = Constants.wallWidth - 2;
    const startingY = Constants.topOfWreath;
    const minZ = 0;
    const maxZ = Constants.cameraToBackWall - 2;

    this.state = {
      modelPosition: new THREE.Vector3(
        Math.random() * (maxX - minX) + minX,
        startingY,
        Math.random() * (maxZ - minZ) + minZ
      ),
      lifestage: SnowflakeLifestages.notYetInView,
    };
  }
}

export default class SnowScene {
  constructor() {
    // To prevent cross-domain image errors: http://stackoverflow.com/questions/24087757/three-js-and-loading-a-cross-domain-image
    THREE.ImageUtils.crossOrigin = "";

    this.waitingForBackgroundImage = true;
    this.waitingForSnowflakeTexture = true;
    this.rendered = false;

    this.canvasElement = document.getElementById("ThreeJS");
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();

    this.addHelperSceneAndObjects(Constants.helpFigureOutWhereThingsAre);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(Constants.width, Constants.height);

    this.setBackgroundImages();

    this.state = {};
    this.updateState(this.state, { type: "PLAY_FROM_BEGINNING" });
  }

  setBackgroundImages = () => {
    this.backgroundMeshes = [];
    this.backgroundImageLoadingIndex = 0;
    const self = this;

    const loadNextBackgroundImage = () => {
      let backgroundImage;
      switch (self.backgroundImageLoadingIndex) {
        case Backgrounds.indoorGearSmiling:
          backgroundImage = require("../../images/smiling1.jpg");
          break;
        case Backgrounds.indoorGearConfused:
          backgroundImage = require("../../images/confused1.jpg");
          break;
        case Backgrounds.indoorGearShivering:
          backgroundImage = require("../../images/shivering1.jpg");
          break;
        case Backgrounds.indoorGearShiveringWithUmbrella:
          backgroundImage = require("../../images/shiveringumbrella1.jpg");
          break;
        case Backgrounds.winterGearSmiling:
          backgroundImage = require("../../images/wintergearsmiling.jpg");
          break;
        case Backgrounds.winterGearWithUmbrella:
          backgroundImage = require("../../images/winterwearsmiling.jpg");
          break;
        case Backgrounds.winterGearAnticipatingSnowDump:
          backgroundImage = require("../../images/snowdump.jpg");
          break;
        default: // Backgrounds.winterGearSillyFaces:
          backgroundImage = require("../../images/winterwearsillyfaces.jpg");
          break;
      }

      const backgroundImageLoaded = (texture) => {
        const backgroundMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2, 2, 2),
          new THREE.MeshBasicMaterial({
            map: texture,
          })
        );

        backgroundMesh.material.depthTest = false;
        backgroundMesh.material.depthWrite = false;

        self.backgroundMeshes.push(backgroundMesh);

        self.backgroundImageLoadingIndex++;

        if (self.backgroundImageLoadingIndex < Constants.backgroundImageCount) {
          loadNextBackgroundImage();
        } else {
          self.waitingForBackgroundImage = false;
          self.updateState(self.state, { type: "BACKGROUND_READY" });
        }
      };

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "";
      loader.load(
        backgroundImage,
        backgroundImageLoaded,
        null,
        self.errorLoadingTexture
      );
    };

    loadNextBackgroundImage();
  };

  setBackground = (state, newBackground) => {
    if (this.backgroundMeshes && this.backgroundMeshes.length > newBackground) {
      state.background = newBackground;

      // Create the background scene
      this.backgroundScene = new THREE.Scene();
      this.backgroundCamera = new THREE.Camera();
      this.backgroundScene.add(this.backgroundCamera);
      this.backgroundScene.add(this.backgroundMeshes[newBackground]);

      state.frameNumberOfLastBackgroundChange = state.frameNumber;
    }
  };

  initializeSnowflakeData = () => {
    if (this.flakes) {
      this.scene.remove(this.flakes);
    }

    const snowflakeImage = require("../../images/snowflake.png");
    this.waitingForSnowflakeTexture = true;
    const loader = new THREE.TextureLoader();
    // loader.crossOrigin = '';
    loader.load(
      snowflakeImage,
      this.snowflakeTextureLoaded,
      null,
      this.errorLoadingTexture
    );
  };

  errorLoadingTexture = (xhr) => {
    console.log(`An error happened loading texture ${xhr}`);
  };

  snowflakeTextureLoaded = (texture) => {
    // this.snowflaketexture.minFilter = THREE.LinearFilter;
    // this.snowflaketexture.needsUpdate = true;

    this.snowflaketexture = texture;
    this.flakesGeometry = new THREE.BufferGeometry();

    this.vertices = new Float32Array(Constants.totalFlakes * 3); // three components per vertex
    this.actualYInCaseInvisible = new Float32Array(Constants.totalFlakes);
    this.snowflakes = [];
    // components of the position vector for each vertex are stored
    // contiguously in the buffer.
    for (let index = 0; index < Constants.totalFlakes; index++) {
      const snowflake = new Snowflake();
      this.snowflakes.push(snowflake);
      this.vertices[index * 3 + 0] = snowflake.state.modelPosition.x;
      this.vertices[index * 3 + 1] = snowflake.state.modelPosition.y;
      this.vertices[index * 3 + 2] = snowflake.state.modelPosition.z;
      this.actualYInCaseInvisible[index] = snowflake.state.modelPosition.y;
    }

    // itemSize = 3 because there are 3 values (components) per vertex
    this.flakesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.vertices, 3)
    );
    this.flakesGeometry.setAttribute(
      "actualYInCaseInvisible",
      new THREE.BufferAttribute(this.actualYInCaseInvisible, 1)
    );
    this.flakeMaterial = new THREE.PointsMaterial({
      map: this.snowflaketexture,
      transparent: true,
      size: 5,
    });
    this.flakes = new THREE.Points(this.flakesGeometry, this.flakeMaterial);

    this.scene.add(this.flakes);
    this.waitingForSnowflakeTexture = false;
    this.updateState(this.state, { type: "SNOWFLAKE_GEOMETRY_READY" });
  };

  createCamera = () => {
    const camera = new THREE.PerspectiveCamera(
      Constants.viewAngle,
      Constants.width / Constants.height,
      Constants.near,
      Constants.far
    );

    // position 0,0,0 is lower left corner of picture (the floor below the middle of the tv).
    camera.position.set(
      Constants.wallWidth / 2,
      Constants.cameraHeight,
      Constants.cameraToBackWall
    );
    camera.lookAt(
      new THREE.Vector3(
        Constants.wallWidth / 2,
        Constants.daddyFaceHeight,
        Constants.daddyFaceToBackWall
      )
    );
    return camera;
  };

  createFloor = () => {
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0x777777,
      side: THREE.DoubleSide,
    });
    floorMaterial.transparent = true;
    floorMaterial.opacity = 0.5;
    const floorGeometry = new THREE.PlaneGeometry(
      Constants.wallWidth,
      Constants.backWallToWhereFloorIsVisible
    );
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.x = Constants.wallWidth / 2;
    floor.position.y = -2;
    floor.position.z = 23.8;
    return floor;
  };

  createUmbrella = () => {
    const umbrellaMaterial = new THREE.MeshBasicMaterial({
      color: 0x777777,
      side: THREE.DoubleSide,
    });
    umbrellaMaterial.transparent = true;
    umbrellaMaterial.opacity = 0.5;
    const umbrellaGeometry = new THREE.SphereGeometry(
      85,
      8,
      6,
      0,
      6.283,
      0,
      0.8
    );
    const umbrella = new THREE.Mesh(umbrellaGeometry, umbrellaMaterial);
    umbrella.position.x = Constants.wallWidth / 2 + 9;
    umbrella.position.y = 37;
    umbrella.position.z = 80;

    // Need to call updateMatrixWorld so Raycaster gets umbrella positions right.
    umbrella.updateMatrixWorld();
    return umbrella;
  };

  addUmbrella = (showOnActualScene) => {
    this.helperScene.add(this.helperUmbrella);
    if (showOnActualScene) {
      this.scene.add(this.umbrella);
    }

    this.recalculateSnowflakeLandingSpots();
  };

  removeUmbrella = (removedFromActualScene) => {
    this.helperScene.remove(this.helperUmbrella);
    if (removedFromActualScene) {
      this.scene.remove(this.umbrella);
    }

    // Reset snowflake landing spots to 0 for snowflakes high enough to be on umbrella
    for (
      let xCoordinate = 0;
      xCoordinate < Constants.wallWidth;
      xCoordinate++
    ) {
      for (
        let zCoordinate = 0;
        zCoordinate < Constants.backWallToWhereFloorIsVisible;
        zCoordinate++
      ) {
        const index =
          xCoordinate * Constants.backWallToWhereFloorIsVisible + zCoordinate;
        if (
          this.snowflakeLandingSpots[index] >
          Constants.daddyFaceHeight + 10
        ) {
          this.snowflakeLandingSpots[index] = 0;
        }
      }
    }
    this.recalculateSnowflakeLandingSpots();
  };

  recalculateSnowflakeLandingSpots = () => {
    // for every x and z in view identify the highest y (where a snowflake might land)
    for (
      let xCoordinate = 0;
      xCoordinate < Constants.wallWidth;
      xCoordinate++
    ) {
      for (
        let zCoordinate = 0;
        zCoordinate < Constants.backWallToWhereFloorIsVisible;
        zCoordinate++
      ) {
        const index =
          xCoordinate * Constants.backWallToWhereFloorIsVisible + zCoordinate;
        const origin = new THREE.Vector3(
          xCoordinate,
          Constants.topOfWreath,
          zCoordinate
        );
        const direction = new THREE.Vector3(0, -1, 0);
        const raycaster = new THREE.Raycaster(
          origin,
          direction,
          20,
          Constants.topOfWreath
        );

        // calculate objects intersecting the ray
        const intersects = raycaster.intersectObjects(
          this.helperScene.children
        );
        if (intersects.length > 0) {
          // first intersection from above identifies highest y
          this.snowflakeLandingSpots[index] = Math.max(
            this.snowflakeLandingSpots[index],
            Constants.topOfWreath - intersects[0].distance
          );
        } else {
          this.snowflakeLandingSpots[index] = Math.max(
            this.snowflakeLandingSpots[index],
            0
          );
        }
      }
    }
  };

  addHeadAndShoulders = (
    scene,
    radius,
    xPosition,
    yPosition,
    zPosition,
    leftShoulderHeightAdjustment = 0,
    leftShoulderRotationAdjustment = 0,
    rightShoulderHeightAdjustment = 0,
    rightShoulderRotationAdjustment = 0,
    whichPerson = "mommy"
  ) => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x777777,
      side: THREE.DoubleSide,
    });
    material.transparent = true;
    material.opacity = 0.5;
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const head = new THREE.Mesh(geometry, material);
    // head.rotation.z = Math.PI / 2;
    head.position.x = xPosition;
    head.position.y = yPosition;
    head.position.z = zPosition;
    head.updateMatrixWorld();
    scene.add(head);

    const lengthOfShoulder = radius * 2.2;
    const rightShoulderGeometry = new THREE.CylinderGeometry(
      radius * 0.7,
      radius * 0.7,
      lengthOfShoulder
    );
    const rightShoulder = new THREE.Mesh(rightShoulderGeometry, material);
    rightShoulder.rotation.z =
      Math.PI * (0.3 + rightShoulderRotationAdjustment);
    rightShoulder.position.x = head.position.x + lengthOfShoulder / 2;
    rightShoulder.position.y =
      head.position.y - radius * 2 + rightShoulderHeightAdjustment;
    rightShoulder.position.z = head.position.z;
    rightShoulder.updateMatrixWorld();
    scene.add(rightShoulder);

    const leftShoulderGeometry = new THREE.CylinderGeometry(
      radius * 0.7,
      radius * 0.7,
      lengthOfShoulder
    );
    const leftShoulder = new THREE.Mesh(leftShoulderGeometry, material);
    leftShoulder.rotation.z = Math.PI * (-0.3 + leftShoulderRotationAdjustment);
    leftShoulder.position.x = head.position.x - lengthOfShoulder / 2;
    leftShoulder.position.y =
      head.position.y - radius * 2 + leftShoulderHeightAdjustment;
    leftShoulder.position.z = head.position.z;
    leftShoulder.updateMatrixWorld();
    scene.add(leftShoulder);

    if (whichPerson === "daddy") {
      const daddyLowerLegLength = 31;
      const daddyLowerLegRadius = 6;
      const daddyLowerLegGeometry = new THREE.CylinderGeometry(
        daddyLowerLegRadius,
        daddyLowerLegRadius,
        daddyLowerLegLength
      );
      const daddyLeftLowerLeg = new THREE.Mesh(daddyLowerLegGeometry, material);
      daddyLeftLowerLeg.rotation.x = Math.PI * -0.1;
      daddyLeftLowerLeg.rotation.z = Math.PI * 0.32;
      daddyLeftLowerLeg.position.x = head.position.x - 16;
      daddyLeftLowerLeg.position.y = 18;
      daddyLeftLowerLeg.position.z = head.position.z + 30;
      daddyLeftLowerLeg.updateMatrixWorld();
      scene.add(daddyLeftLowerLeg);

      const daddyRightLowerLeg = new THREE.Mesh(
        daddyLowerLegGeometry,
        material
      );
      daddyRightLowerLeg.rotation.x = Math.PI * -0.1;
      daddyRightLowerLeg.rotation.z = Math.PI * -0.32;
      daddyRightLowerLeg.position.x = head.position.x + 16;
      daddyRightLowerLeg.position.y = 16;
      daddyRightLowerLeg.position.z = head.position.z + 30;
      daddyRightLowerLeg.updateMatrixWorld();
      scene.add(daddyRightLowerLeg);
    }

    if (whichPerson === "mommy") {
      const shoulderToElbowLength = 23;
      const mommyUpperArmRadius = 6;
      const mommyUpperArmGeometry = new THREE.CylinderGeometry(
        mommyUpperArmRadius,
        mommyUpperArmRadius,
        shoulderToElbowLength
      );
      const mommyUpperArm = new THREE.Mesh(mommyUpperArmGeometry, material);
      mommyUpperArm.rotation.x = Math.PI * -0.1;
      mommyUpperArm.rotation.z = Math.PI * -0.15;
      mommyUpperArm.position.x = head.position.x - 20;
      mommyUpperArm.position.y = head.position.y - 18;
      mommyUpperArm.position.z = head.position.z + 15;
      mommyUpperArm.updateMatrixWorld();
      scene.add(mommyUpperArm);

      const mommyForearmLength = 28;
      const mommyForearmRadius = 4;
      const mommyForearmGeometry = new THREE.CylinderGeometry(
        mommyForearmRadius,
        mommyForearmRadius,
        mommyForearmLength
      );
      const mommyForearm = new THREE.Mesh(mommyForearmGeometry, material);
      mommyForearm.rotation.x = Math.PI * -0.1;
      mommyForearm.rotation.z = Math.PI * -0.55;
      mommyForearm.position.x = head.position.x - 15;
      mommyForearm.position.y = head.position.y - 32;
      mommyForearm.position.z = head.position.z + 20;
      mommyForearm.updateMatrixWorld();
      scene.add(mommyForearm);
    }

    if (whichPerson === "lily") {
      const lilyTongueLength = 4;
      const lilyTongueRadius = 2;
      const lilyTongueGeometry = new THREE.CylinderGeometry(
        lilyTongueRadius,
        lilyTongueRadius,
        lilyTongueLength
      );
      const lilyTongue = new THREE.Mesh(lilyTongueGeometry, material);
      lilyTongue.rotation.z = Math.PI * -0.5;
      lilyTongue.position.x = head.position.x - 1;
      lilyTongue.position.y = head.position.y - 5;
      lilyTongue.position.z = head.position.z + radius;
      lilyTongue.updateMatrixWorld();
      scene.add(lilyTongue);
    }

    if (whichPerson === "willow") {
      const tongueMaterial = new THREE.MeshBasicMaterial({
        color: 0x77ff77,
        side: THREE.DoubleSide,
      });
      tongueMaterial.transparent = true;
      tongueMaterial.opacity = 0.5;
      const willowTongueLength = 4;
      const willowTongueRadius = 2;
      const willowTongueGeometry = new THREE.CylinderGeometry(
        willowTongueRadius,
        willowTongueRadius,
        willowTongueLength
      );
      const willowTongue = new THREE.Mesh(willowTongueGeometry, tongueMaterial);
      willowTongue.rotation.z = Math.PI * -0.5;
      willowTongue.position.x = head.position.x + 3;
      willowTongue.position.y = head.position.y - 8;
      willowTongue.position.z = head.position.z + radius;
      willowTongue.updateMatrixWorld();
      scene.add(willowTongue);
    }
  };

  addMiscellaneousObjects = (scene) => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x777777,
      side: THREE.DoubleSide,
    });
    material.transparent = true;
    material.opacity = 0.5;
    const leftReindeerTorsoLength = 31;
    const leftReindeerTorsoRadius = 6;
    const reindeerTorsoGeometry = new THREE.CylinderGeometry(
      leftReindeerTorsoRadius,
      leftReindeerTorsoRadius,
      leftReindeerTorsoLength
    );
    const leftReindeerTorso = new THREE.Mesh(reindeerTorsoGeometry, material);
    leftReindeerTorso.rotation.y = Math.PI * -0.32;
    leftReindeerTorso.rotation.z = Math.PI * -0.5;
    leftReindeerTorso.position.x = 68;
    leftReindeerTorso.position.y = 32;
    leftReindeerTorso.position.z = 30;
    leftReindeerTorso.updateMatrixWorld();
    scene.add(leftReindeerTorso);

    const leftReindeerHeadLength = 14;
    const leftReindeerHeadRadius = 3;
    const reindeerHeadGeometry = new THREE.CylinderGeometry(
      leftReindeerHeadRadius,
      leftReindeerHeadRadius,
      leftReindeerHeadLength
    );
    const leftReindeerHead = new THREE.Mesh(reindeerHeadGeometry, material);
    leftReindeerHead.rotation.y = Math.PI * -0.32;
    leftReindeerHead.rotation.z = Math.PI * -0.57;
    leftReindeerHead.position.x = leftReindeerTorso.position.x + 18;
    leftReindeerHead.position.y = leftReindeerTorso.position.y + 17;
    leftReindeerHead.position.z = leftReindeerTorso.position.z + 23;
    leftReindeerHead.updateMatrixWorld();
    scene.add(leftReindeerHead);

    const rightReindeerTorsoGeometry = new THREE.CylinderGeometry(
      1,
      leftReindeerTorsoRadius,
      leftReindeerTorsoLength - 7
    );
    const rightReindeerTorso = new THREE.Mesh(
      rightReindeerTorsoGeometry,
      material
    );
    rightReindeerTorso.rotation.y = Math.PI * 1.35;
    rightReindeerTorso.rotation.z = Math.PI * -0.59;
    rightReindeerTorso.position.x = 257;
    rightReindeerTorso.position.y = 35;
    rightReindeerTorso.position.z = 30;
    rightReindeerTorso.updateMatrixWorld();
    scene.add(rightReindeerTorso);

    const rightReindeerHead = new THREE.Mesh(reindeerHeadGeometry, material);
    rightReindeerHead.rotation.y = Math.PI * 1.26;
    rightReindeerHead.rotation.z = Math.PI * -0.57;
    rightReindeerHead.position.x = rightReindeerTorso.position.x - 8;
    rightReindeerHead.position.y = rightReindeerTorso.position.y + 17;
    rightReindeerHead.position.z = rightReindeerTorso.position.z + 26;
    rightReindeerHead.updateMatrixWorld();
    scene.add(rightReindeerHead);

    const footRestHeight = 34;
    const footRestRadius = 15;
    const footRestGeometry = new THREE.CylinderGeometry(
      footRestRadius,
      footRestRadius,
      footRestHeight
    );
    const footRest = new THREE.Mesh(footRestGeometry, material);
    footRest.position.x = Constants.wallWidth - 12;
    footRest.position.y = footRestHeight / 2;
    footRest.position.z = footRestRadius + 2;
    footRest.updateMatrixWorld();
    scene.add(footRest);
  };

  addHelperSceneAndObjects = (showOnActualScene) => {
    this.helperScene = new THREE.Scene();
    this.helperCamera = this.createCamera();

    if (showOnActualScene) {
      this.scene.add(this.createFloor());
      this.scene.add(this.createLaps());
    }
    this.helperScene.add(this.createLaps());

    if (showOnActualScene) {
      this.addHeadAndShoulders(
        this.scene,
        9,
        Constants.wallWidth / 2 + 3,
        Constants.daddyFaceHeight,
        Constants.daddyFaceToBackWall,
        0,
        0,
        0,
        0,
        "daddy"
      );
      this.addHeadAndShoulders(
        this.scene,
        9,
        Constants.wallWidth / 2 - 28,
        Constants.daddyFaceHeight - 1,
        Constants.daddyFaceToBackWall,
        6,
        -0.18,
        0,
        0,
        "mommy"
      );
      this.addHeadAndShoulders(
        this.scene,
        7,
        Constants.wallWidth / 2 - 24,
        Constants.daddyFaceHeight - 22,
        Constants.daddyFaceToBackWall + 10,
        -3,
        0,
        0,
        0,
        "willow"
      );
      this.addHeadAndShoulders(
        this.scene,
        7,
        Constants.wallWidth / 2 + 42,
        Constants.daddyFaceHeight - 17,
        Constants.daddyFaceToBackWall + 5,
        0,
        0,
        -2,
        -0.15,
        "lily"
      );
      this.addMiscellaneousObjects(this.scene);
    }
    this.addHeadAndShoulders(
      this.helperScene,
      9,
      Constants.wallWidth / 2 + 3,
      Constants.daddyFaceHeight,
      Constants.daddyFaceToBackWall,
      0,
      0,
      0,
      0,
      "daddy"
    );
    this.addHeadAndShoulders(
      this.helperScene,
      9,
      Constants.wallWidth / 2 - 28,
      Constants.daddyFaceHeight - 1,
      Constants.daddyFaceToBackWall,
      6,
      -0.18,
      0,
      0,
      "mommy"
    );
    this.addHeadAndShoulders(
      this.helperScene,
      7,
      Constants.wallWidth / 2 - 24,
      Constants.daddyFaceHeight - 22,
      Constants.daddyFaceToBackWall + 10,
      -3,
      0,
      0,
      0,
      "willow"
    );
    this.addHeadAndShoulders(
      this.helperScene,
      7,
      Constants.wallWidth / 2 + 42,
      Constants.daddyFaceHeight - 17,
      Constants.daddyFaceToBackWall + 5,
      0,
      0,
      -2,
      -0.15,
      "lily"
    );
    this.addMiscellaneousObjects(this.helperScene);

    // not adding umbrella yet; add separately with addUmbrella.
    // scenes cannot share objects, so create a separate umbrella for each scene
    if (showOnActualScene) {
      this.umbrella = this.createUmbrella();
    }
    this.helperUmbrella = this.createUmbrella();

    // x by z array.  So if snowflakeLandingSpots[50*backWallToWhereFloorIsVisible+60]
    // equaled 70 it would represent position 50,70,60
    this.snowflakeLandingSpots = new Float32Array(
      Constants.wallWidth * Constants.backWallToWhereFloorIsVisible
    );

    this.recalculateSnowflakeLandingSpots();
  };

  assetpath = (filename) => {
    return "../../images/" + filename;
  };

  pause = () => {
    this.state = this.updateState(this.state, { type: "TOGGLE_PLAY" });
  };

  playFromBeginning = () => {
    this.updateState(this.state, { type: "PLAY_FROM_BEGINNING" });
  };

  snowflakeCanFall = (vertexX, vertexY, vertexZ) => {
    if (vertexZ > Constants.backWallToWhereFloorIsVisible) {
      return true;
    }
    if (
      vertexX < 0 ||
      vertexY < 0 ||
      vertexZ < 0 ||
      vertexX > Constants.wallWidth ||
      vertexY > Constants.topOfWreath ||
      vertexZ > Constants.backWallToWhereFloorIsVisible
    ) {
      console.log(`Unexpected vertex ${vertexX} ${vertexY} ${vertexZ}`);
    }
    const index = (xCoord, zCoord) =>
      xCoord * Constants.backWallToWhereFloorIsVisible + zCoord;
    return (
      this.snowflakeLandingSpots[index(vertexX, vertexZ)] < vertexY - 2 &&
      (vertexX === 0 ||
        this.snowflakeLandingSpots[index(vertexX - 1, vertexZ)] <
          vertexY - 1) &&
      (vertexX === Constants.wallWidth ||
        this.snowflakeLandingSpots[index(vertexX + 1, vertexZ)] <
          vertexY - 1) &&
      (vertexZ === 0 ||
        this.snowflakeLandingSpots[index(vertexX, vertexZ - 1)] <
          vertexY - 1) &&
      (vertexZ === Constants.backWallToWhereFloorIsVisible ||
        this.snowflakeLandingSpots[index(vertexX, vertexZ + 1)] < vertexY - 1)
    );
  };

  createLaps = () => {
    const lapMaterial = new THREE.MeshBasicMaterial({
      color: 0x777777,
      side: THREE.DoubleSide,
    });
    lapMaterial.transparent = true;
    lapMaterial.opacity = 0.5;
    const lapGeometry = new THREE.PlaneGeometry(110, 40);
    const lap = new THREE.Mesh(lapGeometry, lapMaterial);
    lap.rotation.x = Math.PI * 0.65;
    lap.position.x = Constants.wallWidth / 2;
    lap.position.y = 18;
    lap.position.z = Constants.daddyFaceToBackWall + 15;
    lap.updateMatrixWorld();
    return lap;
  };

  hasFallenOutOfView = (roundedX, roundedY, roundedZ) => {
    // return true if a snowflake is behind people
    return (
      roundedY < 30 &&
      roundedZ < Constants.daddyFaceToBackWall &&
      roundedX > (roundedZ + 654) / 7.267 &&
      roundedX < (roundedZ - 1816) / -7.267
    );
  };

  snowflakeIsVisible = () => {
    // (vertexX, vertexY, vertexZ) => {
    return true;

    // this worked but hurt performance:

    // const snowflakePosition = new THREE.Vector3(vertexX, vertexY, vertexZ);
    // const cameraPosition = this.helperCamera.position;
    // const direction = new THREE.Vector3();
    // direction.subVectors(snowflakePosition, cameraPosition);
    // const distanceToSnowflake = direction.length();
    // direction.normalize();
    // const raycaster = new THREE.Raycaster(cameraPosition, direction, 1, Constants.cameraToBackWall);
    //
    // // calculate objects intersecting the ray
    // const intersects = raycaster.intersectObjects(this.helperScene.children);
    // if (intersects.length === 0) {
    //   return true;
    // }
    // const distanceToClosestObject = intersects[0].distance;
    //
    // return distanceToClosestObject > distanceToSnowflake;
  };

  updateSnowflakeLandingSpotsWithSnowflakeLanded = (
    vertexX,
    vertexY,
    vertexZ
  ) => {
    const index = (xCoord, zCoord) =>
      xCoord * Constants.backWallToWhereFloorIsVisible + zCoord;
    // commented code caused snowflakes to accumulate awkwardly
    this.snowflakeLandingSpots[index(vertexX, vertexZ)] = vertexY - 1; // + 1;
    // if (vertexX > 0) {
    //   this.snowflakeLandingSpots[index(vertexX - 1, vertexZ)] = vertexY;
    // }
    // if (vertexX < Constants.wallWidth) {
    //   this.snowflakeLandingSpots[index(vertexX + 1, vertexZ)] = vertexY;
    // }
    // if (vertexZ > 0) {
    //   this.snowflakeLandingSpots[index(vertexX, vertexZ - 1)] = vertexY;
    // }
    // if (vertexZ < Constants.backWallToWhereFloorIsVisible) {
    //   this.snowflakeLandingSpots[index(vertexX, vertexZ + 1)] = vertexY;
    // }
  };

  // three js requires state to be mutable so not using redux
  updateState = (state = {}, action) => {
    switch (action.type) {
      case "MARK_INITIALIZED":
        state.initialized = true;
        // Added this now that snow scene gets removed and then reinitialized
        if (this.rendered) {
          const loadingChristmasMagicElement = document.getElementById(
            "LoadingChristmasMagic"
          );
          if (loadingChristmasMagicElement) {
            loadingChristmasMagicElement.hidden = true;
          }
        }
        break;
      case "REMOVED":
        state.initialized = false;
        break;
      case "TOGGLE_PLAY":
        state.playing = !state.playing;
        break;
      case "PLAY_FROM_BEGINNING":
        this.initializeSnowflakeData();

        state.outOfSnowflakes = false;
        state.snowflakesPerSecond = Constants.initialSnowflakesPerSecond;
        state.frameNumber = 0;
        state.frameNumberOfLastBackgroundChange = 0;
        state.background = Backgrounds.none;
        state.updateMode = UpdateModes.automatic;
        break;
      case "SNOWFLAKE_GEOMETRY_READY":
        state.snowflakes = this.snowflakes;
        state.snowflakePositions = this.flakesGeometry.attributes.position;
        state.actualYInCaseInvisible =
          this.flakesGeometry.attributes.actualYInCaseInvisible;
        state.playing = true;

        break;
      case "BACKGROUND_READY":
        if (!this.rendered && !this.waitingForSnowflakeTexture) {
          const loadingChristmasMagicElement = document.getElementById(
            "LoadingChristmasMagic"
          );
          if (loadingChristmasMagicElement) {
            loadingChristmasMagicElement.hidden = true;
          }
          this.setBackground(state, Backgrounds.indoorGearSmiling);
          this.render();
        }
        break;
      case "ADVANCE_A_FRAME":
        switch (state.background) {
          case Backgrounds.none:
            this.setBackground(state, Backgrounds.indoorGearSmiling);
            break;
          case Backgrounds.indoorGearSmiling:
            if (
              state.frameNumber - state.frameNumberOfLastBackgroundChange >
              Constants.secondsOfSnowBeforeConfused * Constants.framesPerSecond
            ) {
              this.setBackground(state, Backgrounds.indoorGearConfused);
            }
            if (
              state.snowflakesPerSecond < Constants.defaultSnowflakesPerSecond
            ) {
              state.snowflakesPerSecond =
                (Constants.defaultSnowflakesPerSecond *
                  (state.frameNumber -
                    state.frameNumberOfLastBackgroundChange)) /
                (Constants.secondsToTransitionSnowSpeed *
                  Constants.framesPerSecond);
            }
            break;
          default:
            break;
          case Backgrounds.indoorGearConfused:
            if (
              state.frameNumber - state.frameNumberOfLastBackgroundChange >
              Constants.secondsFromConfusedToShivering *
                Constants.framesPerSecond
            ) {
              this.setBackground(state, Backgrounds.indoorGearShivering);
            }
            break;
          case Backgrounds.indoorGearShivering:
            if (
              state.frameNumber - state.frameNumberOfLastBackgroundChange >
              Constants.secondsFromShiveringToWinterGear *
                Constants.framesPerSecond
            ) {
              this.setBackground(state, Backgrounds.winterGearSmiling);
            }
            break;
          case Backgrounds.winterGearSmiling:
            if (
              state.frameNumber - state.frameNumberOfLastBackgroundChange >
              Constants.secondsFromWinterGearToUmbrella *
                Constants.framesPerSecond
            ) {
              this.setBackground(state, Backgrounds.winterGearWithUmbrella);
              this.addUmbrella(Constants.helpFigureOutWhereThingsAre);
            }
            if (
              state.snowflakesPerSecond < Constants.heavySnowflakesPerSecond
            ) {
              state.snowflakesPerSecond =
                (Constants.heavySnowflakesPerSecond *
                  (state.frameNumber -
                    state.frameNumberOfLastBackgroundChange)) /
                (Constants.secondsToTransitionSnowSpeed *
                  Constants.framesPerSecond);
            }
            break;
          case Backgrounds.winterGearWithUmbrella:
            if (
              state.frameNumber - state.frameNumberOfLastBackgroundChange >
              Constants.secondsBeforeUmbrellaDisappears *
                Constants.framesPerSecond
            ) {
              this.setBackground(
                state,
                Backgrounds.winterGearAnticipatingSnowDump
              );
              this.removeUmbrella(Constants.helpFigureOutWhereThingsAre);
            }
            break;
          case Backgrounds.winterGearAnticipatingSnowDump:
            if (
              state.frameNumber - state.frameNumberOfLastBackgroundChange >
              Constants.secondsOfSnowDumpAnticipation *
                Constants.framesPerSecond
            ) {
              this.setBackground(state, Backgrounds.winterGearSillyFaces);
            }
            // after the frozen-in-time delay go back to default speed
            state.snowflakesPerSecond = Constants.defaultSnowflakesPerSecond;
            break;
        }
        if (
          !this.waitingForSnowflakeTexture &&
          !this.waitingForBackgroundImage
        ) {
          state.frameNumber++;
          const snowflakesToAdd =
            state.snowflakesPerSecond / Constants.framesPerSecond;

          // Freeze time momentarily while we anticipate a big snow dump
          if (
            !state.outOfSnowflakes &&
            state.background !== Backgrounds.winterGearAnticipatingSnowDump
          ) {
            let snowflakesAddedCounter = 0;
            let verticesChanged = false;
            const vertices = state.snowflakePositions.array;
            const actualYInCaseInvisible = state.actualYInCaseInvisible.array;
            for (let index = 0; index < Constants.totalFlakes; index++) {
              const roundedX = Math.round(vertices[index * 3 + 0]);
              const currentY = actualYInCaseInvisible[index];
              const roundedY = Math.round(actualYInCaseInvisible[index]);
              const roundedZ = Math.round(vertices[index * 3 + 2]);
              if (
                state.snowflakes[index].state.lifestage ===
                  SnowflakeLifestages.falling ||
                state.snowflakes[index].state.lifestage ===
                  SnowflakeLifestages.fallingFast
              ) {
                if (this.hasFallenOutOfView(roundedX, roundedY, roundedZ)) {
                  state.snowflakes[index].state.lifestage =
                    SnowflakeLifestages.fallenOutOfView;
                  verticesChanged = true;
                  actualYInCaseInvisible[index] = Constants.topOfWreath;
                  vertices[index * 3 + 1] = Constants.topOfWreath;
                } else if (
                  this.snowflakeCanFall(roundedX, roundedY, roundedZ)
                ) {
                  const amountToFall =
                    state.snowflakes[index].state.lifestage ===
                    SnowflakeLifestages.falling
                      ? 0.6
                      : 2;
                  const newY = currentY - amountToFall;
                  verticesChanged = true;
                  actualYInCaseInvisible[index] = newY;
                  // snowflakeIsVisible is expensive so try minimize calls to it
                  if (
                    roundedZ > Constants.daddyFaceToBackWall ||
                    this.snowflakeIsVisible(roundedX, newY, roundedZ)
                  ) {
                    vertices[index * 3 + 1] = newY;
                  } else {
                    vertices[index * 3 + 1] = Constants.topOfWreath;
                  }
                } else {
                  state.snowflakes[index].state.lifestage =
                    SnowflakeLifestages.landed;
                  this.updateSnowflakeLandingSpotsWithSnowflakeLanded(
                    roundedX,
                    roundedY,
                    roundedZ
                  );
                }
              } else if (
                state.snowflakes[index].state.lifestage ===
                  SnowflakeLifestages.notYetInView &&
                snowflakesAddedCounter < snowflakesToAdd
              ) {
                state.snowflakes[index].state.lifestage =
                  SnowflakeLifestages.falling;
                snowflakesAddedCounter++;
                if (index === Constants.totalFlakes - 1) {
                  state.outOfSnowflakes = true;
                }
              } else if (
                state.snowflakes[index].state.lifestage ===
                  SnowflakeLifestages.landed &&
                actualYInCaseInvisible[index] > Constants.daddyFaceHeight &&
                this.snowflakeCanFall(roundedX, roundedY, roundedZ)
              ) {
                state.snowflakes[index].state.lifestage =
                  SnowflakeLifestages.fallingFast;
              }
            }
            state.snowflakePositions.needsUpdate = verticesChanged;
          }
        }
        break;
      default:
        break;
    }

    return state;
  };

  render = () => {
    requestAnimationFrame(this.render);

    if (this.state.playing) {
      this.updateState(this.state, { type: "ADVANCE_A_FRAME" });
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.backgroundScene, this.backgroundCamera);
      this.renderer.render(this.scene, this.camera);
    }
    this.rendered = true;
  };

  static _instance = new SnowScene();

  static getInstance() {
    return SnowScene._instance;
  }

  remove = () => {
    if (
      this.canvasElement &&
      this.canvasElement.children.length > 0 &&
      this.renderer &&
      this.renderer.domElement
    ) {
      this.canvasElement.removeChild(this.renderer.domElement);
    }
    this.updateState(this.state, { type: "REMOVED" });
    this.updateState(this.state, { type: "PLAY_FROM_BEGINNING" });
  };

  initialize = () => {
    if (this.state.initialized) {
      return;
    }

    if (this.canvasElement.children.length === 0) {
      this.canvasElement.appendChild(this.renderer.domElement);
    }

    this.updateState(this.state, { type: "MARK_INITIALIZED" });
  };
}
