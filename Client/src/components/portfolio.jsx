
import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Chip, Button } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios for API requests

const Portfolio = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [tradeMode, setTradeMode] = useState(""); // 'sell' or 'transfer'
  const [amount, setAmount] = useState(""); // Amount in coins or USD
  const [recipient, setRecipient] = useState(""); // Recipient address for transfer
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  useEffect(() => {
    const fetchUserDetails = async () => {
      
      try {
        const response = await axios.get('http://localhost:5000/user/api/user/details', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Include auth token if needed
          }
        });
        setUserDetails(response.data.userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  // Sample data
  // const sampleData = {
  //   balance: {
  //     Bitcoin: 2.5,
  //     Ethereum: 10,
  //     Dogecoin: 15000,
  //   },
  //   transactions: [
  //     {
  //       coin: "Bitcoin",
  //       amount: 0.5,
  //       action: "Sent",
  //       timestamp: "2024-12-15T10:30:00Z",
  //     },
  //     {
  //       coin: "Ethereum",
  //       amount: 2,
  //       action: "Received",
  //       timestamp: "2024-12-14T14:45:00Z",
  //     },
  //     {
  //       coin: "Dogecoin",
  //       amount: 1000,
  //       action: "Purchased",
  //       timestamp: "2024-12-13T09:15:00Z",
  //     },
  //     {
  //       coin: "Bitcoin",
  //       amount: 1,
  //       action: "Sold",
  //       timestamp: "2024-12-12T16:20:00Z",
  //     },
  //   ],
  // };

  // // Simulate fetching data
  // useEffect(() => {
  //   setUserDetails(sampleData);
  // }, []);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    var id = coin.toLowerCase();
    navigate(`/coin/${id}`);
  };

  const getActionStyle = (action) => {
    switch (action) {
      case "Sent":
        return { color: "red", symbol: "→" };
      case "Received":
        return { color: "green", symbol: "←" };
      case "Sold":
        return { color: "red", icon: <ArrowUpwardIcon color="error" /> };
      case "Purchased":
        return { color: "green", icon: <ArrowDownwardIcon color="success" /> };
      default:
        return { color: "gray", symbol: null, icon: null };
    }
  };
  if(!token){
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Please log in to view your portfolio</Typography>
      </Box>
    );
  }
  if (!userDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Balances
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(userDetails.balance).map(([coin, amount]) => (
              amount > 0 && (
                <Grid item xs={12} sm={6} md={4} key={coin}>
            <Card variant="outlined" onClick={() => handleCoinClick(coin)}>
              <CardContent>
                <Typography variant="h6">{coin}</Typography>
                <Typography variant="body1">
                  {amount} {coin}
                </Typography>
              </CardContent>
            </Card>
                </Grid>
              )
            ))}
          </Grid>

          {/* Transaction History Section */}
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Transaction History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Coin</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userDetails.transactions.map((tx, index) => {
                  const { color, symbol, icon } = getActionStyle(tx.action);
                  return (
                    <TableRow key={index}>
                      <TableCell>{tx.coin}</TableCell>
                      <TableCell align="right">{tx.amount}</TableCell>
                      <TableCell>
                        {symbol ? (
                          <Typography
                            variant="body1"
                            sx={{ color, fontWeight: "bold" }}
                          >
                            {symbol} {tx.action}
                          </Typography>
                        ) : (
                          <Chip
                            label={tx.action}
                            icon={icon}
                            sx={{ color, fontWeight: "bold" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default Portfolio;
