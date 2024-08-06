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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RoutePath } from "../../constants/RoutePath";
import { Product } from "../../models/Product";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";

interface props {
  onChangeCU: any;
  dataEdit?: Product | null;
}

export default observer(function CreateProductScreen({
  onChangeCU,
  dataEdit,
}: props) {
  const { productGI, getProductGI, createUpdateProduct } =
    useStore().productStore;

  const [editorHtml, setEditorHtml] = useState(dataEdit?.detail || "");

  const [selectGI, setSelectGI] = useState<number | null>();

  useEffect(() => {
    getProductGI();
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
      // images: null,
      weight: formData.weight,
      price: formData.price,
      detail: editorHtml,
      productGIId: selectGI,
    };

    console.log("dataForm", dataForm);

    await createUpdateProduct(dataForm).then((result) => {
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

  const onSelectGI = (id: number) => {
    setSelectGI(id);
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={onChangeCU}
            >
              กลับ
            </Button>
          </Grid>
          <Grid item xs={11} />
        </Grid>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            สร้างสินค้า
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>ข้อมูลผลไม้ (IG)</InputLabel>
                <Select
                  defaultValue={dataEdit?.productGIId}
                  label="ข้อมูลผลไม้ (IG)"
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
            <Grid item xs={6}>
              <TextField
                defaultValue={dataEdit?.weight}
                type="number"
                fullWidth
                label="จำนวน"
                variant="outlined"
                margin="normal"
                name="weight"
                autoFocus
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              ช่องใส่รูปภาพ
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
