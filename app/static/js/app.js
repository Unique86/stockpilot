console.log("app.js loaded");

const searchButton = document.getElementById("searchButton")
const tickerInput = document.getElementById("ticker")
const stockResult = document.getElementById("stockResult");

searchButton.addEventListener("click", async function() {
    const symbol = tickerInput.value;

    stockResult.innerHTML = "<p>Loading stock data...</p>";

    const response = await fetch("/search?ticker=" + symbol);
    
    const data = await response.json();
    console.log(data);
});
