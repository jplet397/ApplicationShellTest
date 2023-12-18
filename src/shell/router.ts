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
                    await this.fetchHtml('about.html');
                    break;
                case "#/contact":
                    await this.fetchHtml('contact.html');
                    break;
                case "#/mfe1":
                    await this.loadModule();
                    break;
                default:
                    this.appDiv.innerHTML = "<h1>Home</h1>";
            }
        }
    }

    async fetchHtml(fileName: string): Promise<void> {
        await this.removeFirstChild();

        const response = await fetch(fileName);
        const htmlContent = await response.text();

        const tempDiv = document.createElement('div');

        tempDiv.innerHTML = htmlContent;

        this.appDiv.appendChild(tempDiv);
    }

    async loadModule(): Promise<void> {
        await this.removeFirstChild();
        // @ts-ignore
        const module = await import('mfe1/component');
        console.log(module.elementName)
        const elm = document.createElement(module.elementName);
        this.appDiv.appendChild(elm);
    }
}