import {
  Component,
  HostListener,
  ViewChild,
  type ElementRef,
  type OnInit,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  private readonly scene = new THREE.Scene();
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

  @ViewChild('boardContainer', { static: true })
  boardContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.canvasSize || !this.camera || !this.renderer) return;

    this.canvasSize.width = this.boardContainer.nativeElement.offsetWidth;
    this.canvasSize.height = this.boardContainer.nativeElement.offsetHeight;

    this.camera.aspect = this.canvasSize.width / this.canvasSize.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);
    this.renderer.render(this.scene, this.camera);
  }

  ngOnInit() {
    this.canvasSize = {
      width: this.boardContainer.nativeElement.offsetWidth,
      height: this.boardContainer.nativeElement.offsetHeight,
    };

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasSize.width / this.canvasSize.height,
      0.001,
      1000,
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
    });

    this.scene.add(this.ambientLight);

    this.pointLight.position.x = 2;
    this.pointLight.position.y = 2;
    this.pointLight.position.z = 2;

    this.scene.add(this.pointLight);
    this.scene.add(this.torus, this.box);

    this.camera.position.z = 30;
    this.scene.add(this.camera);

    this.renderer.setClearColor(0xe232222, 1);
    this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);

    const animate = () => {
      if (!this.camera || !this.renderer) return;

      const elapsedTime = this.clock.getElapsedTime();

      this.box.rotation.x = elapsedTime;
      this.box.rotation.y = elapsedTime;
      this.box.rotation.z = elapsedTime;

      this.torus.rotation.x = -elapsedTime;
      this.torus.rotation.y = -elapsedTime;
      this.torus.rotation.z = -elapsedTime;

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(animate);
    };

    animate();
  }
}
