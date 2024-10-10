import React from "react";
import { Grid, Typography } from "@mui/material";
import { User } from "../models/User";
import { Address } from "../models/Address";

interface props {
  ACustomer?: {
    user?: User;
    address?: Address;
  };
}

const AddressForCard = ({ ACustomer }: props) => {
  return (
    <div>
      <Grid alignContent="center" item xs={4}>
        <Typography fontSize={22}>
          ชื่อ-ที่อยู่ลูกค้า : {ACustomer?.user?.fullName}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-evenly">
        <Grid alignContent="center" item xs={4}>
          <Typography fontSize={20}>
            เบอร์ : {ACustomer?.user?.phoneNumber}
          </Typography>
        </Grid>
        <Grid alignContent="center" item xs={4}>
          <Typography fontSize={20}>
            บ้านเลขที่ {ACustomer?.address?.detail}
          </Typography>
        </Grid>
        <Grid alignContent="center" item xs={4}>
          <Typography fontSize={20}>
            แขวง/ตำบล
            {ACustomer?.address?.subDistrict}
          </Typography>
        </Grid>
        <Grid alignContent="center" item xs={4}>
          <Typography fontSize={20}>
            เขต/อำเภอ
            {ACustomer?.address?.district}
          </Typography>
        </Grid>
        <Grid alignContent="center" item xs={4}>
          <Typography fontSize={20}>
            จังหวัด
            {ACustomer?.address?.province}
          </Typography>
        </Grid>
        <Grid alignContent="center" item xs={4}>
          <Typography fontSize={20}>
            รหัสไปรษณีย์ {ACustomer?.address?.postCode}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddressForCard;
