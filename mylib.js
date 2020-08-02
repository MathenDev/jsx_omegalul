const _STATE = {};
const _PARSER = new DOMParser();

async function loadJSXInfo(path = "", afterLoading = function () {}) {
    let response = await fetch(path);
    json = await response.json();
    _normalizeCase(json, "routes");
    _STATE.jsxInfo = json;
    if (afterLoading) {
        afterLoading();
    }
}

function _normalizeCase(json, prop = "") {
    let p = json[prop];
    if (p) {
        let normalized = {};
        Object.keys(p).forEach((v) => normalized[v.toLowerCase()] = p[v]);
        json[prop] = normalized;
    }
}

async function render(selector = "", element = "") {
    let e = document.querySelector(selector);
    if (e) {
        let replacing = await loadElement(element);
        if (replacing) {
            e.replaceWith(replacing);
        }
    }
}

async function loadElement(element = "") {
    let info = _STATE.jsxInfo;
    if (info) {
        let routes = info['routes'];
        if (routes) {
            let elem = routes[element.toLowerCase()];
            if (elem) {
                let base = info['base'];
                if (base) {
                    return await _loadElement(base + "/" + elem);
                }
                return await _loadElement(elem);
            }
            return undefined;
        }
        return undefined;
    }
    return undefined;
}

async function _loadElement(path = "") {
    let response = await fetch(path);
    let text = await response.text();
    return _parse(text);
}

function _parse(text = "") {
    return _PARSER.parseFromString(text, "text/html").body;
}