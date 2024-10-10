import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import NotFoundScreen from "../NotFoundScreen";
import MyCardOrderReceipt from "./MyCardOrderReceipt";
import { Typography, TextField, Button, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Lottie from "react-lottie";
import lottiteEmpty from "../../assets/lotties/lf20_qh5z2fdq.json";
import MyLottie from "../../helper/components/MyLottie";
import { myToast } from "../../helper/components";

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
    <div>
      <div
        style={{
          marginTop: 20,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          คำสั่งซื้อที่สามารถรับหิ้วได้
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
          <p className="pl-3">กำลังโหลด</p>
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
            ค้นหาพื้นที่ที่คุณกำลังจะไป
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
