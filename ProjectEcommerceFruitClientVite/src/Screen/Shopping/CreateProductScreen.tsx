import {
  Container,
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
  MenuItem,
  Select,
  Fab,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Product } from "../../models/Product";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DropZoneImageComponent from "../../layout/component/DropZoneImageComponent";
import { pathImages } from "../../constants/RoutePath";
import { formats, modules, myToast } from "../../helper/components";
import MyContent from "../../component/MyContent";
import Swal from "sweetalert2";

interface props {
  onChangeCU?: any | null;
  dataEdit?: Product | null;
  id?: any | null;
}

export default observer(function CreateProductScreen({
  onChangeCU,
  dataEdit,
  id = 0,
}: props) {
  const { productGI, getProductGI, createUpdateProduct } =
    useStore().productStore;

  const [editorHtml, setEditorHtml] = useState(dataEdit?.detail || "");

  const [selectGI, setSelectGI] = useState<number | null>(
    dataEdit?.productGIId || null
  );

  const [dropZoneImage, setDropZoneImage] = useState(null);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    getProductGI(id);
  }, []);

  const handleChange = (html: any) => {
    setEditorHtml(html);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    if (!dataEdit?.images && dropZoneImage === null) {
      setShowError(true);
      myToast("กรุณาใส่รูปภาพสินค้า");
    } else {
      const dataForm = {
        id: dataEdit?.id || 0,
        images: dropZoneImage || null,
        weight: parseFloat(formData.weight),
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        detail: editorHtml || "<p></p>",
        productGIId: selectGI,
      };

      if (dataEdit?.id) {
        await createUpdateProduct(dataForm).then((result) => {
          if (!!result) {
            onChangeCU();
          }
        });
      } else {
        handleCreate(dataForm);
      }
    }
  };

  const handleCreate = (dataForm: any) => {
    Swal.fire({
      title: "กรุณาระบุวันหมดอายุของสินค้า",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      input: "number",
      // width: 550,
      inputValidator: (value) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
          return "กรุณาใส่จำนวนวันที่เป็นตัวเลข!";
        } else if (numberValue < 0) {
          return "จำนวนวันต้องไม่ติดลบ!";
        } else if (numberValue === 0) {
          return "จำนวนวันต้องไม่เป็น 0!";
        }

        return null;
      },
      inputLabel: "โดยเริ่มนับจากวันที่บันทึกรายการสินค้าเข้าระบบ",
      inputPlaceholder: "โปรดระบุจำนวนวันหมดอายุของสินค้า",
      inputAttributes: {
        autocapitalize: "off",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "ส่งต่อคำสั่งซื้อเรียบร้อยแล้ว",
          "ท่านส่งต่อคำสั่งซื้อเรียบร้อยแล้ว",
          "success"
        );

        const data = {
          ...dataForm,
          expire: parseFloat(result.value),
        };

        console.log("data", data);

        await createUpdateProduct(data).then((result) => {
          if (!!result) {
            onChangeCU();
          }
        });
      }
    });
  };

  const onSelectGI = (id: number) => {
    setSelectGI(id);
  };

  const handleImageUpload = (file: any) => {
    setShowError(false);
    setDropZoneImage(file);
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
            <p className="FontPublic font-bold">
              <MyContent name="สร้างสินค้า" fontSize="large" />
            </p>
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="payment-form-container">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <DropZoneImageComponent
                    image={
                      dataEdit?.images
                        ? pathImages.product + dataEdit?.images
                        : null
                    }
                    onImageUpload={handleImageUpload}
                  />
                </div>
                {showError && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "red",
                    }}
                  >
                    <p className="FontPublic">
                      <MyContent name="กรุณาใส่รูปภาพสินค้า" fontSize="small" />
                    </p>
                  </div>
                )}
              </div>
              <p
                className="font-semibold FontPublic items-center text-center mb-5"
                style={{ color: "#ff0000" }}
              >
                <MyContent
                  name="ใช้ได้เฉพาะไฟล์ jpeg และ png ขนาดไม่เกิน 5MB เท่านั้น"
                  fontSize="smaller"
                />
              </p>
            </Grid>
            <Grid item xs={6}>
              <Grid>
                <FormControl
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  disabled={id === 0}
                  required
                >
                  <InputLabel
                    sx={{
                      fontSize: "1.2rem",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                    }}
                  >
                    ข้อมูลผลไม้ (GI)
                  </InputLabel>
                  <Select
                    defaultValue={dataEdit?.productGIId}
                    label="ข้อมูลผลไม้ (GI)"
                  >
                    {productGI.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        onClick={() => onSelectGI(item.id)}
                      >
                        <p className="FontPublic">{item.name}</p>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <TextField
                  defaultValue={dataEdit?.weight}
                  type="number"
                  fullWidth
                  label="น้ำหนัก (ต่อถุง หรือ ชิ้น)"
                  variant="outlined"
                  margin="normal"
                  name="weight"
                  required
                  InputProps={{
                    sx: {
                      fontSize: "1.2rem",
                      color: "#333",
                      fontFamily: '"Noto Sans Thai Looped", sans-serif',
                    },
                  }}
                  inputProps={{
                    step: 0.1,
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
              <Grid>
                <TextField
                  defaultValue={dataEdit?.price}
                  type="number"
                  fullWidth
                  label="ราคา"
                  variant="outlined"
                  margin="normal"
                  name="price"
                  required
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
              <Grid>
                <TextField
                  defaultValue={dataEdit?.quantity}
                  type="number"
                  fullWidth
                  label="จำนวน ถุง หรือ ชิ้น"
                  variant="outlined"
                  margin="normal"
                  name="quantity"
                  required
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
            </Grid>
          </Grid>

          <Typography variant="h6" component="h2" gutterBottom>
            <p className="FontPublic font-semibold">
              <MyContent name="คำอธิบาย & รูปภาพ" fontSize="small" />
            </p>
          </Typography>
          <div className="editor-container">
            <ReactQuill
              value={editorHtml}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              className="vertical-text-editor"
            />
          </div>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            <p className="FontPublic">
              <MyContent name="บันทึก" fontSize="small" />
            </p>
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
});
