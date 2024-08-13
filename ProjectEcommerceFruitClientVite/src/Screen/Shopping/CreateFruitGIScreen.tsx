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

interface props {
  onChangeCU: any;
  dataEdit?: ProductGI | null;
}

export default observer(function CreateFruitGIScreen({
  onChangeCU,
  dataEdit,
}: props) {
  const { category, getCategory, createUpdateProductGI } =
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
      ? dataEdit.images.map(
          (item) => "https://localhost:7168/product-gi/" + item.imageName
        )
      : []
  );

  const [newFiles, setNewFiles] = useState<File[] | string[] | null | any>([]);

  const handleChangeFile = (uploadedFiles: File[]) => {
    setNewFiles(uploadedFiles);
    console.log("Files:", uploadedFiles);
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

    console.log("dataForm", dataForm);

    await createUpdateProductGI(dataForm, newFiles).then((result) => {
      if (result) {
        onChangeCU();
      }
      console.log("res", result);
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

  console.log("newFiles", newFiles);

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
                <Grid item xs={2}>
                  <img
                    style={{}}
                    key={index}
                    src={url}
                    alt={`Product image ${index + 1}`}
                  />
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
