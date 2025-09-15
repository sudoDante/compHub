import * as element from "../../modules/elements.js"

export class listMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.dom.innerHTML = `
            <div id="container" class="container">
               <div id="titleBox" class="titleBox">
                    <div id="title" class="title"></div>
               </div> 
               <div id="menu" class="menu"></div>
            </div>
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            :host {
                box-sizing: border-box;
                padding: 0;
                margin: 0;

                --transition: 140ms;
                --backDark: rgba(0, 0, 0, 0.8);
                --enphasis: rgb(77, 130, 143);
            }

            .center {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .darkCrystal {
                backdrop-filter: blur(4px);
            }

            .container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: var(--backDark);
                padding: 10px;

                .titleBox {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    width: 100%;
                    height: 50px;
                    background-color: var(--enphasis);
                    margin-bottom: 20px;

                    .title {
                        width: auto;
                        height: auto;
                        color: whitesmoke;
                        font-size: 18px;
                        font-family: "anta";
                        padding: 4px;
                    }
                }

                .menu {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    overflow-y: auto;

                    .bar {
                        width: 90%;
                        height: 1px;
                        border: none;
                        background-color: rgba(255, 255, 255, 0.1);
                        margin: 6px;
                    }

                    .option {
                        position: relative;
                        width: 100%;
                        height: 36px;
                        cursor: pointer;
                        border-radius: 4px;
                        transition: var(--transition);

                        &:has(input:not(:checked):hover) .nameBox {
                            background-color: rgba(255, 255, 255, 0.8);
                            color: rgb(28, 28, 28);
                            transition: var(--transition);
                        }

                        &:has(input:checked) .nameBox {
                            background-color: var(--enphasis);
                            color: whitesmoke;
                            transition: var(--transition);
                            font-style: italic;

                            .expand {
                                flex: 1;

                                .rotate {
                                    animation: 4s rotate infinite linear;
                                }
                            }
                        }

                        .nameBox {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                            text-indent: 4px;
                            color: whitesmoke;
                            border-radius: 4px;
                            padding: 0 10px;

                            .expand {
                                display: flex;
                                align-items: center;
                                width: 0px;
                                height: 100%;
                                transition: var(--transition);
                                overflow: hidden;

                                .rotate {
                                    margin-left: 10px;
                                    height: 14px;
                                    aspect-ratio: 1/1;
                                    border: 3px dashed whitesmoke;
                                }
                            }

                            .name {
                                width: auto;
                                height: auto;
                                padding-right: 10px;
                            }
                        }

                        input[type="radio"] {
                            position: absolute;
                            z-index: 10;
                            appearance: none;
                            width: 100%;
                            height: 100%;
                            cursor: pointer;
                        }
                    }
                }
            } 
                
            @keyframes rotate {
                0% {transform: rotate(0deg);}
                50% {transform: rotate(180deg)}
                100% {transform: rotate(360deg);}
            }
        `
    }

    connectedCallback() {

        const getConfig = () => {
            const list = this["list"]
            const menuMode = this.getAttribute("menuMode") && this.getAttribute("menuMode") === "secondary" ? "secondary" : "primary"
            const title = this.getAttribute("title") ? this.getAttribute("title") : "Default Title"

            return {
                "list": list,
                "menuMode": menuMode,
                "title": title
            }
        }

        const setMenu = async (conf) => {
            console.log(conf)
            const menuMode = conf.menuMode
            const list = conf.list
            const title = conf.title

            const titleElement = this.dom.querySelector("#title")
            const menuElement = this.dom.querySelector("#menu")

            list.forEach((item, num) => {
                const menuOption = element.add(menuElement, "label", null, "option center")
                const nameBox = element.add(menuOption, "span", null, "nameBox")
                const expand = element.add(nameBox, "div", null, "expand")
                const name = element.add(nameBox, "div", null, "name")
                name.textContent = list[num]

                const radio = element.add(menuOption, "input", null, null, { type: "radio", name: "opt", pos: num })

                element.add(menuElement, "hr", null, "bar")
                if (num === 0) radio.checked = true

                menuMode === "secondary"
                    ? element.add(expand, "div", null, "rotate")
                    : null
            })
            titleElement.textContent = title.toUpperCase()
            return Array.from(menuElement.querySelectorAll("input[type='radio']"))
        }

        const setListeners = async (array, conf) => {
            const transition = parseFloat(getComputedStyle(this).getPropertyValue("--transition"))

            array.forEach(item => {
                console.log(item)
                item.addEventListener("click", () => document.dispatchEvent(
                    new CustomEvent(`listMenu_${conf.menuMode}`, {
                        detail: {
                            pos: item.getAttribute("pos"),
                            time: transition
                        }
                    })
                ))
            })
        }

        const main = async () => {
            const conf = getConfig()
            const options = await setMenu(conf)
            setListeners(options, conf)
        }

        main()
    }
}
customElements.define("list-menu", listMenu)