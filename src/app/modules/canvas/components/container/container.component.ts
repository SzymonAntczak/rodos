import {
  Component,
  HostListener,
  ViewChild,
  effect,
  inject,
  type ElementRef,
} from '@angular/core';
import * as THREE from 'three';
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

  private scene?: THREE.Scene;
  private readonly material = new THREE.MeshToonMaterial();
  private readonly ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  private readonly pointLight = new THREE.PointLight(0xffffff, 0.5);
  private readonly box = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    this.material,
  );
  private readonly torus = new THREE.Mesh(
    new THREE.TorusGeometry(5, 1.5, 16, 100),
    this.material,
  );
  private readonly clock = new THREE.Clock();

  private canvasSize?: { width: number; height: number };
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

      if (!this.scene) {
        this.scene = new THREE.Scene();

        this.initScene(this.scene, width, height);
        return;
      }

      this.updateSceneSize(this.scene, width, height);
    });
  }

  initScene(scene: THREE.Scene, width: number, height: number) {
    this.canvasSize = { width, height };

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasSize.width / this.canvasSize.height,
      0.001,
      1000,
    );

    if (!this.canvas) throw new Error('Canvas not found');

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
    });

    scene.add(this.ambientLight);

    this.pointLight.position.x = 2;
    this.pointLight.position.y = 2;
    this.pointLight.position.z = 2;

    scene.add(this.pointLight);
    scene.add(this.torus, this.box);

    this.camera.position.z = 30;
    scene.add(this.camera);

    this.renderer.setClearColor(0xe232222, 1);
    this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);

    const animate = () => {
      const elapsedTime = this.clock.getElapsedTime();

      this.box.rotation.x = elapsedTime;
      this.box.rotation.y = elapsedTime;
      this.box.rotation.z = elapsedTime;

      this.torus.rotation.x = -elapsedTime;
      this.torus.rotation.y = -elapsedTime;
      this.torus.rotation.z = -elapsedTime;

      if (!this.camera || !this.renderer) return;

      this.renderer.render(scene, this.camera);

      window.requestAnimationFrame(animate);
    };

    animate();
  }

  private updateSceneSize(
    scene: THREE.Scene,
    width: number,
    height: number,
  ): void {
    if (!this.canvasSize || !width || !height) return;

    this.canvasSize.width = width;
    this.canvasSize.height = height;

    if (!this.camera) return;

    this.camera.aspect = this.canvasSize.width / this.canvasSize.height;
    this.camera.updateProjectionMatrix();

    if (!this.renderer) return;

    this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);
    this.renderer.render(scene, this.camera);
  }
}
