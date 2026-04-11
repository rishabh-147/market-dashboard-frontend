import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { searchSymbol, getQuote } from "../services/stockServices";
import "../css/HomePage.css";

function HomePage() {
  const [selectedStock, setSelectedStock] = useState(null);

  const handleSubmit = async (symbol) => {
    const response = await getQuote(symbol);
    setSelectedStock(response.data);   // store full data
  };

  return (
    <div className="homepage-mainDiv">
      
      {/* SearchBar position changes based on state */}
      <div className={selectedStock ? "search-top" : "search-center"}>
        <SearchBar onSearch={searchSymbol} onSubmit={handleSubmit} />
      </div>

      {/* Show details only when selected */}
      {selectedStock && (
        <div className="stock-details">
          <h2>{selectedStock.symbol}</h2>
          <p>Last Refresh: {selectedStock.lastRefresh}</p>

          <div className="price-list">
            {selectedStock.priceDetails.slice(0, 10).map((item, index) => (
              <div key={index} className="price-item">
                <span>{item.date}</span>
                <span>Open: {item.open}</span>
                <span>Close: {item.close}</span>
                <span>High: {item.high}</span>
                <span>Low: {item.low}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;