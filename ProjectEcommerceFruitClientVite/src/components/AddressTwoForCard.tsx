import React from "react";
import { Fab, Grid, Typography } from "@mui/material";
import MyLottie from "../helper/components/MyLottie";
import lottiteDelivery from "../assets/lotties/delivery.json";
import { OrderToReceipt } from "../Screen/order/MyCardOrderReceipt";
import { User } from "../models/User";
import { Address } from "../models/Address";

interface props {
  Astore?: {
    user?: User;
    address?: Address;
  };
  ACustomer?: {
    user?: User;
    order?: {
      address?: Address;
    };
  };
}

const AddressTwoForCard = ({ Astore, ACustomer }: props) => {
  return (
    <Grid container justifyContent="space-evenly">
      <Grid alignContent="center" item>
        <div>
          <Typography fontSize={22}>
            ชื่อ-ที่อยู่ร้านค้า : {Astore?.address?.user?.fullName}
          </Typography>
          <Typography fontSize={22}>
            เบอร์ : {Astore?.address?.user?.phoneNumber}
          </Typography>
          <Typography fontSize={22}>
            บ้านเลขที่ {Astore?.address?.detail}
          </Typography>
          <Typography fontSize={22}>
            แขวง/ตำบล
            {Astore?.address?.subDistrict}
          </Typography>
          <Typography fontSize={22}>
            เขต/อำเภอ
            {Astore?.address?.district}
          </Typography>
          <Typography fontSize={22}>
            จังหวัด
            {Astore?.address?.province}
          </Typography>
          <Typography fontSize={22}>
            รหัสไปรษณีย์ {Astore?.address?.postCode}
          </Typography>
        </div>
      </Grid>
      <Grid item>
        <MyLottie lottieFile={lottiteDelivery} />
      </Grid>
      <Grid alignContent="center">
        <div>
          <Typography fontSize={22}>
            ชื่อ-ที่อยู่ลูกค้า : {ACustomer?.order?.address?.user?.fullName}
          </Typography>
          <Typography fontSize={22}>
            เบอร์ : {ACustomer?.order?.address?.user?.phoneNumber}
          </Typography>
          <Typography fontSize={22}>
            บ้านเลขที่ {ACustomer?.order?.address?.detail}
          </Typography>
          <Typography fontSize={22}>
            แขวง/ตำบล
            {ACustomer?.order?.address?.subDistrict}
          </Typography>
          <Typography fontSize={22}>
            เขต/อำเภอ
            {ACustomer?.order?.address?.district}
          </Typography>
          <Typography fontSize={22}>
            จังหวัด
            {ACustomer?.order?.address?.province}
          </Typography>
          <Typography fontSize={22}>
            รหัสไปรษณีย์ {ACustomer?.order?.address?.postCode}
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};

export default AddressTwoForCard;
