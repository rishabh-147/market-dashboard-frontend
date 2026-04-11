import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import "../css/SearchBar.css";

// Container to center the search bar
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(6),
}));

// Search wrapper
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "999px", // pill shape
  backgroundColor: alpha(theme.palette.grey[100], 0.9),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  width: "60%", // leaves ~20% on each side
  transition: "all 0.3s ease",

  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  },

  "&:focus-within": {
    backgroundColor: "#fff",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
}));

// Icon wrapper
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.grey[600],
}));

// Input field
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#333",
  width: "100%",

  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 2, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: "1rem",
  },
}));

function SearchBar({ onSearch, onSubmit }) {
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = async (e) => {
    let value = e.target.value;

    if (value.length >= 3 && onSearch) {
      let response = await onSearch(value);

      console.log("API response:", response);

      setResults(response?.data?.searchResult || []);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <SearchContainer>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        {/* <StyledInputBase
          placeholder="Search stocks (e.g. TCS, TMCV)…"
          
          onChange={handleChange}
          autoFocus
          onKeyDown={handleEnter}
        /> */}
        <div className="search-container">
          <StyledInputBase
            placeholder="Search stocks (e.g. TCS, TMCV)…"
            onChange={handleChange}
          />

          {results.length > 0 && (
            <div className="dropdown">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => {
                    onSubmit(item.symbol);
                    setShowDropdown(false);
                  }}
                >
                  <div className="stock-name">{item.stockName}</div>
                  <div className="stock-meta">
                    {item.symbol} • {item.exchangeName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Search>
    </SearchContainer>
  );
}

export default SearchBar;
