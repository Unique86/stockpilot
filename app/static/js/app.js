console.log("app.js loaded");

const searchButton = document.getElementById("searchButton")
const tickerInput = document.getElementById("ticker")

searchButton.addEventListener("click", async function() {
    const symbol = tickerInput.value;

    const response = await fetch("/search?ticker=" + symbol);
    
    const data = await response.json();
    console.log(data);
});

