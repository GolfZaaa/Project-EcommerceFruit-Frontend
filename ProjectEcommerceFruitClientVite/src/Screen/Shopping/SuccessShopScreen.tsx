import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RoutePath } from "../../constants/RoutePath";
import { useStore } from "../../store/store";

export default function SuccessShopScreen() {
  const { getUserDetailbyId } = useStore().userStore;

  useEffect(() => {
    getUserDetailbyId();
  }, []);

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
              Success
            </Typography>
            <Box mt={2}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                align="center"
              >
                บันทึกข้อมูลสำเร็จ
              </Typography>
              <Typography
                variant="h6"
                component="h1"
                gutterBottom
                align="center"
                color={"gray"}
              >
                คุณสามารถขายสินค้าได้ทันที
              </Typography>
            </Box>
          </CardContent>
          {/* <CardActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="primary" size="large" fullWidth>
              Create Shop
            </Button>
          </CardActions> */}
        </Card>
      </Box>
    </Container>
  );
}
