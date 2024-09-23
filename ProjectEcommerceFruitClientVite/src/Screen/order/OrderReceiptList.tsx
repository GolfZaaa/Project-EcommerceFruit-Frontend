import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../../store/store";
import NotFoundScreen from "../NotFoundScreen";
import MyCardOrderReceipt from "./MyCardOrderReceipt";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const OrderReceiptList = () => {
  const { token } = useStore().commonStore;
  const { order, getOrdersWantToReceipt, loadingOrder } = useStore().orderStore;

  useEffect(() => {
    getOrdersWantToReceipt();
  }, []);

  const data = order?.map((item: any) => ({
    order: item?.order,
    address: item?.address,
  }));

  console.log("order", order);

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
          <div
            style={{
              fontSize: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "red",
              marginBottom: 20,
            }}
          >
            พื้นที่ทำค้นหาที่อยู่ร้านค้า
          </div>

          {data?.length ? <MyCardOrderReceipt data={data} /> : <></>}
        </div>
      )}
    </div>
  );
};

export default observer(OrderReceiptList);
