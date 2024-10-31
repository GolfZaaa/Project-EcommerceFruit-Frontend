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
  <Grid container spacing={2} className="p-4">
    <Grid item xs={12}>
      <Typography variant="h6" fontSize={{ xs: 18, sm: 20, md: 22 }} fontWeight="bold">
        ชื่อ-ที่อยู่ลูกค้า : {ACustomer?.user?.fullName}
      </Typography>
    </Grid>

    <Grid container item xs={12} spacing={2} className="mt-4">
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          เบอร์ : {ACustomer?.user?.phoneNumber}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          บ้านเลขที่ {ACustomer?.address?.detail}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          แขวง/ตำบล {ACustomer?.address?.subDistrict}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          เขต/อำเภอ {ACustomer?.address?.district}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          จังหวัด {ACustomer?.address?.province}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          รหัสไปรษณีย์ {ACustomer?.address?.postCode}
        </Typography>
      </Grid>
    </Grid>
  </Grid>
</div>

  );
};

export default AddressForCard;
