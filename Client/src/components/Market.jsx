import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CryptoRates() {
  const [cryptoRates, setCryptoRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCryptoRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCryptoRates(response.data);
    } catch (error) {
      console.error("Error fetching cryptocurrency rates:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCryptoRates();
    const interval = setInterval(fetchCryptoRates, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (id) => {
    navigate(`/coin/${id}`);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Live Cryptocurrency Rates
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Coin</TableCell>
                <TableCell align="right">Price (USD)</TableCell>
                <TableCell align="right">24h Change</TableCell>
                <TableCell align="right">Market Cap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cryptoRates.map((coin) => (
                <TableRow
                  key={coin.id}
                  hover
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(coin.id)}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <img src={coin.image} alt={coin.name} width="24" height="24" style={{ marginRight: "0.5rem" }} />
                      {coin.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">${coin.current_price.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ color: coin.price_change_percentage_24h >= 0 ? "green" : "red" }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                  <TableCell align="right">${coin.market_cap.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default CryptoRates;
