window.onload = () => {
    fetch('./src/module1.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('content')!.innerHTML = data;
        })
        .catch(error => {
            console.error(error);
        });
};