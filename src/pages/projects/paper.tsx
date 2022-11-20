
import { Component, ReactElement } from "react";
import WebGLMain from "src/lib/webgl/projects/paper/main";
import styles from "src/styles/projects/paper.module.scss"

interface Props {}
interface State {}

export default class Index extends Component {

    public state: State = {}
	private _webgl: WebGLMain | null = null
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    public componentDidMount(): void {
    }

	componentWillUnmount(): void {
		// this._webgl?.deInit()
		this._webgl = null
	}

	private _onRefCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this._webgl = new WebGLMain(node)
		this._webgl.init()
	}

    public render(): ReactElement {
        return (
            <div className={styles.container}>
                <canvas ref={this._onRefCanvas}></canvas>
            </div>
        )
    }
}

