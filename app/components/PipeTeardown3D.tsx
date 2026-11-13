"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";

interface ExplodablePart {
  group: THREE.Group;
  origin: THREE.Vector3;
  offset: THREE.Vector3;
}

/**
 * Generates an extruded circular pipe flange with a hollow central bore and four
 * perimeter bolt holes matching industrial mechanical CAD standards.
 */
function buildDrilledFlangeGeometry(
  outerRadius: number,
  boreRadius: number,
  boltCircleRadius: number,
  boltHoleRadius: number,
  thickness: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  const centerHole = new THREE.Path();
  centerHole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
  shape.holes.push(centerHole);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4;
    const hole = new THREE.Path();
    hole.absarc(
      Math.cos(angle) * boltCircleRadius,
      Math.sin(angle) * boltCircleRadius,
      boltHoleRadius,
      0,
      Math.PI * 2,
      true
    );
    shape.holes.push(hole);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 48,
  });

  geometry.center();
  geometry.rotateY(Math.PI / 2);
  return geometry;
}

/**
 * Creates a crisp monochrome procedural dial face texture for the 3D gauge.
 */
function createMonochromeDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const cx = 256;
    const cy = 256;

    ctx.fillStyle = "#f4f5f7";
    ctx.fillRect(0, 0, 512, 512);

    const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 250);
    bgGrad.addColorStop(0, "#ffffff");
    bgGrad.addColorStop(1, "#e2e5ea");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 250, 0, Math.PI * 2);
    ctx.fill();

    // Outer technical ring
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 214, Math.PI * 0.72, Math.PI * 2.28);
    ctx.stroke();

    // Calibrated radial ticks
    const totalTicks = 28;
    const startAngle = Math.PI * 0.75;
    const sweep = Math.PI * 1.5;

    for (let i = 0; i <= totalTicks; i++) {
      const t = i / totalTicks;
      const angle = startAngle + t * sweep;
      const isMajor = i % 4 === 0;
      const innerR = isMajor ? 168 : 186;
      const outerR = 208;

      ctx.strokeStyle = isMajor ? "#111827" : "#6b7280";
      ctx.lineWidth = isMajor ? 5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.stroke();
    }

    // Inner reticle
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 88, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#3f3f46";
    ctx.font = "600 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BAR", cx, cy + 124);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Builds a hollow gasket disc oriented along the pipe X axis.
 */
function buildGasketGeometry(
  outerRadius: number,
  innerRadius: number,
  thickness: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 44,
  });
  geometry.center();
  geometry.rotateY(Math.PI / 2);
  return geometry;
}

/**
 * Real-time monochrome 3D WebGL exploded hydraulic manifold & valve teardown.
 * Animates automatically without interactive controls, adapting cleanly to
 * light and dark themes directly over the hero background.
 */
