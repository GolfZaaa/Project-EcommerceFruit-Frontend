import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { observer } from "mobx-react-lite";
import { Order } from "../../models/Order";
import { useState } from "react";
import { useStore } from "../../store/store";
import { pathImages } from "../../constants/RoutePath";

interface props {
  onChangeCU?: any | null;
  dataEdit?: Order | null;
}

const EditOrderScreen = ({ onChangeCU, dataEdit }: props) => {
  const { confirmOrder, cancelOrder } = useStore().orderStore;

  const [trackingId, setTrackingId] = useState(dataEdit?.tag || null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      orderId: dataEdit?.id || 0,
      trackingId: formData.tag,
    };
    await confirmOrder(dataForm).then((result) => {
      if (result) {
        onChangeCU();
      }
    });
  };

  const handleCancel = async (values: any) => {
    await cancelOrder(values).then((result) => {
      if (!!result) {
        onChangeCU();
      }
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      component="form"
      onSubmit={handleSubmit}
    >
      <Card
        sx={{
          width: "100%",
          boxShadow: 3,
          padding: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={onChangeCU}
            >
              กลับ
            </Button>
          </Grid>
          <Grid item xs={11} />
        </Grid>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            คำสั่งซื้อ
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {dataEdit?.paymentImage ? (
                <img
                  src={pathImages.paymentImage + dataEdit?.paymentImage}
                  alt={pathImages.paymentImage + dataEdit?.paymentImage}
                  height={200}
                  width={200}
                />
              ) : (
                "ไม่มีรูปภาพ"
              )}
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom align="left">
                    ประเภทการขนส่ง : {dataEdit?.shippingType}
                  </Typography>
                  {/* <TextField
                    defaultValue={dataEdit?.shippingType}
                    fullWidth
                    label="ประเภทการขนส่ง"
                    variant="outlined"
                    margin="normal"
                    name="shippingType"
                    autoFocus
                    required
                    disabled={dataEdit?.status == 1}
                  /> */}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    defaultValue={trackingId}
                    fullWidth
                    onChange={(e) => setTrackingId(e.target.value)}
                    label="หมายเลขพัสดุ (tracking)"
                    variant="outlined"
                    margin="normal"
                    name="tag"
                    autoFocus
                    required
                    disabled={dataEdit?.status == 1 || dataEdit?.status == 2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <label>ที่อยู่ผู้สั่งซื้อ</label>
                  <Typography gutterBottom align="left">
                    {dataEdit?.address?.detail} แขวง/ตำบล
                    {dataEdit?.address?.subDistrict} เขต/อำเภอ
                    {dataEdit?.address?.district} จังหวัด
                    {dataEdit?.address?.province} รหัสไปรษณีย์{" "}
                    {dataEdit?.address?.postCode}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        {dataEdit?.orderItems.map((item, i) => (
          <Grid container spacing={2} key={i}>
            <Grid item xs={12} mt={2}>
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-white md:p-6">
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <img
                      className="hidden h-20 w-20 dark:block"
                      src={pathImages.product + item.product.images || ""}
                      alt={item.product.images || "product image"}
                    />
                    <label className="sr-only">Choose quantity:</label>
                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center">
                        จำนวน {item.quantity} ชิ้น
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-gray-900">
                          {item.product.price * item.quantity} บาท
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <p className="text-sm text-gray-500 font-bold">
                        ประเภท : {item.product.productGI.category.name}
                      </p>
                      ชื่อ : {item.product.productGI.name}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        ))}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography align="center" color={"red"}>
              * โปรดใส่หมายเลขพัสดุก่อนยืนยันคำสั่งซื้อ
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              fullWidth
              disabled={
                !trackingId || dataEdit?.status == 1 || dataEdit?.status == 2
              }
            >
              ยืนยันคำสั่งซื้อ
            </Button>
          </Grid>
          <Grid item xs={6}>
            <CardActions sx={{ justifyContent: "center", mt: 2 }}>
              <Button
                onClick={() => handleCancel({ orderId: dataEdit?.id })}
                variant="contained"
                color="error"
                size="large"
                fullWidth
                disabled={dataEdit?.status == 1 || dataEdit?.status == 2}
              >
                ยกเลิกคำสั่งซื้อ
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default observer(EditOrderScreen);
