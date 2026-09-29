import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const SignupArchitectureVisual = () => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let mainGroup, floors = [], beacon, gridLines;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 500;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(5, 5, 7);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 1. Foundation Base Grid (Zero blue - emerald grid)
      const gridHelper = new THREE.GridHelper(6, 12, 0x10b981, isDark ? 0x064e3b : 0xa7f3d0);
      gridHelper.position.y = -1.8;
      mainGroup.add(gridHelper);

      // 2. Multi-tier Abstract Property Structure (Slabs / Floors)
      const floorCount = 4;
      const floorWidths = [2.6, 2.2, 1.8, 1.4];
      const floorHeights = [0.35, 0.35, 0.35, 0.35];

      for (let i = 0; i < floorCount; i++) {
        const slabGeo = new THREE.BoxGeometry(floorWidths[i], floorHeights[i], floorWidths[i]);
        const slabMat = new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x064e3b : 0x059669,
          emissive: 0x047857,
          emissiveIntensity: 0.3 + i * 0.15,
          roughness: 0.15,
          metalness: 0.8,
          wireframe: true,
          transparent: true,
          opacity: isDark ? 0.75 : 0.65,
        });
        const slabMesh = new THREE.Mesh(slabGeo, slabMat);
        slabMesh.position.y = -1.2 + i * 0.9;
        mainGroup.add(slabMesh);
        floors.push({ mesh: slabMesh, initialY: slabMesh.position.y, phase: i * 0.8 });

        // Add inner crystal core for each floor
        const coreGeo = new THREE.BoxGeometry(floorWidths[i] * 0.6, floorHeights[i] * 0.5, floorWidths[i] * 0.6);
        const coreMat = new THREE.MeshStandardMaterial({
          color: i === 3 ? 0xf59e0b : 0x10b981,
          emissive: i === 3 ? 0xd97706 : 0x059669,
          emissiveIntensity: 0.6,
          roughness: 0.3,
        });
        const innerMesh = new THREE.Mesh(coreGeo, coreMat);
        slabMesh.add(innerMesh);
      }

      // 3. Penthouse Crown / Beacon (Representing Verified Title)
      const beaconGeo = new THREE.OctahedronGeometry(0.5, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.0,
        roughness: 0.1,
      });
      beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 2.4;
      mainGroup.add(beacon);

      // 4. Ambient Construction Dust / Escrow Data Particles
      const particleCount = 150;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const colArray = new Float32Array(particleCount * 3);

      const emerald = new THREE.Color(0x10b981);
      const amber = new THREE.Color(0xf59e0b);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 7;
        posArray[i3 + 1] = Math.random() * 5 - 1.5;
        posArray[i3 + 2] = (Math.random() - 0.5) * 7;

        const c = Math.random() > 0.3 ? emerald : amber;
        colArray[i3] = c.r;
        colArray[i3 + 1] = c.g;
        colArray[i3 + 2] = c.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.8 : 0.6,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(particles);

      // Lights
      const ambientLight = new THREE.AmbientLight(isDark ? 0x060708 : 0xffffff, isDark ? 1.4 : 1.2);
      scene.add(ambientLight);

      const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 15);
      emeraldLight.position.set(4, 5, 4);
      scene.add(emeraldLight);

      const amberLight = new THREE.PointLight(0xf59e0b, 2.5, 12);
      amberLight.position.set(-3, 2, -2);
      scene.add(amberLight);

      let targetRotY = 0;
      let targetRotX = 0;

      handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = x * 0.45;
        targetRotX = -y * 0.3;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      const startTime = performance.now();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const t = (performance.now() - startTime) * 0.001;

        if (!prefersReducedMotion) {
          mainGroup.rotation.y = t * 0.15;

          // Subtle floating rhythm for architectural floors
          floors.forEach((f) => {
            f.mesh.position.y = f.initialY + Math.sin(t * 1.5 + f.phase) * 0.06;
            f.mesh.rotation.y = Math.sin(t * 0.5 + f.phase) * 0.08;
          });

          beacon.rotation.y = t * 0.8;
          beacon.rotation.x = t * 0.4;
          beacon.position.y = 2.4 + Math.sin(t * 2) * 0.08;

          particles.rotation.y = -t * 0.05;

          // Camera gentle parallax response
          camera.position.x += (5 + targetRotY * 2 - camera.position.x) * 0.04;
          camera.position.y += (5 + targetRotX * 2 - camera.position.y) * 0.04;
          camera.lookAt(0, 0.3, 0);
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Signup 3D scene initialization error:', e);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize) window.removeEventListener('resize', handleResize);

      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] flex items-center justify-center pointer-events-auto"
      aria-label="3D Isometric Architectural Property Tower"
    />
  );
};

export default SignupArchitectureVisual;
