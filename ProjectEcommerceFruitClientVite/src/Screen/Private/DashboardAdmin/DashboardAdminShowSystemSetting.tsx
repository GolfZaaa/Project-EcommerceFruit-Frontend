import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  CardActions,
  Button,
  Container,
  CardContent,
  Typography,
} from "@mui/material";
import { useStore } from "../../../store/store";
import { toast } from "react-toastify";
import DropZoneImageComponent from "../../../layout/component/DropZoneImageComponent";
import { pathImages } from "../../../constants/RoutePath";
import { myToast } from "../../../helper/components";

const DashboardAdminShowSystemSetting = () => {
  const { systemSetting, createUpdateSystemSetting } =
    useStore().systemSettingStore;

  const [dropZoneImage, setDropZoneImage] = useState(null);

  const [showError, setShowError] = useState(false);

  const data = systemSetting[0];

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const dataform = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(dataform.entries());

    const dataForm = {
      id: data?.id || 0,
      image: dropZoneImage || null,
      webName: formData.webName,
      description: formData.description,
      shippingCost: formData.shippingCost,
    };

    if (!data?.image && dropZoneImage === null) {
      setShowError(true);
      myToast("กรุณาใส่รูปภาพหน้าเว็บ");
    } else {
      createUpdateSystemSetting(dataForm).then((result) => {
        if (!!result) {
          toast("บันทึกข้อมูลเสร็จสิ้น");
        } else {
          toast("บันทึกข้อมูลไม่สำเร็จ");
        }
      });
    }
  };

  const handleImageUpload = (file: any) => {
    setShowError(false);
    setDropZoneImage(file);
  };

  return (
    <div className="-mt-16">
      <Container
        maxWidth="md"
        style={{
          marginTop: 110,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          <p>ตั้งค่าระบบ</p>
        </Typography>
        <Box
          mt={2}
          component="form"
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <DropZoneImageComponent
              image={data?.image ? pathImages.image_web + data?.image : null}
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
              กรุณาใส่รูปภาพ
            </div>
          )}
          <TextField
            defaultValue={data?.webName}
            fullWidth
            label="ชื่อเว็บไซต์"
            variant="outlined"
            margin="normal"
            name="webName"
            required
          />
          <TextField
            defaultValue={data?.description}
            fullWidth
            label="รายละเอียดเพิ่มเติม"
            variant="outlined"
            margin="normal"
            name="description"
            required
          />
          <TextField
            defaultValue={data?.shippingCost}
            type="number"
            fullWidth
            label="อัตราค่าจัดส่ง"
            variant="outlined"
            margin="normal"
            name="shippingCost"
            required
          />
          <CardActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              บันทึก
            </Button>
          </CardActions>{" "}
        </Box>
      </Container>
    </div>
  );
};

export default DashboardAdminShowSystemSetting;
