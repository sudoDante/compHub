/* ATTRIBUTES

title               title´s component descrition        required
close               add or not menu close bottom        no required - default false (boolean true/false)
button              botton transition type              no required - rotate / fall
list                composed object items list          required

    //   Array [] of objects {type, components}, where:
        // - type: the category or group description used for name category
        // - components: an array [] of objects {name, tag, path}
        // [ {type, components: [ {}, {}, {} ] } ]


titleBackColor      title background color              no required
back                component background color          no required 
color1              color hover & submenu items menu    no required 
color2              color selected items menu           no required
color3              color selected items submenu        no required
colorText1          color menu items text normal        no required
colorText2          color menu items text hover         no required
hostTransition      time transition for host            no required
*/

import * as element from "../../modules/elements.js"

export class listMenu extends HTMLElement {
    constructor() {
        super()

        this.dom = this.attachShadow({ mode: "open" })
        this.dom.innerHTML = `
            <div id="container" class="container maxH crystal">
                <div id="title" class="title maxW center"></div>
                <div id="menu" class="menu maxW scrollHidden"></div>
            </div>
        `

        const style = element.add(this.dom, "style", null, null)
        style.textContent = `
            :host {
                --titleHeight: 34px;
                --transition: 400ms;
                --optionHeight: 34px;
                --optionSubHeight: 34px;
                --radius: 4px;

                position: relative;
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font-family: "anta";
                color: var(--colorText2);
            }

            .center { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
            }
                
            .maxW { width: 100%; }
            .maxH { height: 100%; }
            .crystal { background-color: var(--back); backdrop-filter: blur(4px); }

            .scrollHidden { 
                overflow-y: auto; 
                scrollbar-width: none; 
                &::webkit-scrollbar { display: none; } 
            }

            .radius4 { border-radius: var(--radius); }

            .inputHidden { 
                position: absolute; 
                z-index: 10; 
                appearance: none; 
                cursor: pointer; 
            }

            .container {
                padding: 10px;

                .title {
                    height: var(--titleHeight);
                    font-size: 18px;
                    color: var(--color1);
                    margin-bottom: 10px
                }

                .menu {
                    height: calc(100% - var(--titleHeight) - 30px); 
                    font-size: 12px;
                    cursor: pointer;
                                        
                    & .option:has(input:not(:checked):hover) .nameBox {
                        background-color: var(--color1);

                        .name { color: var(--colorText1) };
                    }

                    & .option:has(input:checked) {
                        .nameBox { background-color: var(--color2); font-style: italic; }
                        .expand { flex: 1; }

                        .name { color: var(--colorText2) };
                    }

                    & .option:has(+.expandMenu .optionSub input:checked) .marker { 
                        background-color: var(--color2); 
                    }

                    .option {
                        position: relative;
                        width: calc(100% - 2px);
                        height: var(--optionHeight);
                        cursor: pointer;
                        transition: var(--transition);

                        .nameBox {
                            display: flex;
                            align-items: center;
                            height: 100%;

                            .marker {
                                height: 10px;
                                aspect-ratio: 1/1;
                                background-color: transparent;
                                margin-left: 5px;
                                margin-right: 10px;
                                border-radius: 2px;
                                transition: var(--transition);
                            }

                            .expand {
                                display: flex;
                                align-items: center;
                                width: 0px;
                                transition: var(--transition);
                            }

                            .name {
                                width: auto;
                                height: auto;
                                padding-right: 10px;
                                color: var(--colorText3);
                            }
                        }
                    }

                    .expandMenu {
                        width: calc(100% - 2px);
                        height: 0;
                        margin-top: 2px;
                        overflow-y: hidden;
                        transition: var(--transition);

                        .optionSub {
                            position: relative;
                            margin-left: 20%;
                            width: 80%;
                            height: var(--optionSubHeight);

                            &:hover:has(input:not(:checked)) .nameBoxSub { 
                                background-color: var(--color1); 

                                    .nameSub { color: var(--colorText1) };
                            }

                            &:has(input:checked) .nameBoxSub {
                                background: var(--color3); font-style: italic;

                                    .expandSub { flex: 1; overflow: visible; }
                                    .nameSub { color: var(--colorText2) };
                                }
                            }

                            .nameBoxSub {
                                display: flex;
                                align-items: center;
                                width: 100%;
                                height: calc(100% - 4px);
                                padding: 0 10px;

                                .expandSub {
                                    width: 0px;
                                    overflow: hidden;
                                    transition: var(--transition);
                                }

                                .nameSub {
                                    width: auto;
                                    height: auto;
                                    padding-right: 10px;
                                    color: var(--colorText3);
                                }
                            }
                        }
                    }

                    .bar {
                        display: flex;
                        width: 90%;
                        height: 1px;
                        margin-left: 5%;
                        border-bottom: 1px dotted var(--color1);
                        opacity: 0.2;
                    }
                }

                .closeBox {
                    --dinamicTop: calc(-100% + 20px);
                    --dinamicRotate: rotate(0deg);
                
                    position: relative;
                    display:flex;
                    flex-direction: column;
                    top: calc(-100% + 20px);
                    left: calc(100% + 20px);
                    width: var(--titleHeight);
                    aspect-ratio: 1/1;
                    transition: 600ms ease-in-out;

                    &:has(input:not(:checked)) {
                        top: var(--dinamicTop);
                        transform: var(--dinamicRotate);
                    }

                    .line {
                        width: 40%;
                        height: 1px;
                        border-radius 50%;
                        background-color: var(--color1);
                        margin: 2px;
                    }
                }
            } 
        `
    }

