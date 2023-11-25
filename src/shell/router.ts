export default class Router {
    appDiv: HTMLElement;

    constructor() {
        console.log("Router constructor")
        let appContainer = document.getElementById("appContainer");
        if (appContainer == null) {
            throw new Error("The 'appContainer' element was not found in the DOM.");
        }
        else {
            this.appDiv = appContainer;
        }

        // bind 'this' in the event handler method
        this.handleHashChange = this.handleHashChange.bind(this);

        // Listen to hashchange event
        window.addEventListener("hashchange", this.handleHashChange);

        // Handle initial page load
        this.handleHashChange()
            .catch(e => console.error(e));
    }

    async removeFirstChild() {
        if (this.appDiv.firstChild) {
            this.appDiv.firstChild.remove();
        }
    }

    async handleHashChange() {
        console.log("Router handleHashChange")
        if (this.appDiv) {
            switch(location.hash) {
                case "#/about":
                    this.appDiv.innerHTML = await this.fetchHtml('module1.html');
                    break;
                case "#/contact":
                    this.appDiv.innerHTML = await this.fetchHtml('module2.html');
                    break;
                case "#/mfe1":
                    await this.loadModule();
                    break;
                default:
                    this.appDiv.innerHTML = "<h1>Home</h1>";
            }
        }
    }

    async fetchHtml(fileName: string): Promise<string> {
        const response = await fetch(fileName);
        return await response.text();
    }

    async loadModule(): Promise<void> {
        await this.removeFirstChild();
        const module = await import('mfe1/component');
        const elm = document.createElement(module.elementName);
        this.appDiv.appendChild(elm);
    }
}