import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Fab,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useStore } from "../../store/store";
import { observer } from "mobx-react-lite";
import { Images, ProductGI } from "../../models/ProductGI";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DropzoneArea } from "mui-file-dropzone";
import { pathImages } from "../../constants/RoutePath";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface props {
  onChangeCU: any;
  dataEdit?: ProductGI | null;
}

export default observer(function CreateFruitGIScreen({
  onChangeCU,
  dataEdit,
}: props) {
  const { category, getCategory, createUpdateProductGI, removeImage } =
    useStore().productStore;

  const [editorHtml, setEditorHtml] = React.useState(
    dataEdit?.description || ""
  );
  const [selectCate, setSelectCate] = React.useState<number | null>(
    dataEdit?.categoryId || null
  );

  useEffect(() => {
    getCategory();
  }, []);

  const handleChange = (html: any) => {
    setEditorHtml(html);
  };

  const [files, setFiles] = useState<File[] | string[] | null | any>(
    dataEdit?.id !== undefined
      ? dataEdit.images.map((item) => ({
          id: item.id,
          name: pathImages.product_GI + item.imageName,
        }))
      : []
  );

  const [newFiles, setNewFiles] = useState<File[] | string[] | null | any>([]);

  const [open, setOpen] = React.useState(false);

  const handleChangeFile = (uploadedFiles: File[]) => {
    setNewFiles(uploadedFiles);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      id: dataEdit?.id || 0,
      name: formData.name,
      description: editorHtml || "<p></p>",
      categoryId: selectCate,
    };


    await createUpdateProductGI(dataForm, newFiles).then((result) => {
      if (result) {
        onChangeCU();
      }
    });
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["image"],
    ],
  };

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "align",
    "image",
  ];

  const onSelectCate = (id: number) => {
    setSelectCate(id);
  };

  const handleOpenClose = (state: boolean) => setOpen(state);

  return (
    // <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
          <Typography variant="h5" component="h2" gutterBottom>
            สร้างข้อมูล GI
          </Typography>

          <div style={{ marginBottom: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  defaultValue={dataEdit?.name}
                  fullWidth
                  label="ชื่อ"
                  variant="outlined"
                  margin="normal"
                  name="name"
                  autoFocus
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>ประเภท</InputLabel>
                  <Select defaultValue={dataEdit?.categoryId} label="ประเภท">
                    {category.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        onClick={() => onSelectCate(item.id)}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>

          <div style={{ marginBottom: 30 }} className="editor-container">
            <ReactQuill
              value={editorHtml}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              className="vertical-text-editor"
            />
          </div>

          <div>
            <DropzoneArea
              onChange={handleChangeFile}
              fileObjects={newFiles?.map((file: any) => file)}
              acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
              maxFileSize={5000000}
              previewText="รูปภาพ"
              showPreviews
              showPreviewsInDropzone={false}
              dropzoneText="ลากและวางไฟล์ที่นี่หรือคลิก"
            />
          </div>

          <div
            style={{
              marginTop: 30,
            }}
          >
            <Grid container spacing={2}>
              {files?.map((url: any, index: number) => (
                <Grid item xs={2} className="product-image-container">
                  <div className="delete-icon">
                    <DeleteIcon
                      style={{
                        position: "relative",
                      }}
                      onClick={() => handleOpenClose(true)}
                      color="action"
                    />
                  </div>

                  <img
                    className="product-image"
                    key={index}
                    src={url.name}
                    alt={`Product image ${index + 1}`}
                  />
                  <Dialog
                    open={open}
                    onClose={() => handleOpenClose(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"ลบข้อมูลนี้ออกจากฐานข้อมูล"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        ลบข้อมูลนี้ออกจากฐานข้อมูล ยืนยันเพื่อลบ
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => handleOpenClose(false)}>
                        ยกเลิก
                      </Button>
                      <Button
                        onClick={() => {
                          removeImage(url.id).then(() => {
                            setFiles(
                              files.filter((file: any) => file.id !== url.id)
                            );
                          });
                          handleOpenClose(false);
                        }}
                        autoFocus
                      >
                        ยืนยัน
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              ))}
            </Grid>
          </div>

          <Button
            style={{
              marginTop: 20,
            }}
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            บันทึก
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
});
