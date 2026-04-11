import axios from "axios";

// const BASE_URL = "http://localhost:8080/v1/stock";
const BASE_URL = "https://market-dashboard-backend-h3i2.onrender.com/v1/stock";

export const searchSymbol = (query) => {
  console.log("Searching for..." + query);
  return axios.get(`${BASE_URL}/search/${query}`);
};

export const getQuote = (symbol) => {
  console.log("Submittion for..." + symbol);
  return axios.get(`${BASE_URL}/quote/${symbol}`);
};
