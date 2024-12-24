import { Typography, TextField, Button, Grid, Fab } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomTabPanel } from "./MyOrderToSendList";
import CircularProgress from "@mui/material/CircularProgress";
import MyOrderCardSearch from "./components/MyOrderCardSearch";
import MyOrderCardWantToForward from "./components/MyOrderCardWantToForward";
import MyContent from "../../component/MyContent";

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
      if (res.length === 0) {
        setShowOrderEmpty(true);
      }
    });
  };

  return (
    <div className="FontPublic">
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
            label={
              <p className="FontPublic">
                <MyContent name="ที่ต้องการรับ" fontSize="small" />
              </p>
            }
            style={{
              width: "100%",
            }}
          />
          <Tab
            label={
              <p className="FontPublic">
                <MyContent name="ที่ต้องการส่งต่อ" fontSize="small" />
              </p>
            }
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
            <p className="FontPublic font-semibold">
              <MyContent name="ค้นหาคำสั่งซื้อที่ต้องการรับ" fontSize="large" />
            </p>
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
                  sx={{
                    width: "101%",
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                      color: "#333",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      borderRadius: "50px 0 0 50px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.2rem",
                      color: "#888",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <div
                  style={{
                    marginTop: 16,
                  }}
                >
                  <Fab
                    variant="extended"
                    color="primary"
                    onClick={onSearchOrder}
                    sx={{
                      width: "100%",
                      borderRadius: "0 50px 50px 0",
                      height: 67,
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      transition: "all 0.3s ease-in-out",
                      zIndex: 1,
                    }}
                  >
                    {loadingOrder ? (
                      <div>
                        <CircularProgress size={17} color="inherit" />
                      </div>
                    ) : (
                      <p className="FontPublic">
                        <MyContent name="ค้นหา" fontSize="small" />
                      </p>
                    )}
                  </Fab>
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
    </div>
  );
};

export default observer(SearchOrderToSendList);
