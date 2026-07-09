console.log("app.js loaded");

const searchButton = document.getElementById("searchButton")
const tickerInput = document.getElementById("ticker")
const stockResult = document.getElementById("stockResult");
const watchlist = document.getElementById("watchlist");
const refreshButton = document.getElementById("refresh-watchlist");
console.log(watchlist);
const watchlistStocks = [];

const savedWatchlist = localStorage.getItem("watchlist");
const parsedWatchlist = JSON.parse(savedWatchlist);


async function getStockData(symbol) {
    const response = await fetch("/search?ticker=" + symbol);
    const data = await response.json();

    return data;
}


if (savedWatchlist) {
    watchlistStocks.push(...parsedWatchlist);
    console.log(parsedWatchlist);

    renderWatchlist();
}




function createSearchCard(data) {
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

function createWatchlistCard(stock) {
    const changeClass = stock.price_change >= 0 ? "positive" : "negative";
    const changeArrow = stock.price_change >= 0 ? "▲" : "▼";

    return `
     <div class="stock-card">

    <div class="stock-header">

    <div class="stock-info">
        <h3>${stock.ticker}</h3>

         <p class="company-name">
            ${stock.company_name}
        </p>

    </div>
        <button
        class="remove-btn"
          data-ticker="${stock.ticker}">
        🗑 
        </button>
    </div>

    <div class="stock-price">
        $${stock.current_price}
    </div>

    <div class="stock-change ${changeClass}">
        ${changeArrow} $${stock.price_change} (${stock.percent_change}%)
    </div>
   <hr class="stock-divider">

   <div class="stock-stats">

    <div class="stat">
        <span class="stat-label">High</span>
        <span class="stat-value">$${stock.day_high}</span>
    </div>

    <div class="stat">
        <span class="stat-label">Low</span>
        <span class="stat-value">$${stock.day_low}</span>
    </div>

    <div class="stat">
        <span class="stat-label">Open</span>
        <span class="stat-value">$${stock.open_price}</span>
    </div>

    <div class="stat">
        <span class="stat-label">Prev Close</span>
        <span class="stat-value">$${stock.previous_close}</span>
    </div>
   
  </div>
    

</div>
`;

}

function renderWatchlist() {
    console.log("renderWatchlist length:", watchlistStocks.length);
      watchlist.innerHTML = "";

      if (watchlistStocks.length === 0) {
         watchlist.innerHTML = `
        <p class="empty-watchlist">
            ⭐ Your watchlist is empty.<br>
            Search for a stock and click <strong>Add to Watchlist</strong>.
        </p>
    `;
    return;
}

      for (const stock of watchlistStocks) {
        watchlist.innerHTML += createWatchlistCard(stock);

}
      
}

searchButton.addEventListener("click", async function() {
    console.log("Search button clicked!");
    const symbol = tickerInput.value.toUpperCase();
    console.log("Ticker:", symbol);

    stockResult.innerHTML = "<p>Loading stock data...</p>";

    const data = await getStockData(symbol);
    console.log("Response received");
    
    console.log("Data:", data);
    console.log("Ticker returned:", data.ticker);
    
    stockResult.innerHTML = createSearchCard(data);

    const watchlistButton = stockResult.querySelector(".watchlist-btn");

watchlistButton.addEventListener("click", function () {
    console.log("Adding to watchlist:", data.ticker);
    const existingStock = watchlistStocks.find(stock => stock.ticker === data.ticker);
    if (existingStock) {
    console.log("Stock is already in the watchlist.");
    return;
}
    console.log(data);
    watchlistStocks.push(data);
    

    localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlistStocks)
);

    renderWatchlist();

});


});

watchlist.addEventListener("click", function (event) {

    if (!event.target.classList.contains("remove-btn")) {
        return;
    }

    const ticker = event.target.dataset.ticker;
    console.log("Before filter:", watchlistStocks);

    const updatedWatchlist = watchlistStocks.filter(function (stock) {
    console.log("Comparing:", stock.ticker, ticker);
    return stock.ticker !== ticker;
});

    

    watchlistStocks.length = 0;
    watchlistStocks.push(...updatedWatchlist);

    localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlistStocks)
);
    console.log("After delete:", watchlistStocks);
    console.log("Length:", watchlistStocks.length);
    renderWatchlist();
   
  

});

refreshButton.addEventListener("click", async function () {
    for (const stock of watchlistStocks) {
       console.log("Old:", stock.current_price);

       const data = await getStockData(stock.ticker);

       console.log("New:", data.current_price); 
       
       Object.assign(stock, data);


       console.log(data);
    }

    localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlistStocks)
);

renderWatchlist();

});

console.log("=== BOTTOM OF FILE ===");