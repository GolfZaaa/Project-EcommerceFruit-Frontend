import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
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

const DashboardAdminShowSystemSetting = () => {
  const { systemSetting, createUpdateSystemSetting } =
    useStore().systemSettingStore;

  const data = systemSetting[0];

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const dataform = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(dataform.entries());

    const dataForm = {
      id: data.id || 0,
      webName: formData.webName,
      description: formData.description,
    };

    createUpdateSystemSetting(dataForm).then((result) => {
      if (!!result) {
        toast("บันทึกข้อมูลเสร็จสิ้น");
      } else {
        toast("บันทึกข้อมูลไม่สำเร็จ");
      }
    });
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
          <TextField
            defaultValue={data?.webName}
            fullWidth
            label="ชื่อเว็บไซต์"
            variant="outlined"
            margin="normal"
            name="webName"
            autoFocus
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
