import * as element from "./modules/elements.js"

export const load = async (par, box) => {
    componentBox.innerHTML = ""
    const url = par.url
    const tag = par.htmlTag
    const name = par.defaultName
    const comp = await import(url)
    await element.add(box, tag, name, name)
}