export function PipeTeardown3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Skip cleanly if WebGL context is unavailable.
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = envTarget.texture;
    roomEnvironment.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const lookTarget = new THREE.Vector3(0.08, 0.24, 0);

    // Studio key & rim lighting for sharp monochrome bevel contrast
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe5e7eb, 1.3);
    rimLight.position.set(-7, 4, -6);
    scene.add(rimLight);

    const underFill = new THREE.DirectionalLight(0xd4d4d8, 0.65);
    underFill.position.set(0, -6, 4);
    scene.add(underFill);

    // Strictly monochrome metallic & elastomer materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      metalness: 0.94,
      roughness: 0.14,
    });
    const aluminumMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.84,
      roughness: 0.27,
    });
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x52525b,
      metalness: 0.8,
      roughness: 0.34,
    });
    const darkGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.38,
      roughness: 0.62,
    });
    const fastenerMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.88,
      roughness: 0.24,
    });
    const dialTexture = createMonochromeDialTexture();
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      roughness: 0.4,
      metalness: 0.05,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.06,
      metalness: 0.1,
      clearcoat: 1,
    });

    const geometries: THREE.BufferGeometry[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };

    const assemblyRoot = new THREE.Group();
    assemblyRoot.rotation.set(0.22, -0.44, -0.04);
    scene.add(assemblyRoot);

    const parts: ExplodablePart[] = [];
    const registerPart = (
      group: THREE.Group,
      origin: THREE.Vector3,
      offset: THREE.Vector3
    ) => {
      group.position.copy(origin);
      assemblyRoot.add(group);
      parts.push({ group, origin, offset });
    };

    // Shared rotated cylinder helper (aligned with X pipe axis)
    const pipeRotZ = Math.PI / 2;

    // ------------------------------------------------------------------
    // 0. Central Core T-Manifold Body (stationary mechanical anchor)
    // ------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    const coreBarrel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 1.9, 44)),
      aluminumMat
    );
    coreBarrel.rotation.z = pipeRotZ;
    coreGroup.add(coreBarrel);

    // Turned stepped ribs & machined central collar
    [-0.78, 0.78].forEach((x) => {
      const rib = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.47, 0.47, 0.14, 44)),
        gunmetalMat
      );
      rib.rotation.z = pipeRotZ;
      rib.position.x = x;
      coreGroup.add(rib);

      const spigot = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.28, 36)),
        chromeMat
      );
      spigot.rotation.z = pipeRotZ;
      spigot.position.x = x > 0 ? 1.05 : -1.05;
      coreGroup.add(spigot);

      const oRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.345, 0.024, 16, 40)),
        darkGraphiteMat
      );
      oRing.rotation.y = Math.PI / 2;
      oRing.position.x = x > 0 ? 1.08 : -1.08;
      coreGroup.add(oRing);
    });

    // Vertical valve riser tower (center-left x = -0.26)
    const valveTower = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.34, 0.39, 0.72, 36)),
      gunmetalMat
    );
    valveTower.position.set(-0.26, 0.46, 0);
    coreGroup.add(valveTower);

    // Top socket rim on valve tower
    const towerLip = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.31, 0.032, 16, 36)),
      chromeMat
    );
    towerLip.rotation.x = Math.PI / 2;
    towerLip.position.set(-0.26, 0.81, 0);
    coreGroup.add(towerLip);

    // Lower purge port boss (underneath at x = -0.26)
    const lowerBoss = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.31, 0.34, 32)),
      gunmetalMat
    );
    lowerBoss.position.set(-0.26, -0.42, 0);
    coreGroup.add(lowerBoss);

    // Secondary gauge turret boss (at x = +0.52)
    const gaugeTurret = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2, 0.24, 0.44, 32)),
      gunmetalMat
    );
    gaugeTurret.position.set(0.52, 0.42, 0);
    coreGroup.add(gaugeTurret);

    assemblyRoot.add(coreGroup);

    // ------------------------------------------------------------------
    // 1. Central Splined Gear Coupling Collar (explodes radially +X)
    // ------------------------------------------------------------------
    const splinedGroup = new THREE.Group();
    const splineDrum = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.51, 0.51, 0.34, 40)),
      chromeMat
    );
    splineDrum.rotation.z = pipeRotZ;
    splinedGroup.add(splineDrum);

    const toothGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.075, 0.055));
    const teethCount = 20;
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeo, aluminumMat);
      tooth.position.set(
        0,
        Math.cos(angle) * 0.52,
        Math.sin(angle) * 0.52
      );
      tooth.rotation.x = -angle;
      splinedGroup.add(tooth);
    }
    registerPart(
      splinedGroup,
      new THREE.Vector3(0.16, 0, 0),
      new THREE.Vector3(0.32, 0, 0.65)
    );

    // ------------------------------------------------------------------
    // 2. Left Axis: Gasket -> 4-Bolt Flange -> 4 Hex Bolts -> Inlet Pipe
    // ------------------------------------------------------------------
    const sharedFlangeGeo = trackGeo(
      buildDrilledFlangeGeometry(0.76, 0.36, 0.56, 0.068, 0.11)
    );
    const sharedGasketGeo = trackGeo(buildGasketGeometry(0.7, 0.35, 0.055));
    const sharedBoltShaftGeo = trackGeo(
      new THREE.CylinderGeometry(0.042, 0.042, 0.24, 16)
    );
    const sharedBoltHeadGeo = trackGeo(
      new THREE.CylinderGeometry(0.08, 0.08, 0.07, 6)
    );

    const leftGasketGroup = new THREE.Group();
    leftGasketGroup.add(new THREE.Mesh(sharedGasketGeo, darkGraphiteMat));
    registerPart(
      leftGasketGroup,
      new THREE.Vector3(-0.98, 0, 0),
      new THREE.Vector3(-0.46, 0, 0)
    );

    const leftFlangeGroup = new THREE.Group();
    leftFlangeGroup.add(new THREE.Mesh(sharedFlangeGeo, aluminumMat));
    registerPart(
      leftFlangeGroup,
      new THREE.Vector3(-1.12, 0, 0),
      new THREE.Vector3(-0.95, 0, 0)
    );

    const leftBoltsGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const boltPair = new THREE.Group();
      const shaft = new THREE.Mesh(sharedBoltShaftGeo, fastenerMat);
      shaft.rotation.z = pipeRotZ;
      const head = new THREE.Mesh(sharedBoltHeadGeo, chromeMat);
      head.rotation.z = pipeRotZ;
      head.position.x = -0.13;
      boltPair.add(shaft, head);
      boltPair.position.set(
        0,
        Math.sin(angle) * 0.56,
        Math.cos(angle) * 0.56
      );
      leftBoltsGroup.add(boltPair);
    }
    registerPart(
      leftBoltsGroup,
      new THREE.Vector3(-1.26, 0, 0),
      new THREE.Vector3(-1.38, 0, 0)
    );

    const inletPipeGroup = new THREE.Group();
    const inletBarrel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 1.12, 40)),
      aluminumMat
    );
    inletBarrel.rotation.z = pipeRotZ;
    inletPipeGroup.add(inletBarrel);

    // Stepped end collar & external machined threads
    const inletRing = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.41, 0.41, 0.18, 40)),
      gunmetalMat
    );
    inletRing.rotation.z = pipeRotZ;
    inletRing.position.x = 0.46;
    inletPipeGroup.add(inletRing);

    const threadRingGeo = trackGeo(new THREE.TorusGeometry(0.365, 0.018, 12, 36));
    for (let t = 0; t < 5; t++) {
      const threadRing = new THREE.Mesh(threadRingGeo, chromeMat);
      threadRing.rotation.y = Math.PI / 2;
      threadRing.position.x = -0.52 + t * 0.055;
      inletPipeGroup.add(threadRing);
    }
    registerPart(
      inletPipeGroup,
      new THREE.Vector3(-1.72, 0, 0),
      new THREE.Vector3(-1.68, 0, 0)
    );

    // ------------------------------------------------------------------
    // 3. Upper Valve Axis (+Y): Hex Bonnet -> Threaded Stem -> Handwheel
    // ------------------------------------------------------------------
    const bonnetGroup = new THREE.Group();
    const bonnetHex = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.2, 6)),
      aluminumMat
    );
    const bonnetWasher = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 32)),
      darkGraphiteMat
    );
    bonnetWasher.position.y = -0.13;
    bonnetGroup.add(bonnetHex, bonnetWasher);
    registerPart(
      bonnetGroup,
      new THREE.Vector3(-0.26, 0.88, 0),
      new THREE.Vector3(0, 0.48, 0)
    );

    const stemGroup = new THREE.Group();
    const stemShaft = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.72, 24)),
      chromeMat
    );
    stemGroup.add(stemShaft);
    const acmeGeo = trackGeo(new THREE.TorusGeometry(0.095, 0.014, 10, 24));
    for (let t = 0; t < 6; t++) {
      const acme = new THREE.Mesh(acmeGeo, gunmetalMat);
      acme.rotation.x = Math.PI / 2;
      acme.position.y = -0.25 + t * 0.075;
      stemGroup.add(acme);
    }
    registerPart(
      stemGroup,
      new THREE.Vector3(-0.26, 1.18, 0),
      new THREE.Vector3(0, 0.96, 0)
    );

    const wheelGroup = new THREE.Group();
    const wheelRim = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.56, 0.068, 22, 56)),
      darkGraphiteMat
    );
    wheelRim.rotation.x = Math.PI / 2;
    wheelGroup.add(wheelRim);

    const wheelHub = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 28)),
      chromeMat
    );
    wheelGroup.add(wheelHub);

    const wheelLocknut = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 6)),
      gunmetalMat
    );
    wheelLocknut.position.y = 0.08;
    wheelGroup.add(wheelLocknut);

    const spokeGeo = trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 1.06, 16));
    for (let s = 0; s < 2; s++) {
      const spoke = new THREE.Mesh(spokeGeo, aluminumMat);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = (s * Math.PI) / 2;
      wheelGroup.add(spoke);
    }
    registerPart(
      wheelGroup,
      new THREE.Vector3(-0.26, 1.5, 0),
      new THREE.Vector3(0, 1.48, 0)
    );

    // ------------------------------------------------------------------
    // 4. Lower Strainer & Purge Cap Axis (-Y under valve tower)
    // ------------------------------------------------------------------
    const lowerSealGroup = new THREE.Group();
    const lowerSealRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.24, 0.026, 16, 36)),
      darkGraphiteMat
    );
    lowerSealRing.rotation.x = Math.PI / 2;
    lowerSealGroup.add(lowerSealRing);
    registerPart(
      lowerSealGroup,
      new THREE.Vector3(-0.26, -0.62, 0),
      new THREE.Vector3(0, -0.48, 0)
    );

    const lowerStrainerGroup = new THREE.Group();
    const meshCore = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.36, 24)),
      gunmetalMat
    );
    meshCore.position.y = 0.18;
    const capBody = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 6)),
      aluminumMat
    );
    capBody.position.y = -0.06;
    const drainPlug = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6)),
      chromeMat
    );
    drainPlug.position.y = -0.18;
    lowerStrainerGroup.add(meshCore, capBody, drainPlug);
    registerPart(
      lowerStrainerGroup,
      new THREE.Vector3(-0.26, -0.78, 0),
      new THREE.Vector3(0, -1.04, 0)
    );

    // ------------------------------------------------------------------
    // 5. Right Gauge Tower (+Y at x = +0.52): Hex Collar -> Dial Case
    // ------------------------------------------------------------------
    const gaugeCollarGroup = new THREE.Group();
    const collarHex = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.22, 6)),
      aluminumMat
    );
    const gaugeNeck = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.095, 0.095, 0.28, 24)),
      chromeMat
    );
    gaugeNeck.position.y = 0.2;
    gaugeCollarGroup.add(collarHex, gaugeNeck);
    registerPart(
      gaugeCollarGroup,
      new THREE.Vector3(0.52, 0.68, 0),
      new THREE.Vector3(0, 0.48, 0)
    );

    const gaugeHeadGroup = new THREE.Group();
    const caseBody = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.18, 48)),
      gunmetalMat
    );
    caseBody.rotation.x = Math.PI / 2;
    const caseBezel = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.45, 0.042, 18, 48)),
      chromeMat
    );
    caseBezel.position.z = 0.085;
    const dialPlate = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(0.42, 44)),
      dialMat
    );
    dialPlate.position.z = 0.092;
    const needleGroup = new THREE.Group();
    needleGroup.position.z = 0.104;
    const needleBar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.028, 0.3, 0.01)),
      darkGraphiteMat
    );
    needleBar.position.y = 0.1;
    needleGroup.add(needleBar);
    needleGroup.rotation.z = -0.55;
    const needleHub = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.025, 20)),
      fastenerMat
    );
    needleHub.rotation.x = Math.PI / 2;
    needleHub.position.z = 0.11;
    const glassLens = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(0.425, 44)),
      lensMat
    );
    glassLens.position.z = 0.118;

    gaugeHeadGroup.add(
      caseBody,
      caseBezel,
      dialPlate,
      needleGroup,
      needleHub,
      glassLens
    );
    registerPart(
      gaugeHeadGroup,
      new THREE.Vector3(0.52, 1.28, 0),
      new THREE.Vector3(0, 1.12, 0)
    );

    // ------------------------------------------------------------------
    // 6. Right Axis: Gasket -> 4-Bolt Flange -> 4 Bolts -> 90° Outlet Elbow
    // ------------------------------------------------------------------
    const rightGasketGroup = new THREE.Group();
    rightGasketGroup.add(new THREE.Mesh(sharedGasketGeo, darkGraphiteMat));
    registerPart(
      rightGasketGroup,
      new THREE.Vector3(0.98, 0, 0),
      new THREE.Vector3(0.46, 0, 0)
    );

    const rightFlangeGroup = new THREE.Group();
    rightFlangeGroup.add(new THREE.Mesh(sharedFlangeGeo, aluminumMat));
    registerPart(
      rightFlangeGroup,
      new THREE.Vector3(1.12, 0, 0),
      new THREE.Vector3(0.95, 0, 0)
    );

    const rightBoltsGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const boltPair = new THREE.Group();
      const shaft = new THREE.Mesh(sharedBoltShaftGeo, fastenerMat);
      shaft.rotation.z = pipeRotZ;
      const head = new THREE.Mesh(sharedBoltHeadGeo, chromeMat);
      head.rotation.z = pipeRotZ;
      head.position.x = 0.13;
      boltPair.add(shaft, head);
      boltPair.position.set(
        0,
        Math.sin(angle) * 0.56,
        Math.cos(angle) * 0.56
      );
      rightBoltsGroup.add(boltPair);
    }
    registerPart(
      rightBoltsGroup,
      new THREE.Vector3(1.26, 0, 0),
      new THREE.Vector3(1.38, 0, 0)
    );

    const outletElbowGroup = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0, 0),
      new THREE.Vector3(0.18, 0, 0),
      new THREE.Vector3(0.48, -0.14, 0),
      new THREE.Vector3(0.62, -0.58, 0),
      new THREE.Vector3(0.62, -1.04, 0),
    ]);
    const elbowTube = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(curve, 36, 0.34, 32, false)),
      aluminumMat
    );
    outletElbowGroup.add(elbowTube);

    const elbowStartCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.41, 0.41, 0.16, 40)),
      gunmetalMat
    );
    elbowStartCollar.rotation.z = pipeRotZ;
    elbowStartCollar.position.set(-0.28, 0, 0);
    outletElbowGroup.add(elbowStartCollar);

    const elbowEndCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.39, 0.39, 0.16, 40)),
      chromeMat
    );
    elbowEndCollar.position.set(0.62, -1.0, 0);
    outletElbowGroup.add(elbowEndCollar);

    registerPart(
      outletElbowGroup,
      new THREE.Vector3(1.56, 0, 0),
      new THREE.Vector3(1.66, 0, 0)
    );

    // ------------------------------------------------------------------
    // Thin Hairline Exploded Axis Trajectory Guides (monochrome slate)
    // ------------------------------------------------------------------
    const guidePoints: THREE.Vector3[] = [
      new THREE.Vector3(-3.55, 0, 0),
      new THREE.Vector3(3.35, 0, 0),
      new THREE.Vector3(-0.26, -1.9, 0),
      new THREE.Vector3(-0.26, 3.05, 0),
      new THREE.Vector3(0.52, 0.3, 0),
      new THREE.Vector3(0.52, 2.6, 0),
      new THREE.Vector3(0.16, 0, 0),
      new THREE.Vector3(0.48, 0, 0.72),
    ];
    const guideGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(guidePoints));
    const guideMat = new THREE.LineDashedMaterial({
      color: 0x71717a,
      dashSize: 0.1,
      gapSize: 0.08,
      transparent: true,
      opacity: 0,
    });
    const guideLines = new THREE.LineSegments(guideGeo, guideMat);
    guideLines.computeLineDistances();
    assemblyRoot.add(guideLines);

    // ------------------------------------------------------------------
    // Responsive Camera Framing so 3D teardown never clips on any screen
    // ------------------------------------------------------------------
    const handleResize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      const aspect = width / height;

      camera.aspect = aspect;
      const distScale = aspect < 1.3 ? 1.3 / aspect : 1;
      const dist = 12.2 * distScale;
      camera.position.set(dist * 0.24, dist * 0.2, dist * 0.95);
      camera.lookAt(lookTarget);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ------------------------------------------------------------------
    // Subtle Pointer Tilt + Automatic GSAP 3D Explode/Assemble Loop
    // ------------------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    const animState = { explode: prefersReducedMotion() ? 0.65 : 0 };
    const gsap = getGsap();
    let timeline: gsap.core.Timeline | null = null;

    if (!prefersReducedMotion()) {
      timeline = gsap.timeline({ repeat: -1 });
      timeline
        .to(animState, {
          explode: 1,
          duration: 2.1,
          delay: 0.9,
          ease: "power2.inOut",
        })
        .to(animState, {
          explode: 1,
          duration: 2.4,
        })
        .to(animState, {
          explode: 0,
          duration: 1.9,
          ease: "power2.inOut",
        })
        .to(animState, {
          explode: 0,
          duration: 0.9,
        });
    }

    let rafId = 0;
    const startTime = performance.now();

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const t = animState.explode;

      for (const part of parts) {
        part.group.position.copy(part.origin).addScaledVector(part.offset, t);
      }

      // Gentle automatic 3D orbital sway + subtle pointer parallax
      if (!prefersReducedMotion()) {
        const swayYaw = Math.sin(elapsed * 0.55) * 0.18;
        const swayPitch = Math.cos(elapsed * 0.42) * 0.05;
        assemblyRoot.rotation.y +=
          (-0.44 + swayYaw + pointer.x * 0.14 - assemblyRoot.rotation.y) * 0.05;
        assemblyRoot.rotation.x +=
          (0.22 + swayPitch + pointer.y * 0.08 - assemblyRoot.rotation.x) * 0.05;
        needleGroup.rotation.z = -0.55 + Math.sin(elapsed * 2.2) * 0.08 * (1 - t);
      }

      guideMat.opacity = Math.max(0, t - 0.15) * 0.42;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      timeline?.kill();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);

      for (const geo of geometries) {
        geo.dispose();
      }
      dialTexture.dispose();
      chromeMat.dispose();
      aluminumMat.dispose();
      gunmetalMat.dispose();
      darkGraphiteMat.dispose();
      fastenerMat.dispose();
      dialMat.dispose();
      lensMat.dispose();
      guideMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-label="Modelo 3D de despiece automático de conjunto hidráulico"
      className="h-[460px] w-full sm:h-[540px] lg:h-[620px]"
    />
  );
}
