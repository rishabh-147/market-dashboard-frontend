import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { searchSymbol, getQuote } from "../services/stockServices";
import "../css/HomePage.css";
import StockDetailsCard from "../components/StockDetailsCard";
import CreditInfo from "../components/CreditInfo";
import Footer from "../components/Footer";

function HomePage() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 When user selects a stock
  const handleSubmit = async (symbol, stockName) => {
    setLoading(true);

    try {
      const response = await getQuote(symbol + "-" + stockName);
      setSelectedStock(response.data);
    } catch (err) {
      console.error("Error fetching stock:", err);
    }

    setLoading(false);
  };

  // 📊 Transform API → UI usable data
  const getCardData = () => {
    if (!selectedStock) return null;

    const prices = selectedStock.priceDetails;

    if (!prices || prices.length === 0) return null;

    const latest = prices[0];
    const prev = prices[1];

    return {
      symbol: selectedStock.symbol,
      stockName: selectedStock.stockName, // later replace with company name
      lastRefresh: selectedStock.lastRefresh,

      // 📌 Latest data
      date: latest.date,
      open: parseFloat(latest.open),
      close: parseFloat(latest.close),
      high: parseFloat(latest.high),
      low: parseFloat(latest.low),
      // volume: parseInt(latest.volume),
      // 📉 Previous close
      prevClose: prev ? parseFloat(prev.close) : parseFloat(latest.close),

      // 📈 Chart data (IMPORTANT FIXED)
      history: prices
        .slice(0, 90) // take enough data for MA
        .reverse() // oldest → newest (chart needs this)
        .map((item) => ({
          date: item.date,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseInt(item.volume),
        })),
    };
  };

  const cardData = getCardData();

  return (
    <div className="homepage-mainDiv" style={{ position: "relative" }}>
      {/* ⓘ Tooltip (top-right) */}
      <CreditInfo />

      {/* 🔍 Search Bar */}
      <div className={selectedStock ? "search-top" : "search-center"}>
        <SearchBar onSearch={searchSymbol} onSubmit={handleSubmit} />
      </div>

      {/* ⏳ Loading */}
      {loading && <div className="loading-text">Fetching stock data...</div>}

      {/* 📊 Stock Details */}
      {cardData && !loading && (
        <div className="stock-details">
          <StockDetailsCard {...cardData} loading={loading} />
        </div>
      )}

      {/* 🔻 Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
