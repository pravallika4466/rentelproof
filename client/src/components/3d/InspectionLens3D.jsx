import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const InspectionLens3D = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let lensGroup, outerRing, innerRing, reticle, crosshair;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 220;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 5.5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      lensGroup = new THREE.Group();
      scene.add(lensGroup);

      // 1. Outer Inspection Bezel (Torus)
      const outerGeo = new THREE.TorusGeometry(1.9, 0.05, 16, 64);
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x064e3b,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      outerRing = new THREE.Mesh(outerGeo, outerMat);
      lensGroup.add(outerRing);

      // 2. Inner Rotating Precision Reticle (Zero blue - emerald & amber marks)
      const innerGeo = new THREE.RingGeometry(1.3, 1.4, 32);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.8 : 0.6,
        side: THREE.DoubleSide,
      });
      innerRing = new THREE.Mesh(innerGeo, innerMat);
      lensGroup.add(innerRing);

      // 3. Central Target Focus Dodecahedron
      const reticleGeo = new THREE.DodecahedronGeometry(0.5, 0);
      const reticleMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      reticle = new THREE.Mesh(reticleGeo, reticleMat);
      lensGroup.add(reticle);

      // 4. Optical Scan Crosshairs
      const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.7 });
      const points = [
        new THREE.Vector3(-1.8, 0, 0),
        new THREE.Vector3(1.8, 0, 0),
        new THREE.Vector3(0, -1.8, 0),
        new THREE.Vector3(0, 1.8, 0),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      crosshair = new THREE.LineSegments(lineGeo, lineMat);
      lensGroup.add(crosshair);

      // 5. Surrounding Forensic Evidence Sparks
      const sparkCount = 60;
      const sparkGeo = new THREE.BufferGeometry();
      const sparkPos = new Float32Array(sparkCount * 3);
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 1.0 + Math.random() * 1.2;
        sparkPos[i * 3] = Math.cos(angle) * rad;
        sparkPos[i * 3 + 1] = Math.sin(angle) * rad;
        sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
      sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
      const sparkMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const sparks = new THREE.Points(sparkGeo, sparkMat);
      lensGroup.add(sparks);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambient);

      const light = new THREE.PointLight(0x10b981, 3, 10);
      light.position.set(0, 0, 3);
      scene.add(light);

      let mouseX = 0;
      let mouseY = 0;
      handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
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
          innerRing.rotation.z = t * 0.4;
          outerRing.rotation.x = Math.sin(t * 0.5) * 0.2;
          outerRing.rotation.y = Math.cos(t * 0.5) * 0.2;

          reticle.rotation.x = t * 0.6;
          reticle.rotation.y = t * 0.8;

          lensGroup.rotation.y += (mouseX * 0.3 - lensGroup.rotation.y) * 0.05;
          lensGroup.rotation.x += (-mouseY * 0.3 - lensGroup.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Inspection lens 3D scene error:', e);
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
      className={`relative w-full h-[180px] sm:h-[220px] flex items-center justify-center pointer-events-auto ${className}`}
      aria-label="3D Holographic Forensic Optical Lens"
    />
  );
};

export default InspectionLens3D;
