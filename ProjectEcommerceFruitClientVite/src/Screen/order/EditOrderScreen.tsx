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
  Fab,
  MenuItem,
  Select,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { observer } from "mobx-react-lite";
import { Order } from "../../models/Order";
import { useState } from "react";
import { useStore } from "../../store/store";
import { pathImages } from "../../constants/RoutePath";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Product } from "../../models/Product";
import { CartItem } from "../../models/CartItem";
import { formatNumberWithCommas } from "../../helper/components";
import { OrderItem } from "../../models/OrderItem";

interface props {
  onChangeCU?: any | null;
  dataEdit?: Order | null;
}

const EditOrderScreen = ({ onChangeCU, dataEdit }: props) => {
  const { confirmOrder, cancelOrder } = useStore().orderStore;
  const { systemSetting } = useStore().systemSettingStore;

  const [trackingId, setTrackingId] = useState(
    dataEdit?.tag || "จัดส่งผ่านผู้รับหิ้ว"
  );

  const [selectCate, setSelectCate] = useState(
    dataEdit?.shippingType || "อื่น ๆ"
  );

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      orderId: dataEdit?.id || 0,
      trackingId: dataEdit?.status === 1 ? trackingId : null,
      shippingType: !!selectCate ? selectCate : null,
    };

    console.log("dataForm", dataForm);
    console.log("formData", formData.tag);

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

  const onSelectCate = (name: string) => {
    if (name === "อื่น ๆ") {
      setTrackingId("จัดส่งผ่านผู้รับหิ้ว");
    } else {
      setTrackingId("");
    }
    setSelectCate(name);
  };

  const categorySend = [
    {
      id: 1,
      name: "ส่งไปรษณีย์แบบลงทะเบียน",
    },
    {
      id: 2,
      name: "ส่งแบบไปรษณีย์ด่วนพิเศษ ( EMS )",
    },
    {
      id: 3,
      name: "เคอรี่ เอ็กซ์เพรส (Kerry Express)",
    },
    {
      id: 4,
      name: "เจแอนด์ที เอ็กซ์เพรส (J&T Express) ",
    },
    {
      id: 5,
      name: "แฟลช เอ็กซ์เพรส (Flash Express) ",
    },
    {
      id: 6,
      name: "เบสท์ เอ็กซ์เพรส (Best Express)",
    },
    {
      id: 7,
      name: "นินจา แวน (Ninja Van)",
    },
    {
      id: 8,
      name: "อื่น ๆ",
    },
  ];

  const calculateTotalPrice = () => {
    return dataEdit?.orderItems.reduce((total, item: OrderItem) => {
      // const storeTotal = item.product.reduce(
      //   (storeSum: number, product: Product) => {
      //     return storeSum + item.quantity * product.price;
      //   },
      //   0
      // );

      total = item.product.price * item.quantity + total;

      return total;
    }, 0);
  };

  const totalPrice: any = calculateTotalPrice();
  const formattedTotalPrice = formatNumberWithCommas(totalPrice);

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
            <Fab variant="extended" color="primary" onClick={onChangeCU}>
              <ArrowBackIosIcon sx={{ mr: 1 }} />
              กลับ
            </Fab>
          </Grid>
          <Grid item xs={11} />
        </Grid>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            คำสั่งซื้อ
          </Typography>
          <Grid container spacing={2}>
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                  <FormControl
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    disabled={
                      dataEdit?.status === 0 ||
                      !!dataEdit?.tag ||
                      dataEdit?.status == 2
                    }
                  >
                    <InputLabel>เลือกบริษัทขนส่ง</InputLabel>
                    <Select
                      label="เลือกบริษัทขนส่ง"
                      value={selectCate}
                      defaultValue={dataEdit?.shippingType || "อื่น ๆ"}
                    >
                      {categorySend.map((item) => (
                        <MenuItem
                          key={item.id}
                          value={item.name}
                          onClick={() => onSelectCate(item.name)}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <Typography gutterBottom align="left">
                    ประเภทการขนส่ง : {dataEdit?.shippingType}
                  </Typography> */}
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
                    value={trackingId}
                    defaultValue={trackingId}
                    fullWidth
                    onChange={(e) => setTrackingId(e.target.value)}
                    label="หมายเลขพัสดุ (tracking)"
                    variant="outlined"
                    margin="normal"
                    name="tag"
                    // autoFocus
                    required
                    disabled={
                      dataEdit?.status === 0 ||
                      !!dataEdit?.tag ||
                      dataEdit?.status == 2 ||
                      selectCate === "อื่น ๆ"
                    }
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
        <div className="rounded-sm flex flex-col px-4 xl:p-6 w-full bg-white">
          <div className="flex justify-between items-center w-full mb-3">
            <p className="text-base leading-4 text-gray-800">ราคารวม</p>
            <p className="text-base leading-4 text-gray-600">
              {formattedTotalPrice} บาท
            </p>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <p className="text-base leading-4 text-gray-800">ค่าจัดส่ง</p>
            <p className="text-base leading-4 text-gray-600">
              {/* {systemSetting[0]?.shippingCost} บาท */}
              {dataEdit?.shippings[0]?.shippingFee} บาท
            </p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-base font-semibold leading-4 text-gray-800">
              ราคารวมทั้งหมด
            </p>
            <p className="text-base font-semibold leading-4 text-gray-600">
              {parseFloat(formattedTotalPrice) +
                (dataEdit?.shippings[0]?.shippingFee || 0)}{" "}
              บาท
            </p>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* <Typography align="center" color={"red"}>
              * โปรดใส่หมายเลขพัสดุก่อนยืนยันคำสั่งซื้อ
            </Typography> */}

            <CardActions sx={{ justifyContent: "center" }}>
              {dataEdit?.status === 0 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  // disabled={
                  //   !trackingId || dataEdit?.status == 1 || dataEdit?.status == 2
                  // }
                >
                  ยืนยันคำสั่งซื้อ
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  // disabled={
                  //   !trackingId || dataEdit?.status == 1 || dataEdit?.status == 2
                  // }
                  disabled={!!dataEdit?.tag || dataEdit?.status == 2}
                >
                  {!!dataEdit?.tag
                    ? "เสร็จสิ้น"
                    : selectCate === "อื่น ๆ"
                    ? "บันทึก"
                    : "บันทึกหมายเลขพัสดุ"}
                </Button>
              )}
            </CardActions>
          </Grid>
          <Grid item xs={6}>
            <CardActions sx={{ justifyContent: "center" }}>
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
