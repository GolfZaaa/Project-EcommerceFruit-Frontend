import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import {
  TextField,
  Box,
  CardActions,
  Button,
  Container,
  CardContent,
  Typography,
} from "@mui/material";

const DashboardAdminShowSystemSetting = () => {
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      id: 0,
      name: formData.name,
      description: formData.description,
    };
  };

  return (
    <div className="-mt-16">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <p>แก้ไขรายละเอียด</p>
        </Typography>
        <Box
          mt={2}
          component="form"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
          }}
        >
          <TextField
            //   defaultValue={data?.fullName}
            fullWidth
            label="ชื่อ-นามสกุล"
            variant="outlined"
            margin="normal"
            name="fullName"
            autoFocus
            required
          />
          <CardActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              บันทึก
            </Button>
          </CardActions>{" "}
        </Box>
      </Container>
    </div>
  );
};

export default DashboardAdminShowSystemSetting;
