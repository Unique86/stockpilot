console.log("app.js loaded");

const searchButton = document.getElementById("searchButton")
const tickerInput = document.getElementById("ticker")
const stockResult = document.getElementById("stockResult");
const watchlist = document.getElementById("watchlist");
const refreshButton = document.getElementById("refresh-watchlist");
let expandedTicker = null;
let expandedChart = null;
let currentTicker = "AAPL";
let heroChart = null;

console.log(watchlist);
console.log(Chart);
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

function createWatchlistCard(stock, isExpanded) {
    const changeClass = stock.price_change >= 0 ? "positive" : "negative";
    const changeArrow = stock.price_change >= 0 ? "▲" : "▼";

    return `
     <div class="stock-card ${isExpanded ? "expanded" : ""}" data-ticker="${stock.ticker}">

    <div class="stock-header">
    <div class= "stock-company">
    
        <img
         class="company-logo"
         src="${stock.logo}"
         alt="${stock.company_name} logo"
        >

    <div class="stock-info">
        <h3>${stock.ticker}</h3>

         <p class="company-name">
            ${stock.company_name}
        </p>
   
      </div>

    </div>
    ${!isExpanded ? `
    <div class="mini-chart-container">
    <canvas 
         class="mini-chart"
         data-ticker="${stock.ticker}">
    </canvas>
     </div>
    `: ""}
    </div>
     <button
        class="remove-btn"
          data-ticker="${stock.ticker}">
        🗑 
    </button>
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
        <span class="stat-value">$${stock.day_high.toFixed(2)}</span>
    </div>

    <div class="stat">
        <span class="stat-label">Low</span>
        <span class="stat-value">$${stock.day_low.toFixed(2)}</span>
    </div>

    <div class="stat">
        <span class="stat-label">Open</span>
        <span class="stat-value">$${stock.open_price.toFixed(2)}</span>
    </div>

    <div class="stat">
        <span class="stat-label">Prev Close</span>
        <span class="stat-value">$${stock.previous_close}</span>
    </div>
   
  </div>
    ${isExpanded ? `
   <div class="expanded-content">
        
    <div class="expanded-chart">
       <canvas 
       class="expanded-chart-canvas" data-ticker="${stock.ticker}">
       </canvas>
    </div>

    <div class="chart-controls">
        <button class="timeframe-btn" data-timeframe="1D">1D</button>
        <button class="timeframe-btn" data-timeframe="1W">1W</button>
        <button class="timeframe-btn" data-timeframe="1M">1M</button>
        <button class="timeframe-btn" data-timeframe="6M">6M</button>
        <button class="timeframe-btn" data-timeframe="1Y">1Y</button>

        </div>

     </div>
` : ""}

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
        const isExpanded = stock.ticker === expandedTicker;

        console.log(stock.ticker, expandedTicker, isExpanded);

        watchlist.innerHTML += createWatchlistCard(stock, isExpanded);
        


}
      loadMiniCharts();
      loadExpandedChart();

}

function createGradient(ctx, canvas, gradientColor) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    gradient.addColorStop(0, gradientColor);
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
      

    return gradient;
}

async function fetchHistory(ticker, timeframe = "1M") {
    const response = await fetch(
        `/history?ticker=${ticker}&timeframe=${timeframe}`
    );
    return await response.json();
}
// Third Brother 
function getChartColors(isPositive) {
         return {
        lineColor: isPositive ? "#22c55e" : "#ef4444",
       
        gradientColor: isPositive
            ? "rgba(34, 197, 94, 0.20)"
            : "rgba(239, 68, 68, 0.20)"
    };
      };

// Parent
function createChart(canvas, labels, prices, chartColor, gradient, options = {}) {

         const {
    mini = true,
    showAxes = false,
    showTooltip = false,
    } = options;   

    if (!mini && expandedChart) {
    expandedChart.destroy();
    }


    expandedChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                data: prices,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                borderColor: chartColor,
                backgroundColor: gradient,
                fill: true,

                
                pointHoverRadius: 0,
                borderCapStyle: "round",
                borderJoinStyle: "round",
            }]
        },

        options: {
            animation: {
                 duration: 1200,
            },

            responsive: !mini,
              maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: showTooltip,
                },
            
            },

            scales: {
                 x: {
                        display: showAxes,
                 },
                 y: {
                        display: showAxes,
                }
             }
        }        
    });
}
// Mini Brother 
async function loadMiniCharts() {
   // console.log("loadMiniCharts() started");
    const miniCharts = document.querySelectorAll(".mini-chart");
   // console.log(miniCharts.length);
    
    for (const canvas of miniCharts) {
       // console.log(canvas);
        const ticker = canvas.dataset.ticker;
        const stock = watchlistStocks.find(
        stock => stock.ticker === ticker
);
        
        const history = await fetchHistory(ticker);
        if (history.error) {
             console.log(history.error);
                return;
            }
      //  console.log(history);
        const labels = history.labels
        const prices = history.prices
        const firstPrice = prices[prices.length - 1];
        const lastPrice = prices[0];
        const isPositive = stock.price_change >= 0;
        const chartColors = getChartColors(isPositive)
        const ctx = canvas.getContext("2d");
        
     
        
        // console.log("Ticker:", ticker);
        // console.log("First:", firstPrice);
        // console.log("Last:", lastPrice);
        // console.log("Positive:", isPositive);

       

        const gradient = createGradient(ctx, canvas, chartColors.gradientColor);

   createChart(
    canvas,
    labels,
    prices,
    chartColors.lineColor,
    gradient,

      {
        mini: true,
        showAxes: false,
        showTooltip: false
    }
);


    // console.log(labels);
    // console.log(prices);
    // console.log("Ticker:", ticker);
    // console.log(canvas.dataset.ticker);
}
    // console.log(miniCharts);
}
//Big Brother 
async function loadExpandedChart() {
    const canvas = document.querySelector(".expanded-chart-canvas");

    if (!canvas) {
        return;
    }
    const ticker = canvas.dataset.ticker;

    const history = await fetchHistory(ticker, "1M");
    if (history.error) {
        alert(history.error);
        return;
      }

    const labels = history.labels;
    const prices = history.prices;

    const stock = watchlistStocks.find(
        stock => stock.ticker === ticker
    );

    const isPositive = stock.price_change >= 0;
    const chartColors = getChartColors(isPositive)
    
    
    const ctx = canvas.getContext("2d");
    const gradient = createGradient(ctx, canvas, chartColors.gradientColor);

    createChart(
        canvas,
        labels,
        prices,
        chartColors.lineColor,
        gradient,
        {
            mini: false,
            showAxes: true,
            showTooltip: true
        }
    );
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
    currentTicker = data.ticker;
    await loadChart();

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
//cousin 
watchlist.addEventListener("click", async function (event) {
    if(event.target.classList.contains("timeframe-btn")) {
        const timeframe = event.target.dataset.timeframe;
       
        const card = event.target.closest(".stock-card");
        const ticker = card.dataset.ticker;
       
        const history = await fetchHistory(ticker, timeframe)
        if (history.error) {
           alert(history.error);
            return;
        }

        const labels = history.labels;
        const prices = history.prices;

        const stock = watchlistStocks.find(
        stock => stock.ticker === ticker
        );

        const canvas = document.querySelector(".expanded-chart-canvas");

        const isPositive = stock.price_change >= 0;

        const chartColors = getChartColors(isPositive);
            


        const ctx = canvas.getContext("2d");
        const gradient = createGradient(ctx, canvas, chartColors.gradientColor);

        
        createChart(
                    canvas,
                    labels,
                     prices,
                    chartColors.lineColor,
                     gradient,
                {
                     mini: false,
                     showAxes: true,
                    showTooltip: true
                 }
            );


        return;
    }

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

watchlist.addEventListener("click", function (event) {
    console.log("Expand listener fired");

    if (event.target.classList.contains("timeframe-btn")) {
    console.log("Ignoring timeframe click");
    return;
    }

    if (event.target.classList.contains("remove-btn")) {
        return;
    }

    const card = event.target.closest(".stock-card");
    if (!card) {
        return;
    }
    const ticker = card.dataset.ticker;

    if (expandedTicker === ticker) {
        expandedTicker = null;
       } else {
       expandedTicker = ticker;
      }

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
async function getHistory(symbol) {
    const response = await fetch("/history?ticker=" + symbol);
    const history = await response.json();

    return history;
}
//Big Sister
async function loadChart() {

    const history = await fetchHistory(currentTicker, "1M");

     if (history.error) {
    alert(history.error);
        return;
    }

    console.log(history.prices);
    console.log("First:", history.prices[0]);
    console.log("Last:", history.prices[history.prices.length - 1]);

    const stockUp = history.prices[history.prices.length - 1] > history.prices[0];
    const chartColors = getChartColors(stockUp);
    const chartCanvas = document.getElementById("stock-chart");
    const ctx = chartCanvas.getContext("2d");
    const gradient = createGradient(
                                     ctx,
                                     chartCanvas,
                                     chartColors.gradientColor
                                    );       
    if (heroChart) {
    heroChart.destroy();
    }          
    
    heroChart = new Chart(chartCanvas, {
    type: "line",

    data: {
        labels: history.labels,

        datasets: [{
            label: "Sample Stock Price",
            data: history.prices,
            borderColor: chartColors.lineColor,
             backgroundColor: gradient,
             fill: true,
            tension: 0.35,
            pointRadius: 0,
        }]
        
    },
    options: {
        plugins: {
            legend: {
                display: false,
            },
            scales: {
                x: {
                    ticks:{
                        maxTicksLimit: 6,
                    }
                }
            }
        },

    } 
    
}); 
      // V2 TODO:
     // Migrate Big Sister to createChart() after
    // Parent supports a dedicated hero chart mode.
      /*  createChart(
                    chartCanvas,
                    history.labels,
                    history.prices,
                    chartColors.lineColor,
                    gradient,
                   {
                    mini: false,
                    showAxes: true,
                    showTooltip: true
                   }
);*/

}

loadChart();
console.log("=== BOTTOM OF FILE ===");