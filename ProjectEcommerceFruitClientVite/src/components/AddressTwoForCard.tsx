import React from "react";
import { Fab, Grid, Typography } from "@mui/material";
import MyLottie from "../helper/components/MyLottie";
import lottiteDelivery from "../assets/lotties/delivery.json";
import { OrderToReceipt } from "../Screen/order/MyCardOrderReceipt";
import { User } from "../models/User";
import { Address } from "../models/Address";
import MyContent from "./MyContent";

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
    <Grid container justifyContent="space-evenly" spacing={4}>
      <Grid
        item
        xs={12}
        md={4}
        container
        alignItems="center"
        justifyContent="center"
      >
        <div>
          <Typography fontSize={22}>
            <p className="FontPublic">
          <MyContent name={`ชื่อ-ที่อยู่ร้านค้า : ${Astore?.address?.user?.fullName}`} fontSize="littlenormal" />
          </p>            
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
            <MyContent name={`เบอร์ : ${Astore?.address?.user?.phoneNumber}`} fontSize="littlenormal" />
            </p>
            
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
            <MyContent name={`บ้านเลขที่ : ${Astore?.address?.detail}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
            <MyContent name={`แขวง/ตำบล : ${Astore?.address?.subDistrict}`} fontSize="littlenormal" />
            </p>
            
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
            <MyContent name={`เขต/อำเภอ : ${Astore?.address?.district}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
            <MyContent name={`จังหวัด : ${Astore?.address?.province}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
            <MyContent name={`รหัสไปรษณีย์ : ${Astore?.address?.postCode}`} fontSize="littlenormal" />
            </p>
          </Typography>
        </div>
      </Grid>

      <Grid
        item
        xs={12}
        md={4}
        container
        alignItems="center"
        justifyContent="center"
      >
        <MyLottie lottieFile={lottiteDelivery} />
      </Grid>

      <Grid
        item
        xs={12}
        md={4}
        container
        alignItems="center"
        justifyContent="center"
      >
        <div>
          <Typography fontSize={22}>
          <p className="FontPublic">
          <MyContent name={`ชื่อ-ที่อยู่ลูกค้า : ${ACustomer?.order?.address?.user?.fullName}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
          <MyContent name={`เบอร์ : ${ACustomer?.order?.address?.user?.phoneNumber}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
          <MyContent name={`บ้านเลขที่ : ${ACustomer?.order?.address?.detail}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
          <MyContent name={`แขวง/ตำบล : ${ACustomer?.order?.address?.subDistrict}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
          <MyContent name={`เขต/อำเภอ : ${ACustomer?.order?.address?.district}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
          <p className="FontPublic">
              <MyContent name={`จังหวัด : ${ACustomer?.order?.address?.province}`} fontSize="littlenormal" />
            </p>
          </Typography>
          <Typography fontSize={22}>
            <p className="FontPublic">
               <MyContent name={`รหัสไปรษณีย์ : ${ACustomer?.order?.address?.postCode}`} fontSize="littlenormal" />
            </p>
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};

export default AddressTwoForCard;
