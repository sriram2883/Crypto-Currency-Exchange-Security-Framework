import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";

// Replace these paths with actual image files for each team member or relevant graphics
// import missionImage from "./path/to/missionImage.jpg";
// import valueImage from "./path/to/valueImage.jpg";
// import teamImage from "./path/to/teamImage.jpg";

function About() {
    const missionImage = "https://tse4.mm.bing.net/th?id=OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8&pid=Api&P=0&h=180";
    const valueImage = "https://tse4.mm.bing.net/th?id=OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8&pid=Api&P=0&h=180";
    const teamImage = "https://tse4.mm.bing.net/th?id=OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8&pid=Api&P=0&h=180";
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f4f6f8" }}>
      <Container maxWidth="lg">
        {/* Mission Section */}
        <Typography variant="h2" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Empowering users with insightful cryptocurrency data and tools.
        </Typography>

        <Grid container spacing={4} sx={{ marginTop: "3rem" }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: "none", backgroundColor: "transparent" }}>
              <CardMedia
                component="img"
                image={missionImage}
                alt="Mission"
                sx={{ borderRadius: "8px" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} display="flex" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our mission is to make cryptocurrency information accessible, reliable, and actionable
                for everyone. We believe in transparency, empowerment, and bringing global
                cryptocurrency data to users in a way that's intuitive and useful.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Core Values Section */}
        <Typography variant="h3" align="center" sx={{ marginTop: "4rem" }}>
          Our Core Values
        </Typography>
        <Grid container spacing={4} sx={{ marginTop: "1.5rem" }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", boxShadow: "none" }}>
              <CardMedia
                component="img"
                image={valueImage}
                alt="Transparency"
                sx={{ width: "80px", height: "80px", margin: "1rem auto" }}
              />
              <CardContent>
                <Typography variant="h5">Transparency</Typography>
                <Typography variant="body2" color="text.secondary">
                  Providing reliable and open access to accurate data.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", boxShadow: "none" }}>
              <CardMedia
                component="img"
                image={valueImage}
                alt="Innovation"
                sx={{ width: "80px", height: "80px", margin: "1rem auto" }}
              />
              <CardContent>
                <Typography variant="h5">Innovation</Typography>
                <Typography variant="body2" color="text.secondary">
                  Continuously improving our platform with cutting-edge solutions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", boxShadow: "none" }}>
              <CardMedia
                component="img"
                image={valueImage}
                alt="Community"
                sx={{ width: "80px", height: "80px", margin: "1rem auto" }}
              />
              <CardContent>
                <Typography variant="h5">Community</Typography>
                <Typography variant="body2" color="text.secondary">
                  Building a supportive community of cryptocurrency enthusiasts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Typography variant="h3" align="center" sx={{ marginTop: "4rem" }}>
          Meet the Team
        </Typography>
        <Grid container spacing={4} sx={{ marginTop: "1.5rem" }}>
          {[1, 2, 3].map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member}>
              <Card sx={{ boxShadow: "none", textAlign: "center" }}>
                <CardMedia
                  component="img"
                  image={teamImage} // Use actual team member images here
                  alt="Team Member"
                  sx={{ width: "120px", height: "120px", borderRadius: "50%", margin: "1rem auto" }}
                />
                <CardContent>
                  <Typography variant="h5">John Doe</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lead Developer
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default About;
