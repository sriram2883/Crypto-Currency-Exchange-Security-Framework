import React, { useEffect } from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";
import svg1 from "../images/flaticon/001-bitcoin.svg";
import svgChat from "../images/flaticon/001-chat.svg";
import svgExchangeRate from "../images/flaticon/004-exchange.svg";
import svgMobile from "../images/flaticon/003-smartphone.svg";
import svgUpdate from "../images/flaticon/005-idea.svg";
import svgWorldwide from "../images/flaticon/worldwide.svg";

const features = [
  {
    svg: svg1,
    title: "Statistics",
    description: "Statistics and charts are available in real-time.",
  },
  {
    svg: svgChat,
    title: "Community",
    description: "Be informed about upcoming cryptocurrency events in your area.",
  },
  {
    svg: svgExchangeRate,
    title: "Exchange Rates",
    description: "View up to date exchange rates for your favourite cryptocurrencies.",
  },
  {
    svg: svgMobile,
    title: "Mobile Friendly",
    description: "This site aims to be mobile friendly. View website on any device you like.",
  },
  {
    svg: svgUpdate,
    title: "Updates",
    description: "App is continuously updated with the latest data, reflecting coingecko API.",
  },
  {
    svg: svgWorldwide,
    title: "Global",
    description: "Data availability on a global scale.",
  },
];

function Home({ setHeaderMenuItem }) {
  useEffect(() => {
    setHeaderMenuItem && setHeaderMenuItem("home");
  }, [setHeaderMenuItem]);

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h2" gutterBottom>
        Crypto
      </Typography>
      <Typography variant="body1" paragraph>
        Bringing you cryptocurrency related data in a user-friendly, digestible dashboard platform.
      </Typography>

      <Typography variant="h3" gutterBottom>
        Features
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ boxShadow: "none", textAlign: "center" }}>
              <CardMedia
                component="img"
                image={feature.svg}
                alt={feature.title}
                sx={{ padding: "2rem", maxWidth: "160px", margin: "auto" }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" display="block" align="center" mt={2}>
        Icons provided by Flaticon.
      </Typography>
    </Box>
  );
}

export default Home;
