import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Fab,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SlideShow } from "../../models/SlideShow";
import DropZoneImageComponent from "../../layout/component/DropZoneImageComponent";
import { pathImages } from "../../constants/RoutePath";
import { useState } from "react";
import { useStore } from "../../store/store";
import { myToast } from "../../helper/components";
import { observer } from "mobx-react-lite";
import MyContent from "../../component/MyContent";

interface props {
  onChangeCU?: any | null;
  dataEdit?: SlideShow | null;
}

export default observer(function CreateSlideShow({
  onChangeCU,
  dataEdit,
}: props) {
  const { createUpdateSlideShow } = useStore().systemSettingStore;
  const [dropZoneImage, setDropZoneImage] = useState(null);

  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    if (!dataEdit?.imageName && dropZoneImage === null) {
      setShowError(true);
      myToast("กรุณาใส่รูปภาพหน้าเว็บ");
    } else {
      const dataForm = {
        id: dataEdit?.id || 0,
        imageName: dropZoneImage || null,
      };

      console.log("dataForm", dataForm);

      await createUpdateSlideShow(dataForm).then((result) => {
        if (!!result) {
          onChangeCU();
        }
      });
    }
  };

  const handleImageUpload = (file: any) => {
    setShowError(false);
    setDropZoneImage(file);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
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
              <MyContent name="รูปภาพหน้าเว็บ" fontSize="larger" />
            </p>
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <DropZoneImageComponent
              image={
                dataEdit?.imageName
                  ? pathImages.slideShow + dataEdit?.imageName
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
              กรุณาใส่รูปภาพ
            </div>
          )}

          <div style={{flexDirection:'row',display:'flex',justifyContent:'center'}}>
                      <p className="font-semibold FontPublic mt-2" style={{ color: "#ff0000" }}>
                                    <MyContent name="ใช้ได้เฉพาะไฟล์ jpeg และ png ขนาดไม่เกิน 5MB เท่านั้น" fontSize="small" />
                      </p>
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
