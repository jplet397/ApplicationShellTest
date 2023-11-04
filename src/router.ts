function handleHashChange() {
    let appDiv = document.getElementById("app")
    console.log(appDiv);
    if (appDiv == null) {
        console.error("Element with id 'app' not found");
    } else {
        switch(location.hash) {
            case "#/about":
                appDiv.innerHTML = "<h1>About Page</h1>";
                break;
            case "#/contact":
                appDiv.innerHTML = "<h1>Contact Page</h1>";
                break;
            default:
                appDiv.innerHTML = "<h1>Home Page</h1>";
        }
    }
}

export function initRouter() {
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
}
