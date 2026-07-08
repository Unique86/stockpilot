console.log("app.js loaded");

const searchButton = document.getElementById("searchButton")
const tickerInput = document.getElementById("ticker")
const stockResult = document.getElementById("stockResult");
const watchlist = document.getElementById("watchlist");
const watchlistStocks = [];

function createStockCard(data) {
    const changeClass = data.price_change >= 0 ? "positive" : "negative";
    const changeArrow = data.price_change >= 0 ? "▲" : "▼";

    return `
     <div class="stock-card">

    <div class="stock-header">
        <h3>${data.ticker}</h3>
    </div>

    <div class="stock-price">
        $${data.current_price}
    </div>

    <div class="stock-change ${changeClass}">
        ${changeArrow} $${data.price_change} (${data.percent_change}%)
    </div>

   <div class="stock-stats">

    <div class="stat-row">
        <span>High</span>
        <span>$${data.day_high}</span>
    </div>

    <div class="stat-row">
        <span>Low</span>
        <span>$${data.day_low}</span>
    </div>

    <div class="stat-row">
        <span>Open</span>
        <span>$${data.open_price}</span>
    </div>

    <div class="stat-row">
        <span>Prev Close</span>
        <span>$${data.previous_close}</span>
    </div>
   
  </div>
       <button id="watchlistButton" class="watchlist-btn">
    ⭐ Add to Watchlist
        </button>

</div>
`;
}
    

searchButton.addEventListener("click", async function() {
    console.log("Search button clicked!");
    const symbol = tickerInput.value.toUpperCase();
    console.log("Ticker:", symbol);

    stockResult.innerHTML = "<p>Loading stock data...</p>";

    const response = await fetch("/search?ticker=" + symbol);
    console.log("Response received");
    
    const data = await response.json();
    console.log("Data:", data);
    console.log("Ticker returned:", data.ticker);
    
    stockResult.innerHTML = createStockCard(data);

    const watchlistButton = stockResult.querySelector(".watchlist-btn");

watchlistButton.addEventListener("click", function () {
    console.log("Adding to watchlist:", data.ticker);
    const existingStock = watchlistStocks.find(stock => stock.ticker === data.ticker);
    if (existingStock) {
    console.log("Stock is already in the watchlist.");
    return;
}

    watchlistStocks.push(data);
    console.log(watchlistStocks)

    localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlistStocks)
);

    watchlist.innerHTML += createStockCard(data);

});


});
