import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Floating3DBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // Floating Geometric 3D Objects
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    interface FloatingItem {
      mesh: THREE.Object3D;
      rotSpeedX: number;
      rotSpeedY: number;
      floatSpeed: number;
      initialY: number;
      phase: number;
    }

    const items: FloatingItem[] = [];

    // Palette of subtle translucent materials
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    });

    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.22,
    });

    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.2,
    });

    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      metalness: 0.3,
      transparent: true,
      opacity: 0.2,
    });

    const geometries = [
      new THREE.IcosahedronGeometry(0.8, 0),
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.TorusGeometry(0.65, 0.2, 12, 24),
      new THREE.DodecahedronGeometry(0.65, 0),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
    ];

    const materials = [emeraldMat, cyanMat, amberMat, purpleMat];

    // Create 14 floating 3D objects spread out across background
    const positions = [
      [-12, 7, -4],
      [13, 6, -5],
      [-14, -4, -6],
      [12, -6, -4],
      [-8, 11, -8],
      [8, 10, -7],
      [-15, 0, -5],
      [14, 1, -6],
      [-6, -9, -5],
      [7, -8, -6],
      [-11, 4, -3],
      [10, 4, -3],
      [0, 12, -9],
      [0, -12, -9],
    ];

    positions.forEach((pos, idx) => {
      const geo = geometries[idx % geometries.length];
      const mat = materials[idx % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(pos[0], pos[1], pos[2]);
      floatingGroup.add(mesh);

      // Add a subtle wireframe outline
      const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.15,
        })
      );
      mesh.add(wireframe);

      items.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: 0.8 + Math.random() * 0.8,
        initialY: pos[1],
        phase: Math.random() * Math.PI * 2,
      });
    });

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      floatingGroup.position.x = currentMouseX;
      floatingGroup.position.y = -currentMouseY;

      // Animate each floating 3D object
      items.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y = item.initialY + Math.sin(time * item.floatSpeed + item.phase) * 0.45;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80"
    />
  );
};
