export const send = (dom, eventName, data = null, bubbles = null, restrict = null) => {
    const evento = new CustomEvent(eventName, {
        detail: data,
        bubbles,
        restrict
    })
    dom.dispatchEvent(evento)
}

export const recive = (dom, eventName, callback) => {
    dom.addEventListener(eventName, (e) => {
        callback(e.detail)
    })
}