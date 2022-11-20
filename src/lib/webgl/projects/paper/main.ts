
import { BoxBufferGeometry, DirectionalLight, LinearFilter, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneBufferGeometry, ShaderMaterial, Uniform, WebGLRenderTarget } from "three";
import WebGLBase from "src/lib/webgl/common/main";
import { loadTexture } from "../../common/utils";
import PaperMaterial from "./material";
import gsap from "gsap";

import { EffectComposer, Pass } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SavePass } from "three/examples/jsm/postprocessing/SavePass";
import { BlendShader } from "three/examples/jsm/shaders/BlendShader";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

const PAPER_NUM = 10;

export default class Main extends WebGLBase {

	public _projectName: string = "paper";
	private _composer: EffectComposer | null = null;
	private _bg: Mesh<BoxBufferGeometry, MeshStandardMaterial> | null = null;
	private _meshes: Mesh<BoxBufferGeometry, PaperMaterial>[] = [];
	private _timeline: (GSAPTimeline | null) = null;
	private _caosTimeline: (GSAPTimeline | null) = null;
	private _blendPass: ShaderPass | null = null;
	private _savePass: SavePass | null = null;
	private __blurCaos: number = 0;
	private __blurSpread: number = 0;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas, {
			camera: "perspective"
		});
	}

	private set _blurCaos(val: number) {
		this.__blurCaos = val;
		if (this._blendPass) this._blendPass!.uniforms["mixRatio"].value = Math.max(this.__blurCaos, this.__blurSpread);
	}

	private get _blurCaos(): number {
		return this.__blurCaos;
	}

	private set _blurSpread(val: number) {
		this.__blurSpread = val;
		if (this._blendPass) this._blendPass!.uniforms["mixRatio"].value = Math.max(this.__blurCaos, this.__blurSpread);
	}

	private get _blurSpread(): number {
		return this.__blurSpread;
	}

	protected async _initChild(): Promise<void> {
		for (let x = 0; x < PAPER_NUM; x++) {
			for (let z = 0; z < 1; z++) {
				const mesh = await this._createPaper();
				mesh.position.setX((x - PAPER_NUM / 2) * 1);
				mesh.position.setZ(-(z + 1) * 1);
				this._meshes.push(mesh);
				this._scene?.add(mesh);
			}
		}

		const bgGeo = new BoxBufferGeometry(1, 1, .001);
		const bgMat = new MeshStandardMaterial({ color: 0xffffff, metalness: .8, roughness: 1 });
		const bg = new Mesh(bgGeo, bgMat);
		bg.scale.multiplyScalar(100);
		bg.position.setZ(-2);
		bg.receiveShadow = true;
		this._scene?.add(bg);
		this._bg = bg;

		const dirLight = new DirectionalLight(0xffffff, .5);
		dirLight.position.set(0, 3, 10);
		dirLight.lookAt(0, 0, 0);
		dirLight.castShadow = true;
		dirLight.shadow.mapSize.width = 2048 * .5;
		dirLight.shadow.mapSize.height = 2048 * .5;
		dirLight.shadow.radius = 10;
		dirLight.shadow.blurSamples = 24;
		dirLight.shadow.camera.top = 10;
		dirLight.shadow.camera.bottom = -10;
		dirLight.shadow.camera.right = 10;
		dirLight.shadow.camera.left = -10;
		window.addEventListener("mousemove", (e) => {
			const x = (e.clientX - innerWidth / 2) / (innerWidth / 2) * 2;
			const y = -(e.clientY - innerHeight / 2) / (innerHeight / 2) * 2 + 3;
			gsap.to(dirLight.position, {
				x, y, duration: 1, onUpdate: () => {
					dirLight.lookAt(0, 0, 0);
				}
			});
		});

		this._scene?.add(dirLight);

		this._renderer!.shadowMap.enabled = true;
		this._camera?.position.set(0, 0, 10);

		this._composer = new EffectComposer(this._renderer!);
		const savePass = new SavePass(
			new WebGLRenderTarget(
				innerWidth,
				innerHeight,
				{
					minFilter: LinearFilter,
					magFilter: LinearFilter,
					stencilBuffer: false
				}
			)
		);
		this._savePass = savePass;

		const blendPass = new ShaderPass(BlendShader, "tDiffuse1");
		blendPass.uniforms["tDiffuse2"] = new Uniform(savePass.renderTarget.texture);
		blendPass.uniforms["mixRatio"] = new Uniform(.1);
		this._blendPass = blendPass;

		const outputPass = new ShaderPass(CopyShader);
		outputPass.renderToScreen = true;

		const fxaaPass = new ShaderPass(FXAAShader);
		fxaaPass.material.uniforms["resolution"].value.x = 1 / innerWidth * this._renderer!.getPixelRatio();
		fxaaPass.material.uniforms["resolution"].value.y = 1 / innerHeight * this._renderer!.getPixelRatio();

		const renderPass = new RenderPass(this._scene!, this._camera!);

		this._composer.addPass(renderPass);
		this._composer.addPass(blendPass);
		this._composer.addPass(savePass);
		this._composer.addPass(outputPass);
		this._composer.addPass(fxaaPass);

	}

	protected _deInitChild(): void {
		this._bg?.geometry.dispose();
		this._bg?.material.dispose();
		this._meshes.forEach(mesh => {
			mesh.geometry.dispose();
			mesh.material.dispose();
		});
		this._savePass?.renderTarget.texture.dispose();
		this._savePass?.renderTarget.dispose();
		this._renderer?.dispose();
		while (this._scene!.children.length > 0) {
			this._scene?.remove(this._scene.children[0]);
		}
	}

	protected _resizeChild(): void {

	}

	protected _updateChild(): void {
		this._composer?.render();
		this._meshes.forEach((mesh, i) => {
			const tOffset = Math.sin(i * 111.1) * 100;
			mesh.material.uniforms.uTime = new Uniform(this._elapsedTime + tOffset);
			(mesh.customDepthMaterial as ShaderMaterial).uniforms.uTime = new Uniform(this._elapsedTime + tOffset);
		});
	}

	/**
	 *
	 * @param value
	 */
	public setCaos(value: number): void {
		if (this._caosTimeline != null) this._caosTimeline.kill();
		this._caosTimeline = gsap.timeline();
		this._meshes.forEach((mesh, i) => {
			this._caosTimeline!.to(mesh.material.uniforms.uCaos, { value, duration: 1, ease: "sine.out" }, 0);
			this._caosTimeline!.to((mesh.customDepthMaterial as ShaderMaterial).uniforms.uCaos, { value, duration: 1, ease: "sine.out" }, 0);
			this._caosTimeline!.to(this, { _blurCaos: value * .7, duration: .1 }, 0);
		});
	}

	/**
	 *
	 */
	public spread(): void {
		if (this._timeline != null) this._timeline.kill();
		this._timeline = gsap.timeline();
		this._meshes.forEach((mesh, i) => {
			this._timeline!.to(mesh.position, { x: (i - PAPER_NUM / 2) * 1.5, z: -1, duration: 1, ease: "expo.out" }, 0);
			this._timeline!.to(mesh.material.uniforms.uTwist, { value: 2, duration: 1, ease: "sine.out" }, 0);
			this._timeline!.to((mesh.customDepthMaterial as ShaderMaterial).uniforms.uTwist, { value: 2, duration: 1, ease: "sine.out" }, 0);
			this._timeline!.add(
				gsap.timeline()
					.to(this, { _blurSpread: .7, duration: .1 })
					.to(this, { _blurSpread: 0.1, duration: 2, ease: "sine.inOut" })
				, 0);
		});
	}

	public fold(): void {
		if (this._timeline != null) this._timeline.kill();
		this._timeline = gsap.timeline();
		this._meshes.forEach((mesh, i) => {
			this._timeline!.to(mesh.position, { x: (i - PAPER_NUM / 2) * 1, z: 0, duration: 1, ease: "expo.out" }, 0);
			this._timeline!.to(mesh.material.uniforms.uTwist, { value: 0, duration: 2, ease: "back.out" }, 0);
			this._timeline!.to((mesh.customDepthMaterial as ShaderMaterial).uniforms.uTwist, { value: 0, duration: 2, ease: "back.out" }, 0);
			this._timeline!.add(
				gsap.timeline()
					.to(this, { _blurSpread: .7, duration: .1 })
					.to(this, { _blurSpread: 0.1, duration: 2, ease: "sine.inOut" })
				, 0);
		});
	}

	/**
	 *
	 */
	private async _createPaper(): Promise<Mesh<BoxBufferGeometry, PaperMaterial>> {
		const geo = new BoxBufferGeometry(1, 30, .01, 30, 300, 1);
		const mat = new PaperMaterial();
		const mesh = new Mesh(geo, mat);
		mesh.customDepthMaterial = mat.getDepthMaterial();
		mesh.castShadow = true;
		this._scene?.add(mesh);
		return mesh;
	}

}

