import * as element from "../../modules/elements.js"

export class emptyComponent extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = document.createElement("div")
        this.container.classList.add("container")
        this.container.innerHTML = `
            <div class="box">
                <div class="centerBox">
                    <div class="equalizer">
                        <div class="barsBox"></div>
                        <div class="text">TEST MODE</div>
                    </div>
                    <div class="icon">
                        <div class="heart">favorite</div>
                    </div>
                </div>
            </div>            
        `
        this.dom.appendChild(this.container)

        const style = document.createElement("style")
        this.dom.appendChild(style)
        style.textContent = `
            :host {
                width: 100%;
                height: 100%;
            }

            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.4);

                .box {
                    width: var(--boxWidth);
                    height: var(--boxHeight);
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 8px;
                    padding: var(--boxPadding);

                    .centerBox {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 100%;

                        .equalizer {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 640px;
                            height: 100%;
                            outline: 1px solid rgba(100, 100, 100, 1);
                            border-radius: 6px;
                            box-shadow: inset 2px 2px 4px rgb(28, 28, 28);
                            overflow: hidden;

                            .barsBox {
                                display: flex;
                                align-items: end;
                                width: 100%;
                                height: 100%;

                                .bar {
                                    width: 8px; 
                                    height: 100%;
                                    border: 1px solid rgba(65, 65, 65, 1);
                                    background: rgba(34, 34, 34, 1);
                                    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%);
                                }
                            }
                            
                            .text {
                                position: absolute;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 90%;
                                height: fit-content;
                                font-family: "Baumans";
                                font-size: 20px;
                                font-weight: bolder;
                                text-indent: 20px;
                                border-radius: 4px;
                                color: whitesmoke;
                                letter-spacing: 16px;
                                text-indent: 16px;
                            }
                        }

                        .icon {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 56px;
                            aspect-ratio: 1/1;
                            outline: 1px solid rgba(100, 100, 100, 1);
                            border-radius: 5px;
                            box-shadow: 2px 2px 6px black;

                            .heart {
                                font-family: "material symbols outlined";
                                font-size: 26px;
                                font-weight: bolder;
                                color: rgba(34, 34, 34, 1);
                                transform: scale(1);
                            }
                        }
                    }
                }
            }

            @keyframes wave {
                0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%);}
                50% { clip-path: polygon(0 100%, 100% 100%, 100% 0, 0 0);}
                100% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%); }
            }

            @keyframes beat {
                0%   { transform: scale(1); }
                2%  { transform: scale(1.6); }
                4%  { transform: scale(1); }
                6%  { transform: scale(1.6); }
                8%  { transform: scale(1); }
                100% { transform: scale(1); }
            }
        `

        this.pause = new Proxy({ state: false }, {
            set: (target, prop, value) => {
                target[prop] = value

                if (prop === "state") this.pauseResumeAnimation()
                return true
            }
        })
    }

    connectedCallback() {
        const startDelay = "1000ms"
        const boxWidth = "720px"
        const boxHeight = "48px"
        const boxPadding = "8px"
        const text = "Test Mode"
        const animationTime = "6500ms"
        const animationDelay = "80ms"

        const css = {
            "startDelay": startDelay,
            "boxWidth": boxWidth,
            "boxHeight": boxHeight,
            "boxPadding": boxPadding,
            "test": "Test Mode",
            "animationTime": animationTime,
            "animationDelay": animationDelay
        }

        const applyConfCss = (css) => {
            Object.entries(css).forEach(([key, value]) => {
                this.style.setProperty(`--${key}`, value)
            })
        }

        const createBars = async () => {
            const equalizer = this.dom.querySelector(".equalizer")
            const eqWidth = equalizer.offsetWidth
            const barsNum = eqWidth / 8

            const barsBox = this.dom.querySelector(".barsBox")
            for (let i = 0; i < barsNum; i++) {
                const bar = element.add(barsBox, "div", null, "bar")
                const textBar = element.add(bar, "div", null)
            }
        }

        const startAnimations = () => {
            const bars = Array.from(this.dom.querySelectorAll(".bar"))

            for (let i = 0; i < bars.length; i++) {
                bars[i].style.animation = `wave ${parseFloat(animationTime)}ms infinite ease-in-out ${i * parseFloat(animationDelay)}ms`
            }
        }

        const startBeats = () => {
            const heart = this.dom.querySelector(".heart")
            heart.style.animation = "beat 12s infinite ease-in-out 5s"
        }

        this.pauseResumeAnimation = () => {
            const heart = this.dom.querySelector(".heart")
            const bars = Array.from(this.dom.querySelectorAll(".bar"))

            if (this.pause.state === true) {
                bars.forEach(item => item.style.animationPlayState = "paused")
                heart.style.animationPlayState = "paused"
            }
            if (this.pause.state === false) {
                bars.forEach(item => item.style.animationPlayState = "running")
                heart.style.animationPlayState = "running"
            }
        }

        const main = async () => {
            applyConfCss(css)
            await createBars()



            await new Promise(resolve => setTimeout(resolve, parseFloat(startDelay)))
            startAnimations()
            startBeats()

            document.dispatchEvent(new CustomEvent("componentLoad", { detail: this }))
        }

        main()
    }
}
customElements.define("empty-component", emptyComponent)