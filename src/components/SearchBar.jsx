import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import "../css/SearchBar.css";

// 🔹 Container
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginTop: theme.spacing(6),
}));

// 🔹 Glass-style search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  width: "55%",
  height: "52px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.12)",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
  },

  "&:focus-within": {
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 0 30px rgba(59, 130, 246, 0.35)",
    transform: "scale(1.02)",
  },
}));

// 🔹 Icon
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#9ca3af",
}));

// 🔹 Input
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#e5e7eb",
  width: "100%",

  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 2, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(5)})`,
    fontSize: "1.05rem",
    letterSpacing: "0.3px",

    "::placeholder": {
      color: "#9ca3af",
      opacity: 1,
    },
  },
}));

function SearchBar({ onSearch, onSubmit }) {
  const [query, setQuery] = useState(""); // ✅ FIX
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;

    // ✅ Allow only alphabets + space
    if (!/^[a-zA-Z\s]*$/.test(value)) return;

    setQuery(value);

    if (value.length >= 3 && onSearch) {
      try {
        const response = await onSearch(value);
        const data = response?.data?.searchResult || [];

        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setResults([]);
        setShowDropdown(true); // still show "No results"
      }
    } else {
      setResults([]);
      setShowDropdown(true); // show "Start typing"
    }
  };

  return (
    <SearchContainer>
      <Search>
        {/* 🔍 Icon */}
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        <div className="search-container">
          <StyledInputBase
            value={query} // ✅ controlled input
            placeholder="Search stocks (e.g. TCS, RELIANCE)…"
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => {
              // delay so click works
              setTimeout(() => setShowDropdown(false), 150);
            }}
            onPaste={(e) => {
              e.preventDefault();

              const pastedData = e.clipboardData.getData("text");

              // ✅ sanitize paste
              const cleaned = pastedData.replace(/[^a-zA-Z\s]/g, "");

              setQuery((prev) => prev + cleaned);
            }}
          />

          {/* 🔽 Dropdown */}
          {showDropdown && (
            <div className="dropdown">
              {query.length === 0 ? (
                <div className="dropdown-item no-result">
                  Start typing to search
                </div>
              ) : results.length === 0 ? (
                <div className="dropdown-item no-result">No results found</div>
              ) : (
                results.map((item, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onMouseDown={() => {
                      onSubmit(item.symbol, item.stockName.replace("/", ""));
                      setShowDropdown(false);
                      setResults([]);
                      setQuery(item.stockName); // ✅ better UX
                    }}
                  >
                    <div className="stock-name">{item.stockName}</div>
                    <div className="stock-meta">
                      {item.symbol} • {item.exchangeName}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Search>
    </SearchContainer>
  );
}

export default SearchBar;
