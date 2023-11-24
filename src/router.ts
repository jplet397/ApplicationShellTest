export default class Router {
    appDiv: HTMLElement | null;

    constructor() {
        this.appDiv = document.getElementById("app");
        if (this.appDiv == null) {
            console.error("Element with id 'app' not found");
            return;
        }
        // bind 'this' in the event handler method
        this.handleHashChange = this.handleHashChange.bind(this);

        // Listen to hashchange event
        window.addEventListener("hashchange", this.handleHashChange);

        // Handle initial page load
        this.handleHashChange()
            .catch(e => console.error(e));
    }

    async handleHashChange() {
        if (this.appDiv) {
            switch(location.hash) {
                case "#/about":
                    this.appDiv.innerHTML = await this.fetchHtml('module1.html');
                    break;
                case "#/contact":
                    this.appDiv.innerHTML = await this.fetchHtml('module2.html');
                    break;
                default:
                    this.appDiv.innerHTML = "<h1>Home</h1>";
            }
        }
    }

    async fetchHtml(fileName: string): Promise<string> {
        const response = await fetch(fileName);
        const html = await response.text();
        return html;
    }
}
