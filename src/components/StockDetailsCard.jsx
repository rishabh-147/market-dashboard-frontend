import { Card, Typography, Box } from "@mui/material";
import StockChart from "./StockChart";
import { useState } from "react";
import "../css/StockDetailsCard.css";

function StockDetailsCard({
  symbol,
  stockName,
  date,
  open,
  close,
  high,
  low,
  prevClose,
  history,
  loading,
}) {
  
  if (loading) return <div>Loading...</div>;

  const change = close - prevClose;
  const percent = ((change / prevClose) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <Card className="stock-card" elevation={0}>
      <div className="stock-info">
        {/* 🏷 SYMBOL + DATE */}
        <div className="stock-header">
          <div>
            <div className="stock-Name">{stockName}</div>
            <div className="stock-symbol">
              <span className="change-label">{symbol}</span>
            </div>
            <div className="stock-date">{date}</div>
          </div>

          <div>
            {/* 💰 LTP */}
            <div className="stock-price">₹{close.toFixed(2)}</div>
            {/* 📈 CHANGE */}
            <div className={`stock-change ${isPositive ? "pos" : "neg"}`}>
              <span className="change-label">1D</span>
              <span>
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({percent}%)
              </span>
            </div>
          </div>
        </div>
      {/* 🔥 TOP: CHART */}
      <div className="stock-chart-section">
        <StockChart data={history} />
      </div>
      </div>
      

      {/* 🔻 BOTTOM */}
      <div className="stock-info">
        {/* 📊 OHLC */}
        <div className="stock-grid">
          <div className="metric">
            <span>Open</span>
            <strong>{open}</strong>
          </div>
          <div className="metric">
            <span>High</span>
            <strong className="pos">{high}</strong>
          </div>
          <div className="metric">
            <span>Low</span>
            <strong className="neg">{low}</strong>
          </div>
          <div className="metric">
            <span>Prev Close</span>
            <strong>{prevClose}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StockDetailsCard;
