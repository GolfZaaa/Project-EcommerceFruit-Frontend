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
        <p className="FontPublic underline">
          ชื่อ-ที่อยู่ลูกค้า : {ACustomer?.user?.fullName}
        </p>
      </Typography>
    </Grid>

    <Grid container item xs={12} spacing={2} className="mt-4">
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          <p className="FontPublic font-medium">
          เบอร์ : {ACustomer?.user?.phoneNumber}
          </p>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          <p className="FontPublic font-medium">
          บ้านเลขที่ {ACustomer?.address?.detail}
          </p>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          <p className="FontPublic font-medium">
          แขวง/ตำบล {ACustomer?.address?.subDistrict}
          </p>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          <p className="FontPublic font-medium">
            เขต/อำเภอ {ACustomer?.address?.district}
          </p>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          <p className="FontPublic font-medium">
          จังหวัด {ACustomer?.address?.province}
          </p>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography fontSize={{ xs: 16, sm: 18, md: 20 }}>
          <p className="FontPublic font-medium">
          รหัสไปรษณีย์ {ACustomer?.address?.postCode}
          </p>
        </Typography>
      </Grid>
    </Grid>
  </Grid>
</div>

  );
};

export default AddressForCard;
