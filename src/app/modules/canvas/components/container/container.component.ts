import {
  Component,
  HostListener,
  ViewChild,
  effect,
  inject,
  type ElementRef,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BoardComponent } from '../../../shared/components/board/board.component';
import { BoardService } from './../../../shared/services/board.service';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './container.component.html',
})
export class ContainerComponent {
  private readonly boardService = inject(BoardService);

  private scene = new THREE.Scene();
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;

  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.canvas) throw new Error('Canvas not found');

    this.canvas.nativeElement.style.width = '0';
    this.canvas.nativeElement.style.height = '0';
  }

  constructor() {
    effect(() => {
      const { width, height } = this.boardService.size();

      if (!width || !height) return;

      if (!this.renderer) {
        this.scene = new THREE.Scene();

        this.initScene(width, height);
        return;
      }

      this.updateSceneSize(width, height);
    });
  }

  initScene(width: number, height: number) {
    if (!this.canvas) throw new Error('Canvas not found');

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
    });
    this.renderer.setSize(width, height);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.001, 1000);
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);

    this.camera.position.set(1, 2, 5);
    orbit.update();

    this.addHelpers();
    const box = this.addBox();
    this.addSphere();
    this.addPlane();

    const animate = () => {
      if (!this.renderer || !this.camera) return;

      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    };

    this.renderer.setAnimationLoop(animate);
  }

  private addHelpers(): void {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);
  }

  private addBox(): THREE.Mesh {
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    this.scene.add(box);

    return box;
  }

  private addPlane(): THREE.Mesh {
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = Math.PI / 2;

    this.scene.add(plane);

    return plane;
  }

  private addSphere(): THREE.Mesh {
    const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.set(0, 2, 0);

    this.scene.add(sphere);

    return sphere;
  }

  private updateSceneSize(width: number, height: number): void {
    if (!this.camera) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    if (!this.renderer) return;

    this.renderer.setSize(width, height);
    this.renderer.render(this.scene, this.camera);
  }
}
