
import { gsap } from "gsap";
import Link from "next/link";
import { Component, ReactElement } from "react";
import { Loading } from "src/components/loading";
import { ScrollContents } from "src/components/scrollContents/desc";
import WebGLMain from "src/lib/webgl/projects/paper/main";
import styles from "src/styles/index.module.scss";

interface Props { }
interface State {
    bg: boolean;
    hasScrolled: boolean;
    isLoaded: boolean;
}

export default class Index extends Component<Props, State> {

    public state: State = {
        bg: false,
        hasScrolled: false,
        isLoaded: false
    };
    private _webgl: WebGLMain | null = null;
    private _container: HTMLDivElement | null = null;
    private _lastProgress: number = 0;
    private _progress: number = 0;
    private _tween: GSAPTimeline | null = null;
    private _ws: WebSocket | null = null;

    constructor(props: Props) {
        super(props);
    }

    public componentDidMount(): void {
        // window.scrollTo(0, 0);
        // document.body.style.overflowY = "hidden";
        this._ws = new WebSocket("ws://127.0.0.1:10000");
        this._ws.addEventListener("open", e => {
            console.log("connected");
        });

        this._ws.addEventListener("message", e => {
            console.log("msg");
        });
    }

    componentWillUnmount(): void {
        // this._webgl?.deInit();
        // this._webgl = null
    }

    private _onClickBtn = (e: any) => {
        this._ws?.send("hoge");
    };

    private _onRefCanvas = (node: HTMLCanvasElement): void => {
        if (!node) return;
        this._webgl = new WebGLMain(node);
        this._webgl.init();

        if (this._tween != null) this._tween.kill();
        this._tween = gsap.timeline({ repeat: -1, onUpdate: () => this._onChangeProgress(this._progress) })
            .to(this, { _progress: 2, duration: 20, ease: "linear" })
            .to(this, { _progress: -1, duration: 20, ease: "linear" })
            .to(this, { _progress: 2, duration: 20, ease: "linear" });
    };

    private _onChangeProgress = (prog: number) => {

        if (!this._webgl || !this._container) return;

        if (
            this._lastProgress < .05 && prog >= .05 ||
            this._lastProgress > .95 && prog <= .95

        ) {
            this._webgl!.spread();
            this.setState({ bg: true });
        } else if (
            this._lastProgress < .95 && prog >= .95 ||
            this._lastProgress > .05 && prog <= .05
        ) {
            this._webgl!.fold();
            this.setState({ bg: false });
        }

        this._webgl.setCaos(prog);

        this._lastProgress = prog;
    };

    /**
     *
     */
    private _onLoad = () => {
        // document.body.style.overflowY = "scroll";
    };

    public render(): ReactElement {
        const { bg, hasScrolled } = this.state;
        return (
            <div
                className={`${styles.container} ${styles.bg_black}`}
                ref={node => this._container = node}
            >
                <div style={{
                    height: "100vh",
                    width: "800px",
                    maxWidth: "80vw",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <h1>作品ステートメント印刷</h1>
                    <p>
                        ボタンを押すと右側のプリンタからステートメントが印刷されます。印刷されたレシートは持ち帰っていただいて構いません。
                        <br />
                        <br />
                        左側のプリンタからは作品のステートメントが無限に生成されます。高い場所の文章を読む場合は、必要に応じて2階に上ってお読みください。
                    </p>
                    <br />
                    <button
                        style={{ height: "100px", fontSize: "2rem" }}
                        onClick={this._onClickBtn}
                    >印刷</button>
                </div>
                <div>
                    <ScrollContents />
                </div>
                <div style={{ height: "100vh" }}></div>
                <canvas ref={this._onRefCanvas}></canvas>
                {/* <Loading
                    onLoad={this._onLoad}
                /> */}
            </div>
        );
    }
}

