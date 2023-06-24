import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Vector3, Euler, Quaternion, Matrix4, AnimationMixer } from "three";

import useKeyboard from "./useKeyboard";

import useFollowCam from "./useFollowCam";

export default function Character({ position, rotation }) {
  const { scene, animations } = useGLTF("/character.glb");

  const { camera, scene: threeScene } = useThree();
  const ref = useRef();
  // Create an AnimationMixer, and get the list of AnimationClip instances
  const mixer = new THREE.AnimationMixer(scene);
  const clips = animations;

  mixer.clipAction(clips[0]).loop = THREE.LoopRepeat;

  mixer.clipAction(clips[0]).play();

  const activeAnimation = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    dance: false,
  };

  const currentPosition = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3();
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
  const acceleration = new THREE.Vector3(1, 0.125, 100.0);
  const velocity = new THREE.Vector3(0, 0, 0);

  // Controll Input
  const handleKeyPress = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = true;

        break;

      case 65: //a
        activeAnimation.left = true;

        break;

      case 83: //s
        activeAnimation.backward = true;

        break;

      case 68: // d
        activeAnimation.right = true;

        break;

      case 69: //e dance
        activeAnimation.dance = true;

        break;
      case 16: // shift
        activeAnimation.run = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = false;
        break;

      case 65: //a
        activeAnimation.left = false;
        break;

      case 83: //s
        activeAnimation.backward = false;
        break;

      case 68: // d
        activeAnimation.right = false;
        break;

      case 69: //e dance
        activeAnimation.dance = false;
        break;

      case 16: // shift
        activeAnimation.run = false;
        break;
    }
  }, []);

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(0, 2, -3);
    idealOffset.applyQuaternion(ref.current.quaternion);
    idealOffset.add(ref.current.position);
    return idealOffset;
  };

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(0, 5, 30);
    idealLookat.applyQuaternion(ref.current.quaternion);
    idealLookat.add(ref.current.position);
    return idealLookat;
  };

  function updateCameraTarget(delta) {
    const idealOffset = calculateIdealOffset();
    const idealLookat = calculateIdealLookat();

    const t = 1.0 - Math.pow(0.001, delta);

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookat, t);

    camera.position.copy(currentPosition);
  }

  // movement
  const characterState = (delta) => {
    const newVelocity = velocity;
    const frameDecceleration = new THREE.Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

    newVelocity.add(frameDecceleration);

    const controlObject = ref.current;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();
    // if (activeAnimation.run) {
    //   acc.multiplyScalar(2.0);
    // }

    // if (currAction === animations["dance"].clip) {
    //   acc.multiplyScalar(0.0);
    // }

    if (activeAnimation.forward) {
      newVelocity.z += acc.z * delta * 0.5;
      mixer?.update(delta * 2);
      console.log(ref.current.position);
    }
    if (activeAnimation.backward) {
      newVelocity.z -= acc.z * delta * 0.5;
      mixer?.update(delta * 2);
      console.log(ref.current.position);
    }
    if (activeAnimation.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (activeAnimation.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(newVelocity.x * delta);
    forward.multiplyScalar(newVelocity.z * delta);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    ref.current.position.copy(controlObject.position);
    updateCameraTarget(delta);
  };

  useFrame((state, delta) => {
    characterState(delta * 0.4);
    const idealLookat = calculateIdealLookat();

    state.camera.lookAt(idealLookat);
    state.camera.updateProjectionMatrix();

    //addings bounds
    if (ref.current.position.z < -26) {
      ref.current.position.z = -26;
    } else if (ref.current.position.z > 10) {
      ref.current.position.z = 10;
    }
    if (ref.current.position.x > 34) {
      ref.current.position.x = 34;
    } else if (ref.current.position.x < -9) {
      ref.current.position.x = -9;
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);

      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return (
    <group>
      <primitive ref={ref} object={scene} position={[0, -1, 0]} scale={0.01} />
    </group>
  );
}
