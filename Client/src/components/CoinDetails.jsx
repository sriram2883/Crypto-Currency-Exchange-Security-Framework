import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Typography, CircularProgress, Paper, TextField, Button, Grid, Divider, Snackbar, useMediaQuery,
  Modal, IconButton
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CoinDetails() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usdAmount, setUsdAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [tradeResult, setTradeResult] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Base URL for API requests
  const API_URL = "http://localhost:5000";  // Replace with your backend URL, including port number

  useEffect(() => {
    const fetchCoinDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(response.data);
      } catch (error) {
        console.error("Error fetching coin details:", error);
      }
      setLoading(false);
    };

    fetchCoinDetails();
  }, [id]);

  const handleUsdChange = (e) => {
    const usd = e.target.value;
    setUsdAmount(usd);
    if (coin && coin.market_data.current_price.usd && usd) {
      setCoinAmount((parseFloat(usd) / coin.market_data.current_price.usd).toFixed(6));
    } else {
      setCoinAmount("");
    }
  };

  const handleCoinChange = (e) => {
    const coinQty = e.target.value;
    setCoinAmount(coinQty);
    if (coin && coin.market_data.current_price.usd && coinQty) {
      setUsdAmount((parseFloat(coinQty) * coin.market_data.current_price.usd).toFixed(2));
    } else {
      setUsdAmount("");
    }
  };

  const handleTrade = async (type) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setTradeResult("Please log in to trade.");
      setOpenSnackbar(true);
      return;
    }
    const pricePerCoin = coin.market_data.current_price.usd;
    const amountInCoins = type === "buy" ? parseFloat(usdAmount) / pricePerCoin : coinAmount;

    try {
      const response = await axios.post(`${API_URL}/api/transactions/${type}`, {
        coin: coin.id,
        amount: amountInCoins,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}` // Ensure the auth token is included
        }
      });

      setTradeResult(response.data.message);
      setOpenSnackbar(true);
      setUsdAmount("");
      setCoinAmount("");
    } catch (error) {
      console.error("Error in trade:", error);
      setTradeResult("Error in the transaction.");
      setOpenSnackbar(true);
    }
  };

  const handleTransfer = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setTradeResult("Please log in to transfer.");
      setOpenSnackbar(true);
      return;
    }
    
    if (recipientAddress) {
      try {
        const response = await axios.post(`${API_URL}/api/transactions/transfer`, {
          recipientUsername: recipientAddress,
          coin: coin.id,
          amount: parseFloat(coinAmount),
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Ensure the auth token is included
          }
        });

        setTradeResult(response.data.message);
        setOpenSnackbar(true);
        setRecipientAddress("");
        setCoinAmount("");
        setUsdAmount("");
        setOpenTransferModal(false);
      } catch (error) {
        console.error("Error transferring coins:", error);
        setTradeResult("Error during the transfer.");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenTransferModal = () => {
    setOpenTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setOpenTransferModal(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "300px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: isSmallScreen ? "1rem" : "2rem" }}>
      <Paper elevation={3} sx={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
        {/* Coin Info Section */}
        <Box display="flex" alignItems="center" mb={2}>
          <img src={coin.image.large} alt={coin.name} width="50" height="50" style={{ marginRight: "1rem" }} />
          <Typography variant={isSmallScreen ? "h5" : "h4"}>{coin.name} ({coin.symbol.toUpperCase()})</Typography>
        </Box>

        {/* Market Details */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Current Price</Typography>
            <Typography variant="h6">${coin.market_data.current_price.usd}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Market Cap</Typography>
            <Typography variant="h6">${coin.market_data.market_cap.usd.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">24h Volume</Typography>
            <Typography variant="h6">${coin.market_data.total_volume.usd.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">24h Change</Typography>
            <Typography variant="h6" sx={{ color: coin.market_data.price_change_percentage_24h >= 0 ? "green" : "red" }}>
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Trade Form */}
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <TextField
            label="Amount in USD"
            variant="outlined"
            type="number"
            fullWidth
            value={usdAmount}
            onChange={handleUsdChange}
            sx={{ mt: 1, mb: 1 }}
            inputProps={{ style: { fontSize: isSmallScreen ? "0.9rem" : "1rem" } }}
          />
          <TextField
            label={`Amount in ${coin.symbol.toUpperCase()}`}
            variant="outlined"
            type="number"
            fullWidth
            value={coinAmount}
            onChange={handleCoinChange}
            sx={{ mb: 2 }}
            inputProps={{ style: { fontSize: isSmallScreen ? "0.9rem" : "1rem" } }}
          />
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mr: 1, fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
              onClick={() => handleTrade("buy")}
              disabled={!usdAmount || isNaN(usdAmount) || parseFloat(usdAmount) <= 0}
            >
              Buy {coin.symbol.toUpperCase()}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ ml: 1, fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
              onClick={() => handleTrade("sell")}
              disabled={!coinAmount || isNaN(coinAmount) || parseFloat(coinAmount) <= 0}
            >
              Sell {coin.symbol.toUpperCase()}
            </Button>
          </Box>
        </Box>

        {/* Transfer Icon and Modal */}
        <Box mt={2} display="flex" justifyContent="center">
          <IconButton
            onClick={handleOpenTransferModal}
            color="primary"
            sx={{
              fontSize: isSmallScreen ? "2rem" : "2.5rem",
              opacity: !coinAmount || isNaN(coinAmount) || parseFloat(coinAmount) <= 0 ? 0.5 : 1,
            }}
            disabled={!coinAmount || isNaN(coinAmount) || parseFloat(coinAmount) <= 0}  // Disable icon if no amount entered
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Modal
          open={openTransferModal}
          onClose={handleCloseTransferModal}
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Box sx={{ width: "300px", backgroundColor: "white", padding: "2rem", borderRadius: "8px" }}>
            <Typography variant="h6" mb={2}>Transfer Coins</Typography>
            <TextField
              label="Recipient Username"
              fullWidth
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="space-between">
              <Button variant="outlined" color="secondary" onClick={handleCloseTransferModal}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleTransfer}>Transfer</Button>
            </Box>
          </Box>
        </Modal>
      </Paper>

      {/* Snackbar for trade results */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info">{tradeResult}</Alert>
      </Snackbar>
    </Box>
  );
}

export default CoinDetails;
