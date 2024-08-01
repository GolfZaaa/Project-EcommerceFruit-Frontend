import { Box, Card, CardContent, TextField, Typography } from '@mui/material';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

export default function CreateFruitGIScreen() {
    const [editorHtml, setEditorHtml] = React.useState('');
  
    const handleChange = (html:any) => {
      setEditorHtml(html);
    };

    console.log("editorHtml",editorHtml)
  
    const modules = {
      toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        ['image'] 
      ],
    };
  
    const formats = [
      'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'align', 'image'
    ];
  
    return (
        // <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box display="flex" justifyContent="center" alignItems="center">
            <Card style={{ width: '70%',marginTop:20}}>
                <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                        สร้างข้อมูล GI
                    </Typography>
                <div style={{marginBottom:20}}>
                <TextField
                    fullWidth
                    label="ชื่อ"
                    variant="outlined"
                    margin="normal"
                  />
                </div>
                   
                <div
                style={{ height: 200, marginBottom: 60 }}
                className="editor-container"
              >
                <ReactQuill
                  value={editorHtml}
                  onChange={handleChange}
                  modules={modules}
                  formats={formats}
                  className="vertical-text-editor" 
                />
              </div>
        </CardContent>
            </Card>
        </Box>
    );
}