import {MicroFrontends} from "./MicroFrontends";

export default class Router {
    private appDiv: HTMLElement;

    constructor() {
        console.log("Router constructor")
        const appContainer = document.getElementById("appContainer");
        if (appContainer === null) {
            throw new Error("The 'appContainer' element was not found in the DOM.");
        }
        this.appDiv = appContainer;

        window.addEventListener("hashchange", this.handleHashChange.bind(this));

        this.initialize()
            .catch(e => console.error(e));
    }

    private async initialize(): Promise<void> {
        await this.handleHashChange();
    }

    private async removeFirstChild(): Promise<void> {
        const {firstChild} = this.appDiv;
        if (firstChild) {
            firstChild.remove();
        }
    }

    private async handleHashChange(): Promise<void> {
        console.log("Router handleHashChange")
        const {hash} = location;
        switch (hash) {
            case "#/about":
                await this.loadModule(MicroFrontends.Mfe2);
                break;
            case "#/contact":
                await this.fetchHtml(hash.slice(2) + '.html');
                break;
            case "#/mfe1":
                await this.loadModule(MicroFrontends.Mfe1);
                break;
            default:
                this.appDiv.innerHTML = "<h1>Home</h1>";
        }
    }

    private async fetchHtml(fileName: string): Promise<void> {
        await this.removeFirstChild();
        const response = await fetch(fileName);
        const htmlContent = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        this.appDiv.appendChild(tempDiv);
    }

    private async loadModule(mfe: MicroFrontends): Promise<void> {
        await this.removeFirstChild();

        let module;
        switch (mfe) {
            case MicroFrontends.Mfe1:
                // @ts-ignore
                module = await import('mfe1/component');
                break;
            case MicroFrontends.Mfe2:
                // @ts-ignore
                module = await import('about/component');
                break;
            // case MicroFrontends.Mfe3:
            //     module = await import('mfe3/component');
            //     break;
            default:
                throw new Error(`Unsupported module: ${mfe}`);
        }

        console.log(module.elementName);
        const elm = document.createElement(module.elementName);
        this.appDiv.appendChild(elm);
    }
}