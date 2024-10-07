import { Typography, TextField, Button, Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomTabPanel } from "./MyOrderToSendList";
import CircularProgress from "@mui/material/CircularProgress";
import MyOrderCardSearch from "./components/MyOrderCardSearch";
import MyOrderCardWantToForward from "./components/MyOrderCardWantToForward";

const SearchOrderToSendList = () => {
  const {
    order,
    searchOrderToSendByOrderId,
    getMyOrderUserWantToTaketoSend,
    loadingOrder,
    setOrder,
  } = useStore().orderStore;

  const [orderId, setOrderId] = useState<string | null>("KRU-");
  const [value, setValue] = useState(0);
  const [showOrderEmpty, setShowOrderEmpty] = useState<boolean>(false);

  useEffect(() => {
    if (orderId === "KRU-") {
      setShowOrderEmpty(false);
    }
  }, [orderId]);

  const handleChange = (value: number) => {
    setValue(value);
  };

  const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.startsWith("KRU-")) {
      setOrderId(value);
    }
  };

  const onSearchOrder = () => {
    searchOrderToSendByOrderId(orderId).then((res) => {
      console.log("res", res.length);

      if (res.length === 0) {
        setShowOrderEmpty(true);
      }
    });
  };

  return (
    <>
      <div>
        <Tabs
          value={value}
          onChange={(_, v) => handleChange(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          style={{
            width: "100%",
          }}
        >
          <Tab
            onClick={() => setOrder([])}
            label="ที่ต้องการรับ"
            style={{
              width: "100%",
            }}
          />
          <Tab
            label="ที่ต้องการส่งต่อ"
            style={{
              width: "100%",
            }}
            onClick={() => getMyOrderUserWantToTaketoSend()}
          />
        </Tabs>
      </div>

      <CustomTabPanel value={value} index={0}>
        <div>
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
                  onChange={handleOrderIdChange}
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
                    onClick={onSearchOrder}
                  >
                    {loadingOrder ? (
                      <div>
                        <CircularProgress size={17} color="inherit" />
                      </div>
                    ) : (
                      "ค้นหา"
                    )}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
          <div>
            <MyOrderCardSearch
              order={order}
              showOrderEmpty={showOrderEmpty}
              index={0}
            />
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MyOrderCardWantToForward order={order} index={1} />
      </CustomTabPanel>
    </>
  );
};

export default observer(SearchOrderToSendList);
