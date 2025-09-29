import * as element from "../../modules/elements.js"

export class configMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.container = element.add(this.dom, "div", null, "container")

        const style = element.add(this.dom, "style", null, null)
        style.textContent += `
            :host {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }

            .container {
                width: 100%;
                height: 100%;
                background-color: var(--backColor);
                transition: var(--transition);
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            const backColor = this.getAttribute("back") ? this.getAttribute("back") : "red"

            return {
                "backColor": backColor,
            }
        }

        const applyConfCss = (conf) => {
            this.style.setProperty("--backColor", conf.backColor)
        }

        const moveContainer = () => {
            const parent = this.parentElement
            parent.style.right = 0
        }

        const main = async () => {
            const jsonConf = JSON.parse(this.getAttribute("config"))
            const conf = await getConfig()
            console.log("conf", conf)
            
            applyConfCss(conf)


            /* ultimo paso */
            moveContainer()
        }

        main()
    }
}
customElements.define("config-menu", configMenu)