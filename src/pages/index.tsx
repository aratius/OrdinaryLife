
import Link from "next/link";
import { Component, ReactElement } from "react";
import { ScrollContents } from "src/components/scrollContents/desc";
import WebGLMain from "src/lib/webgl/projects/paper/main";
import styles from "src/styles/index.module.scss"

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
            <div className={`${styles.container} ${styles.bg_black}`}>
                <ScrollContents />
                <Link href="/system" className={styles.link}>{"> システム説明"}</Link>
                <canvas ref={this._onRefCanvas}></canvas>
            </div>
        )
    }
}

