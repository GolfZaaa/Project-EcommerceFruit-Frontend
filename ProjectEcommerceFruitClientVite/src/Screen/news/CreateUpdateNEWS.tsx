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
  TextField,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SlideShow } from "../../models/SlideShow";
import DropZoneImageComponent from "../../layout/component/DropZoneImageComponent";
import { pathImages } from "../../constants/RoutePath";
import { useState } from "react";
import { useStore } from "../../store/store";
import { formats, modules, myToast } from "../../helper/components";
import { NEWS } from "../../models/NEWS";
import ReactQuill from "react-quill";

interface props {
  onChangeCU?: any;
  dataEdit?: NEWS | null;
}

const CreateUpdateNEWS = ({ onChangeCU, dataEdit }: props) => {
  const { createUpdateNEWS } = useStore().systemSettingStore;
  const [dropZoneImage, setDropZoneImage] = useState(null);

  const [editorHtml, setEditorHtml] = useState(dataEdit?.description || "");

  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    if (!dataEdit?.imageName && dropZoneImage === null) {
      setShowError(true);
      myToast("กรุณาใส่รูปภาพข่าวประชาสัมพันธ์");
    } else {
      const dataForm = {
        id: dataEdit?.id || 0,
        title: formData.title,
        imageName: dropZoneImage || null,
        description: editorHtml || "<p></p>",
      };

      console.log("dataForm", dataForm);

      await createUpdateNEWS(dataForm).then((result) => {
        if (!!result) {
          onChangeCU();
        }
      });
    }
  };

  const handleChange = (html: any) => {
    setEditorHtml(html);
  };

  const handleImageUpload = (file: any) => {
    setShowError(false);
    setDropZoneImage(file);
  };

  console.log("dataEdit", dataEdit);

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
            ข่าวประชาสัมพันธ์
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
                  ? pathImages.news + dataEdit?.imageName
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
          <TextField
            defaultValue={dataEdit?.title}
            fullWidth
            label="ชื่อหัวข้อ"
            variant="outlined"
            margin="normal"
            name="title"
            required
          />

          <Typography variant="h6" component="h2" gutterBottom>
            คำอธิบาย & รูปภาพ
          </Typography>
          <div className="editor-container">
            <ReactQuill
              value={editorHtml}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              className="vertical-text-editor" // Add custom class here
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

export default CreateUpdateNEWS;
