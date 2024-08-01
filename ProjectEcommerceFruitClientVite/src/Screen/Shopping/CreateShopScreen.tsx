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
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";

export default observer(function CreateShopScreen() {
  const navigate = useNavigate();
  const { createandupdate } = useStore().shopuserStore;


  const { usershop } = useStore().shopuserStore;
  console.log("usershopusershop",usershop)

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    await createandupdate(formData);
    navigate("/SuccessShopScreen");
    console.log("formData", formData);
  };

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
              {usershop && usershop.id ? <p>แก้ไขรายละเอียด</p> : <p>สร้างร้านค้า</p>}
            </Typography>
            <Box mt={2} component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Shop Name"
                variant="outlined"
                margin="normal"
                name="Name"
                autoFocus
                required
              />
              <TextField
                fullWidth
                label="Shop Address"
                variant="outlined"
                margin="normal"
                name="Description"
                required
              />
              <TextField
                fullWidth
                label="Shop Description"
                variant="outlined"
                margin="normal"
                name="Id"
                defaultValue={0}
                style={{ display: "none" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Create Shop
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
