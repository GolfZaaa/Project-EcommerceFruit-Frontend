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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RoutePath } from "../../constants/RoutePath";

export default function CreateProductScreen() {
  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (html: any) => {
    setEditorHtml(html);
  };

  const [fruitType, setFruitType] = useState("");

  const handleFruitTypeChange = (event: any) => {
    setFruitType(event.target.value);
  };

  console.log("editorHtml", editorHtml);

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

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={4}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: 3,
            padding: 3,
          }}
        >
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              สร้างสินค้า
            </Typography>
            <Box mt={2}>
              <TextField
                fullWidth
                label="ชื่อสินค้า"
                variant="outlined"
                margin="normal"
              />
              <Grid spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="จำนวน"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="น้ำหนัก"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ราคา"
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>ข้อมูลผลไม้ (IG)</InputLabel>
                    <Select
                      value={fruitType}
                      onChange={handleFruitTypeChange}
                      label="ข้อมูลผลไม้ (IG)"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="apple">Apple</MenuItem>
                      <MenuItem value="banana">Banana</MenuItem>
                      <MenuItem value="orange">Orange</MenuItem>
                      {/* Add more fruit options as needed */}
                    </Select>
                  </FormControl>
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
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", mt: 2 }}>
            <Link to={RoutePath.successShopScreen}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                สร้าง
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
}
