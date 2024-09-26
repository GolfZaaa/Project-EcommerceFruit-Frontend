import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

export default function ShopAddressScreen() {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={4}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: 3,
            padding: 3,
          }}
        >
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Create Address
            </Typography>
            <Box mt={2}>
              <TextField
                fullWidth
                label="Street"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="State"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Postal Code"
                variant="outlined"
                margin="normal"
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="primary" size="large" fullWidth>
              Submit
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
}
