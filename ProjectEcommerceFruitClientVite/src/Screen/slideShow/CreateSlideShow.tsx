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

interface props {
  onChangeCU?: any;
  dataEdit?: SlideShow | null;
}

const CreateSlideShow = ({ onChangeCU, dataEdit }: props) => {
  const { createUpdateSlideShow } = useStore().systemSettingStore;
  const [dropZoneImage, setDropZoneImage] = useState(null);

  const handleSubmit = async (event: any) => {
    if (!dropZoneImage) {
      myToast("กรุณาใส่รูปภาพหน้าเว็บ");
    } else {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const formData: any = Object.fromEntries(data.entries());

      const dataForm = {
        id: dataEdit?.id || 0,
        imageName: dropZoneImage,
        systemSettingId: 1,
      };
      await createUpdateSlideShow(dataForm).then((result) => {
        if (!!result) {
          onChangeCU();
        }
      });
    }
  };

  const handleImageUpload = (file: any) => {
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
              กลับ
            </Fab>
          </Grid>
          <Grid item xs={11} />
        </Grid>

        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            รูปภาพหน้าเว็บ
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
        </CardContent>
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
        </CardActions>
      </Card>
    </Box>
  );
};

export default CreateSlideShow;
