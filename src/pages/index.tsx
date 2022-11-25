
import Link from "next/link";
import { Component, ReactElement, SyntheticEvent } from "react";
import { Loading } from "src/components/loading";
import { ScrollContents } from "src/components/scrollContents/desc";
import WebGLMain from "src/lib/webgl/projects/paper/main";
import styles from "src/styles/index.module.scss"

import { VoiceForm } from "src/components/voiceForm";
import { ScannerInput } from "src/components/scannerInput";
import { WsInput } from "src/components/wsInput";

interface Props {}
interface State {
    bg: boolean;
    hasScrolled: boolean;
    isLoaded: boolean
}

export default class Index extends Component<Props, State> {

    public state: State = {
        bg: false,
        hasScrolled: false,
        isLoaded: false
    }
	private _webgl: WebGLMain | null = null
    private _container: HTMLDivElement|null = null
    private _lastProgress: number = 0

    constructor(props: Props) {
        super(props)
    }

    public componentDidMount(): void {
        window.addEventListener("scroll", this._onScroll)
        window.scrollTo(0, 0)
        document.body.style.overflowY = "hidden"
    }

	componentWillUnmount(): void {
		this._webgl?.deInit()
		// this._webgl = null
	}

	private _onRefCanvas = (node: HTMLCanvasElement): void => {
		if(!node) return
		this._webgl = new WebGLMain(node)
		this._webgl.init()
	}

    private _onScroll = (e: Event) => {

        if(!this._webgl || !this._container) return
        const rect = this._container?.getBoundingClientRect()
        const progress = -(rect!.top) / (rect!.height - innerHeight)

        if(
            this._lastProgress < .05 && progress >= .05 ||
            this._lastProgress > .95 && progress <= .95

        ) {
            this._webgl!.spread()
            this.setState({bg: true})
        } else if(
            this._lastProgress < .95 && progress >= .95 ||
            this._lastProgress > .05 && progress <= .05
        ) {
            this._webgl!.fold()
            this.setState({bg: false})
        }

        this._webgl.setCaos(progress)

        if(!this.state.hasScrolled) this.setState({ hasScrolled: true })

        this._lastProgress = progress
    }

    /**
     *
     */
    private _onLoad = () => {
        document.body.style.overflowY = "scroll"
    }

    public render(): ReactElement {
        const { bg, hasScrolled } = this.state
        return (
            <div
                className={`${styles.container} ${bg ? styles.bg_black : ""}`}
                ref={node => this._container = node}
            >
                <div style={{height:"100vh"}}></div>
                <div>
                    <ScrollContents />
                    <Link href="/system" className={styles.link}>{"システム概要"}</Link>
                    <br/>
                    <br/>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSchgIZ4Gbo1d1WI88br2phwtBcuIAKAkaBaeHlFJrowRXSjTw/viewform?usp=sf_link" className={styles.link}>{"フィードバック"}</a>
                </div>
                <div style={{height:"100vh"}}></div>
                <div
                    className={styles.scroll_notifier}
                    style={{opacity: hasScrolled ? 0 : 1}}
                ></div>
                <canvas ref={this._onRefCanvas}></canvas>
                <Loading
                    onLoad={this._onLoad}
                />
            </div>
        )
    }
}

