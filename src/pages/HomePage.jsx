import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { searchSymbol, getQuote } from "../services/stockServices";
import "../css/HomePage.css";
import StockDetailsCard from "../components/StockDetailsCard";
import Footer from "../components/Footer";

/* MUI */
import {
  Dialog,
  DialogContent,
  Typography,
  Divider,
  IconButton,
  Box,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

function HomePage() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  const handleOpenAbout = () => setOpenAbout(true);
  const handleCloseAbout = () => setOpenAbout(false);

  // 🔍 Fetch stock
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

  // 📊 Transform API → UI
  const getCardData = () => {
    if (!selectedStock) return null;

    const prices = selectedStock.priceDetails;
    if (!prices || prices.length === 0) return null;

    const latest = prices[0];
    const prev = prices[1];

    return {
      symbol: selectedStock.symbol,
      stockName: selectedStock.stockName,
      lastRefresh: selectedStock.lastRefresh,

      date: latest.date,
      open: parseFloat(latest.open),
      close: parseFloat(latest.close),
      high: parseFloat(latest.high),
      low: parseFloat(latest.low),

      prevClose: prev ? parseFloat(prev.close) : parseFloat(latest.close),

      history: prices
        .slice(0, 90)
        .reverse()
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

  /* 🔥 Reusable Section Component */
  const Section = ({ title, children }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: "0.75rem",
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "12px 14px",
          fontSize: "0.9rem",
          fontFamily: "system-ui",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.85)",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "rgba(255,255,255,0.05)",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );

  return (
    <div className="homepage-mainDiv" style={{ position: "relative" }}>
      {/* ⓘ BUTTON */}
      <IconButton
        onClick={handleOpenAbout}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.2s ease",

          "&:hover": {
            color: "#fff",
            background: "rgba(255,255,255,0.1)",
            transform: "scale(1.08)",
          },
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>

      {/* 🔍 Search */}
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

      {/* 🔥 MODAL */}
      <Dialog
        open={openAbout}
        onClose={handleCloseAbout}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(8, 12, 24, 0.65)",
            backdropFilter: "blur(30px) saturate(140%)",
            WebkitBackdropFilter: "blur(30px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            color: "#e5e7eb",
            boxShadow: "0 30px 80px rgba(0,0,0,0.85)",
            overflow: "hidden",
          },
        }}
      >
        {/* Gradient Top Bar */}
        <Box
          sx={{
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)",
          }}
        />

        {/* Close */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", px: 1, pt: 1 }}>
          <IconButton onClick={handleCloseAbout}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ pt: 0, px: 4, pb: 4 }}>
          {/* HEADER */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Rishabh Tiwari
            </Typography>

            <Typography sx={{ opacity: 0.6, fontSize: "0.85rem" }}>
              Software Engineer · Full Stack Developer
            </Typography>
          </Box>

          {/* FEATURES */}
          <Section title="Current Features">
            • Stock analytics dashboard <br />
            • Clean, minimal and performance-focused UI <br />
            • Historical data visualization <br />
            • Fast search and API-driven architecture <br />• Built leveraging
            Generative AI for accelerated development
          </Section>

          {/* APIs */}
          <Section title="APIs & Data Sources">
            • Finnhub API <br />• AlphaVantage API
          </Section>

          {/* DEPLOYMENT */}
          <Section title="Deployment">
            • Frontend: Vercel <br />• Backend: Railway
          </Section>

          {/* FUTURE */}
          <Section title="Future Scope">
            • Portfolio & watchlist system <br />
            • Advanced charting & indicators <br />
            • Multi-source data integration <br />
            • Authentication & personalization <br />• Real-time streaming
            pipelines
          </Section>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomePage;
