console.log("app.js loaded");

const searchButton = document.getElementById("searchButton")
const tickerInput = document.getElementById("ticker")
const stockResult = document.getElementById("stockResult");


    

searchButton.addEventListener("click", async function() {
    console.log("Search button clicked!");
    const symbol = tickerInput.value;
    console.log("Ticker:", symbol);

    stockResult.innerHTML = "<p>Loading stock data...</p>";

    const response = await fetch("/search?ticker=" + symbol);
    console.log("Response received");
    
    const data = await response.json();
    console.log("Data:", data);
    


    
    const changeClass = data.price_change >= 0 ? "positive" : "negative";
    stockResult.innerHTML = `
    <div class="stock-card">

    <h3>${data.ticker}</h3>

    <p>Current Price: $${data.current_price}</p>

    <p class="${changeClass}">
        <strong>Today's Change:</strong>
        $${data.price_change}
    </p>

    <p>Percent Change: ${data.percent_change}%</p>

    <p>Day High: $${data.day_high}</p>

    <p>Day Low: $${data.day_low}</p>

    <p>Open: $${data.open_price}</p>

    <p>Previous Close: $${data.previous_close}</p>

</div>
`;
});
