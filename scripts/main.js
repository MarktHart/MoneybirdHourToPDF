let container = document.querySelector('section.container');
let actionBar = container.querySelector('div.actionbar');
let totalToggle = actionBar.querySelector('#time-entry-graph-summary');

if (container && actionBar && totalToggle) {
    const button = document.createElement("a");
    button.classList.add("btn", "btn--success");
    button.onclick = printTable;

    const text = document.createElement("span");
    text.textContent = 'Export uren';
    text.classList.add("btn__text");
    button.appendChild(text);

    actionBar.appendChild(button);
}

async function printTable() {
    let total = container.querySelector("#graph.inactive")
    if (total) {
        totalToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    let content = container.cloneNode(true);
    let page = document.querySelector('html').cloneNode(true);
    let newWindow = window.open('', '_blank');

    const printZoom = document.createElement('style');
    printZoom.textContent = '@media print {body {zoom: 60%;}}';

    const title = document.createElement('title');
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    title.textContent = 'Uren Mark ' + ("" + (lastMonth.getMonth() + 1)).padStart(2, 0) + '-' + lastMonth.getFullYear();

    let head = page.querySelector('head');
    head.replaceChildren(...head.querySelectorAll('link, style, meta'), printZoom, title);

    let body = page.querySelector('body');
    body.replaceChildren(content);
    content.replaceChildren(...content.querySelectorAll('section.graph-summary, table'));

    let totalHours = content.querySelector("section.graph-summary");
    totalHours.replaceChildren(totalHours.querySelector('div.row'));

    content.querySelectorAll("tr").forEach(elem => {
        if(elem.children.length == 3) {
            elem.children[0].removeAttribute("colspan"); 
            elem.replaceChildren(elem.children[0], elem.children[1])
        }
        else if(elem.children.length == 9) {
            elem.replaceChildren(elem.children[0], elem.children[7])
        }
    });

    newWindow.document.write(page.outerHTML);
    newWindow.addEventListener('load', () => newWindow.print());
    newWindow.document.close();
}
