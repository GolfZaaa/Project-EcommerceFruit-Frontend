import { Typography, TextField, Button, Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

const SearchOrderToSendList = () => {
  const [orderId, setOrderId] = useState<string | null>(null);

  const onSearchOrder = () => {};

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        ค้นหาคำสั่งซื้อที่ต้องการรับ
      </Typography>

      <div
        style={{
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              value={orderId}
              fullWidth
              label="รหัสคำสั่งซื้อสินค้า"
              margin="normal"
              name="district"
              onChange={(e) => setOrderId(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <div
              style={{
                marginTop: 15,
              }}
            >
              <Button
                style={{
                  padding: 15,
                }}
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => onSearchOrder()}
              >
                ค้นหา
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default observer(SearchOrderToSendList);
