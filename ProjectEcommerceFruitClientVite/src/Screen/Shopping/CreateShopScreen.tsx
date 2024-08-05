import React, { useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { RoutePath } from "../../constants/RoutePath";

export default observer(function CreateShopScreen() {
  const navigate = useNavigate();
  const { usershop, GetShopByUserId, createandupdate } =
    useStore().shopuserStore;

  useEffect(() => {
    GetShopByUserId();
  }, []);

  console.log("usershop", JSON.stringify(usershop));

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    await createandupdate(formData).then((result) => {
      if (result) {
        navigate(RoutePath.successShopScreen);
      }
      console.log("res", result);
    });
    console.log("formData", formData);
  };

  return (
    <Container maxWidth="md">
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
              {usershop && usershop.id ? (
                <p>แก้ไขรายละเอียด</p>
              ) : (
                <p>สร้างร้านค้า</p>
              )}
            </Typography>
            <Box mt={2} component="form" onSubmit={handleSubmit}>
              <TextField
                defaultValue={usershop?.name}
                fullWidth
                label="ชื่อร้านค้า"
                variant="outlined"
                margin="normal"
                name="name"
                autoFocus
                required
              />
              <TextField
                defaultValue={usershop?.description}
                fullWidth
                label="รายละเอียด"
                variant="outlined"
                margin="normal"
                name="description"
                required
              />
              <TextField
                value={usershop?.id || 0}
                fullWidth
                label="Shop Id"
                variant="outlined"
                margin="normal"
                name="id"
                style={{ display: "none" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                บันทึก
              </Button>
            </Box>
          </CardContent>
          {/* <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Link to={"/SuccessShopScreen"}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              fullWidth
            >
              Create Shop
            </Button>
            </Link>
          </CardActions> */}
        </Card>
      </Box>
    </Container>
  );
});