    connectedCallback() {

        const menu = this.dom.querySelector("#menu")

        const getConfig = () => {
            const list = this["list"]
            const title = this.getAttribute("title") ? this.getAttribute("title") : "Default Title"
            const titleBack = this.getAttribute("titleBack") ? this.getAttribute("titleBack") : "rgba(230, 230, 230, 1)"
            const color1 = this.getAttribute("color1") ? this.getAttribute("color1") : "rgba(221, 221, 221, 1)"
            const color2 = this.getAttribute("color2") ? this.getAttribute("color2") : "rgba(106, 161, 165, 1)"
            const color3 = this.getAttribute("color3") ? this.getAttribute("color3") : "rgba(38, 157, 165, 1)"
            const colorText1 = this.getAttribute("colorText1") ? this.getAttribute("colorText1") : "rgb(80, 80, 80)"
            const colorText2 = this.getAttribute("colorText2") ? this.getAttribute("colorText2") : "rgba(240, 240, 240, 1)"
            const colorText3 = this.getAttribute("colorText3") ? this.getAttribute("colorText3") : "rgba(160, 160, 160, 1)"
            const back = this.getAttribute("back") ? this.getAttribute("back") : "rgba(0, 0, 0, 1)"
            const close = this.getAttribute("close") && this.getAttribute("close") === "true" ? true : false
            const hostTransition = this.getAttribute("hostTransition") ? this.getAttribute("hostTransition") : "2s"
            const button = this.getAttribute("button") ? this.getAttribute("button") : null

            return {
                "list": list,
                "title": title,
                "titleBack": titleBack,
                "back": back,
                "color1": color1,
                "color2": color2,
                "color3": color3,
                "colorText1": colorText1,
                "colorText2": colorText2,
                "colorText3": colorText3,
                "close": close,
                "hostTransition": hostTransition,
                "button": button,
                "id": this.id
            }
        }

        const applyConfCss = (conf) => {
            if (conf.titleBack) this.style.setProperty("--titleBack", conf.titleBack)
            if (conf.back) this.style.setProperty("--back", conf.back)
            if (conf.color1) this.style.setProperty("--color1", conf.color1)
            if (conf.color2) this.style.setProperty("--color2", conf.color2)
            if (conf.color3) this.style.setProperty("--color3", conf.color3)
            if (conf.colorText1) this.style.setProperty("--colorText1", conf.colorText1)
            if (conf.colorText2) this.style.setProperty("--colorText2", conf.colorText2)
            if (conf.colorText3) this.style.setProperty("--colorText3", conf.colorText3)
        }

        const drawClose = async (conf) => {
            const container = this.dom.querySelector("#container")
            const closeBox = element.add(container, "div", null, ("closeBox center radius4 crystal"))
            const button = conf.button

            for (let i = 0; i < 3; i++) { element.add(closeBox, "div", null, "line") }
            const checkboxClose = element.add(closeBox, "input", "checkboxClose", "inputHidden maxW maxH", { type: "checkbox", checked: true })

            if (button === "rotate") closeBox.style.setProperty("--dinamicRotate", "rotate(-180deg)")
            if (button === "fall") closeBox.style.setProperty("--dinamicTop", "calc(-1 * var(--titleHeight))")

            return checkboxClose
        }

        const drawMenu = async (conf) => {
            this.dom.querySelector("#title").textContent = conf.title

            let list = []
            Object.values(conf.list).forEach(item => list.push(item))

            const menu = this.dom.querySelector("#menu")

            list.forEach((item, num) => {
                const itemName = item.type
                const componentObj = item.components

                const menuOption = element.add(menu, "div", null, "option center", { pos: num })
                const nameBox = element.add(menuOption, "span", null, "nameBox maxW radius4")
                const marker = element.add(nameBox, "div", null, "marker")
                const expand = element.add(nameBox, "div", null, "expand")
                const name = element.add(nameBox, "div", null, "name")
                name.textContent = itemName
                const radio = element.add(menuOption, "input", null, "inputHidden maxW maxH", { type: "radio", name: "mainOpt", pos: num })

                const expandMenu = element.add(menu, "div", null, "expandMenu scrollHidden", { pos: num })
                componentObj.forEach((item, subNum) => {
                    const optionSub = element.add(expandMenu, "div", null, "optionSub center")
                    const nameBoxSub = element.add(optionSub, "span", null, "nameBoxSub radius4")
                    const expandSub = element.add(nameBoxSub, "div", null, "expandSub")
                    const nameSub = element.add(nameBoxSub, "div", null, "nameSub")
                    nameSub.textContent = item.name
                    const radioSub = element.add(optionSub, "input", null, "inputHidden maxW maxH", { type: "radio", name: "subOpt", parentIndex: num, pos: subNum })
                })

                const bar = element.add(menu, "span", null, "bar")
            })
        }

        const expandControl = (array) => {
            const allExpands = Array.from(this.dom.querySelectorAll(".expandMenu"))

            array.forEach(item => {
                item.addEventListener("change", () => {
                    const index = item.getAttribute("pos")
                    const expandMenu = this.dom.querySelector(`.expandMenu[pos='${index}']`)
                    allExpands.forEach(item => { item.style.height = "0px" })

                    const multiplier = expandMenu.children.length
                    const height = parseFloat(getComputedStyle(this).getPropertyValue("--optionSubHeight"))
                    expandMenu.style.height = `calc(${height * multiplier}px)`
                })
            })
        }

        const setCustomEvents = async (array, confList) => {
            const transition = parseFloat(getComputedStyle(this).getPropertyValue("--transition"))

            array.forEach(item => {
                item.addEventListener("change", (e) => {
                    const parentIndex = Number(e.target.getAttribute("parentIndex"))
                    const itemIndex = Number(e.target.getAttribute("pos"))
                    const path = confList[parentIndex].components[itemIndex].path
                    const tag = confList[parentIndex].components[itemIndex].tag
                    const name = confList[parentIndex].components[itemIndex].name.toLowerCase().replace(" ", "-")

                    document.dispatchEvent(new CustomEvent("selectionMenu", {
                        detail: {
                            type: confList[Number(e.target.getAttribute("parentIndex"))].type,
                            defaultName: name,
                            url: path,
                            htmlTag: tag,
                            time: transition // for ended transitions
                        }
                    }))
                })
            })
        }

        const controlMenuDisplay = (input, par) => {
            const hostContainer = this.parentElement
            const hostWidth = hostContainer.offsetWidth
            const closeBox = input.parentElement

            hostContainer.style.transition = par
            hostContainer.style.left = input.checked ? `0px` : `calc(${hostWidth}px * -1)`
            closeBox.style.opacity = input.checked ? 1 : 0.4
        }

        const main = async () => {

            const conf = getConfig()
            console.log(conf)
            applyConfCss(conf)
            await drawMenu(conf)

            const mainRadios = Array.from(this.dom.querySelectorAll("input[name='mainOpt']"))
            expandControl(mainRadios)
            const subRadios = Array.from(this.dom.querySelectorAll("input[name='subOpt']"))
            setCustomEvents(subRadios, conf.list)

            if (conf.close) {
                const closeInput = await drawClose(conf)
                closeInput.addEventListener("change", (e) => {
                    controlMenuDisplay(e.target, conf.hostTransition)
                    const state = closeInput.checked
                    document.dispatchEvent(new CustomEvent("menuVisibility", { detail: { item: this.id, "state": state } }))
                })
            }
        }

        main()
    }
}
customElements.define("list-menu", listMenu)