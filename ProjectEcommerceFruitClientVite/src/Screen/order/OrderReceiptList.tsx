import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import NotFoundScreen from "../NotFoundScreen";
import MyCardOrderReceipt from "./MyCardOrderReceipt";
import { Typography, TextField, Button, Grid, Fab } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Lottie from "react-lottie";
import lottiteEmpty from "../../assets/lotties/lf20_qh5z2fdq.json";
import MyLottie from "../../helper/components/MyLottie";
import { myToast } from "../../helper/components";
import MyContent from "../../component/MyContent";

const OrderReceiptList = () => {
  const { token } = useStore().commonStore;
  const { orderWantToReceipt, searchOrdersWantToReceipt, loadingOrder } =
    useStore().orderStore;

  const [subDistrict, setSubDistrict] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  useEffect(() => {
    let params = new URLSearchParams();

    if (district && district !== "") {
      params.append("district", district);
    }

    if (subDistrict && subDistrict !== "") {
      params.append("subDistrict", subDistrict);
    }

    searchOrdersWantToReceipt(params);
  }, []);

  const data = orderWantToReceipt?.map((item: any) => ({
    order: item?.order,
    address: item?.address,
  }));

  const onSearchOrder = () => {
    if (district === null && subDistrict === null) {
      myToast("กรุณากรอก อำเภอ หรือ ตำบล");
    } else {
      let params = new URLSearchParams();

      if (district && district !== "") {
        params.append("district", district);
      }

      if (subDistrict && subDistrict !== "") {
        params.append("subDistrict", subDistrict);
      }

      searchOrdersWantToReceipt(params);
    }
  };

  return token === null ? (
    <NotFoundScreen name={"เข้าสู่ระบบก่อน"} />
  ) : (
    <div className="pt-10">
      <div
        style={{
          marginTop: 20,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <p className="FontPublic font-semibold">
            <MyContent name="คำสั่งซื้อที่สามารถรับหิ้วได้" fontSize="large" />
          </p>
        </Typography>
      </div>

      {loadingOrder ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="inherit" />
          <p className="pl-3">
            <MyContent name="กำลังโหลด" fontSize="large" />
          </p>
        </div>
      ) : (
        <div
          style={{
            padding: "0 20px 0 20px",
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            align="left"
            color={"red"}
            marginBottom={-1}
          >
            <p className="FontPublic font-medium">
              <MyContent name="ค้นหาพื้นที่ที่คุณกำลังจะไป" fontSize="normal" />
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
              <Grid item xs={5}>
                <TextField
                  value={subDistrict}
                  fullWidth
                  label="ตำบล"
                  margin="normal"
                  name="subDistrict"
                  onChange={(e) => setSubDistrict(e.target.value)}
                  sx={{
                    width: "101.5%",
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "1rem",
                      color: "#333",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      borderRadius: "50px 0 0 50px",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.2rem",
                      top: -3,
                      color: "#888",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  value={district}
                  fullWidth
                  label="อำเภอ"
                  margin="normal"
                  name="district"
                  onChange={(e) => setDistrict(e.target.value)}
                  sx={{
                    width: "101.5%",
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "1rem",
                      color: "#333",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      borderRadius: 0,
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.2rem",
                      top: -3,
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
                    onClick={() => onSearchOrder()}
                    sx={{
                      width: "100%",
                      borderRadius: "0 50px 50px 0",
                      height: 56,
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      transition: "all 0.3s ease-in-out",
                      zIndex: 1,
                    }}
                  >
                    <p className="FontPublic">
                      <MyContent name="ค้นหา" fontSize="littlenormal" />
                    </p>
                  </Fab>
                  {/* <Button
                    style={{
                      padding: 10,
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => onSearchOrder()}
                  >
                    <p className="FontPublic">
                      <MyContent name="ค้นหา" fontSize="littlenormal" />
                    </p>
                  </Button> */}
                </div>
              </Grid>
            </Grid>
          </div>

          {data?.length ? (
            <MyCardOrderReceipt data={data} />
          ) : (
            <div>
              <MyLottie lottieFile={lottiteEmpty} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 30,
                }}
              >
                ไม่มีสินค้าที่รับหิ้วได้
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(OrderReceiptList);
