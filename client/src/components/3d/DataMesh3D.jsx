import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const DataMesh3D = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let meshGroup, mesh, geometry;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 220;

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 3.5, 5);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      meshGroup = new THREE.Group();
      scene.add(meshGroup);

      // Topographic Analytical Heightmap Grid
      const w = 6;
      const h = 6;
      const segW = 28;
      const segH = 28;
      geometry = new THREE.PlaneGeometry(w, h, segW, segH);
      geometry.rotateX(-Math.PI / 2);

      const count = geometry.attributes.position.count;

      const material = new THREE.MeshStandardMaterial({
        color: isDark ? 0x064e3b : 0x059669,
        emissive: 0x047857,
        emissiveIntensity: isDark ? 0.6 : 0.35,
        wireframe: true,
        roughness: 0.2,
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -0.5;
      meshGroup.add(mesh);

      // Data point beacons on peaks
      const peakCount = 4;
      const peakBeacons = [];
      const peakGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const peakMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.9,
      });

      for (let i = 0; i < peakCount; i++) {
        const beacon = new THREE.Mesh(peakGeo, peakMat);
        meshGroup.add(beacon);
        peakBeacons.push(beacon);
      }

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambient);

      const light = new THREE.PointLight(0x10b981, 3.5, 12);
      light.position.set(0, 4, 2);
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
        const widthW = container.clientWidth;
        const heightH = container.clientHeight;
        camera.aspect = widthW / heightH;
        camera.updateProjectionMatrix();
        renderer.setSize(widthW, heightH);
      };
      window.addEventListener('resize', handleResize);

      const startTime = performance.now();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const t = (performance.now() - startTime) * 0.001;

        if (!prefersReducedMotion) {
          const positions = geometry.attributes.position;
          for (let i = 0; i < count; i++) {
            const px = positions.getX(i);
            const pz = positions.getZ(i);
            const py = Math.sin(px * 1.2 + t * 2) * 0.35 + Math.cos(pz * 1.2 + t * 1.5) * 0.35;
            positions.setY(i, py);
          }
          positions.needsUpdate = true;

          // Position peak beacons on undulating waves
          peakBeacons[0].position.set(-1.2, Math.sin(-1.2 * 1.2 + t * 2) * 0.35 - 0.25, -1.0);
          peakBeacons[1].position.set(1.2, Math.sin(1.2 * 1.2 + t * 2) * 0.35 - 0.25, 0.8);
          peakBeacons[2].position.set(0, Math.sin(t * 2) * 0.35 - 0.25, 0);
          peakBeacons[3].position.set(-0.8, Math.sin(-0.8 * 1.2 + t * 2) * 0.35 - 0.25, 1.2);

          meshGroup.rotation.y = t * 0.15;
          camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
          camera.position.y += (3.5 - mouseY * 1.0 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Data mesh 3D scene error:', e);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize) window.removeEventListener('resize', handleResize);

      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (renderer) renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[180px] sm:h-[220px] flex items-center justify-center pointer-events-auto ${className}`}
      aria-label="3D Topographic Data Analytics Terrain"
    />
  );
};

export default DataMesh3D;
