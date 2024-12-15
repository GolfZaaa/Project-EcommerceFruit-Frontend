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
import MyContent from "../../component/MyContent";
import imagecraditcart from "../../image/craditcard.png";
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
              <p className="FontPublic">
                <MyContent name="กลับ" fontSize="small" />
              </p>
            </Fab>
          </Grid>
          <Grid item xs={11} />
        </Grid>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            <p className="FontPublic font-semibold">
              <MyContent name="คำสั่งซื้อ" fontSize="large" />
            </p>
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
                <img
                  src={imagecraditcart}
                  alt="เครดิตการ์ด"
                  height={200}
                  width={200}
                />
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
                    <InputLabel
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      }}
                    >
                      เลือกบริษัทขนส่ง
                    </InputLabel>
                    <Select
                      label="เลือกบริษัทขนส่ง"
                      value={selectCate}
                      defaultValue={dataEdit?.shippingType || "อื่น ๆ"}
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      }}
                    >
                      {categorySend.map((item) => (
                        <MenuItem
                          key={item.id}
                          value={item.name}
                          onClick={() => onSelectCate(item.name)}
                        >
                          <p className="FontPublic">{item.name}</p>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    InputProps={{
                      sx: {
                        fontSize: "1.2rem",
                        color: "#333",
                        fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        fontSize: "1.2rem",
                        color: "#888",
                        fontFamily: '"Noto Sans Thai Looped", sans-serif',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <label className="FontPublic font-semibold">
                    <MyContent
                      name="ที่อยู่ผู้สั่งซื้อ"
                      fontSize="littlenormal"
                    />
                  </label>
                  <Typography gutterBottom align="left">
                    <p className="FontPublic">
                      <MyContent
                        name={`เบอร์โทรศัพท์ ${dataEdit?.address.user.phoneNumber}`}
                        fontSize="small"
                      />
                    </p>
                    <p className="FontPublic">
                      <MyContent
                        name={`บ้านเลขที่ ${dataEdit?.address?.detail}`}
                        fontSize="small"
                      />
                    </p>
                    <p className="FontPublic">
                      <MyContent
                        name={`แขวง/ตำบล ${dataEdit?.address?.subDistrict}  `}
                        fontSize="small"
                      />
                    </p>
                    <p className="FontPublic">
                      <MyContent
                        name={`เขต/อำเภอ ${dataEdit?.address?.district}   `}
                        fontSize="small"
                      />
                    </p>
                    <p className="FontPublic">
                      <MyContent
                        name={`จังหวัด ${dataEdit?.address?.province}   `}
                        fontSize="small"
                      />
                    </p>
                    <p className="FontPublic">
                      <MyContent
                        name={`รหัสไปรษณีย์ ${dataEdit?.address?.postCode}`}
                        fontSize="small"
                      />
                    </p>
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
                  <div className="FontPublic space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <img
                      className="hidden h-20 w-20 dark:block object-cover"
                      src={pathImages.product + item.product.images || ""}
                      alt={item.product.images || "product image"}
                    />
                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center">
                        <MyContent
                          name={`จำนวน ${item.quantity}  ชิ้น`}
                          fontSize="small"
                        />
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-gray-900">
                          <MyContent
                            name={` ${item.product.price * item.quantity}  บาท`}
                            fontSize="small"
                          />
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <p className="text-sm text-gray-500 font-bold -mb-3">
                        <MyContent
                          name={` ${item.product.productGI.category.name} `}
                          fontSize="small"
                        />
                      </p>
                      <p className="font-bold">
                        <MyContent
                          name={` ${item.product.productGI.name} `}
                          fontSize="littlenormal"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        ))}
        <div className="FontPublic rounded-sm flex flex-col px-4 xl:p-6 w-full bg-white">
          <div className="flex justify-between items-center w-full mb-3">
            <p className="text-base leading-4 text-gray-800">
              <MyContent name={`ราคารวม`} fontSize="normal" />
            </p>
            <p className="text-base leading-4 text-gray-600">
              <MyContent
                name={`${formattedTotalPrice} บาท`}
                fontSize="normal"
              />
            </p>
          </div>
          <div className="flex justify-between items-center w-full mb-3">
            <p className="text-base leading-4 text-gray-800">
              <MyContent name={`ค่าจัดส่ง`} fontSize="normal" />
            </p>
            <p className="text-base leading-4 text-gray-600">
              <MyContent
                name={`${dataEdit?.shippings[0]?.shippingFee} บาท`}
                fontSize="normal"
              />
            </p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-base font-semibold leading-4 text-gray-800">
              <MyContent name={`ราคารวมทั้งหมด`} fontSize="normal" />
            </p>
            <p className="text-base font-semibold leading-4 text-gray-600">
              <MyContent
                name={`${
                  parseFloat(formattedTotalPrice) +
                  (dataEdit?.shippings[0]?.shippingFee || 0)
                }
              บาท`}
                fontSize="normal"
              />
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
                >
                  <p className="FontPublic">
                    <MyContent name={`ยืนยันคำสั่งซื้อ`} fontSize="small" />
                  </p>
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  disabled={!!dataEdit?.tag || dataEdit?.status == 2}
                >
                  {!!dataEdit?.tag ? (
                    <p className="FontPublic">
                      <MyContent name={`เสร็จสิ้น`} fontSize="small" />
                    </p>
                  ) : selectCate === "อื่น ๆ" ? (
                    <p className="FontPublic">
                      <MyContent name={`บันทึก`} fontSize="small" />
                    </p>
                  ) : (
                    <p className="FontPublic">
                      <MyContent name={`บันทึกหมายเลขพัสดุ`} fontSize="small" />
                    </p>
                  )}
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
                <p className="FontPublic ">
                  <MyContent name={`ยกเลิกคำสั่งซื้อ`} fontSize="small" />
                </p>
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default observer(EditOrderScreen);
