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

interface props {
  onChangeCU?: any | null;
  dataEdit?: Product | null;
  id?: any | null;
}

export default observer(function CreateProductScreen({
  onChangeCU,
  dataEdit,
  id = 1,
}: props) {
  const { productGI, getProductGI, createUpdateProduct } =
    useStore().productStore;

  const [editorHtml, setEditorHtml] = useState(dataEdit?.detail || "");

  const [selectGI, setSelectGI] = useState<number | null>(
    dataEdit?.productGIId || null
  );

  const [dropZoneImage, setDropZoneImage] = useState(null);

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

    const dataForm = {
      id: dataEdit?.id || 0,
      images: dropZoneImage || null,
      weight: parseFloat(formData.weight),
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      detail: editorHtml || "<p></p>",
      productGIId: selectGI,
    };

    await createUpdateProduct(dataForm).then((result) => {
      if (!!result) {
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

  const onSelectGI = (id: number) => {
    setSelectGI(id);
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
            สร้างสินค้า
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div
                style={{ paddingLeft: "80px", marginTop: "20px" }}
                className="payment-form-container"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5px",
                  }}
                >
                  <DropZoneImageComponent
                    image={pathImages.product + dataEdit?.images}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <Grid>
                <FormControl
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  disabled={!id}
                >
                  <InputLabel>ข้อมูลผลไม้ (GI)</InputLabel>
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
                        {item.name}
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
                  label="น้ำหนัก"
                  variant="outlined"
                  margin="normal"
                  name="weight"
                  autoFocus
                  required
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
                  autoFocus
                  required
                />
              </Grid>
              <Grid>
                <TextField
                  defaultValue={dataEdit?.quantity}
                  type="number"
                  fullWidth
                  label="จำนวน"
                  variant="outlined"
                  margin="normal"
                  name="quantity"
                  autoFocus
                  required
                />
              </Grid>
            </Grid>
          </Grid>

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
});
