import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Fab } from "@mui/material";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import MyContent from "../../../component/MyContent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalImageToSend({ image }: { image: string | null }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div>
        <Fab variant="extended" color="primary" onClick={handleOpen}>
          <PhotoSizeSelectActualIcon sx={{ mr: 1 }} />
          <MyContent name="ดูหลักฐานการจัดส่งสินค้า" fontSize="smaller" />
        </Fab>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            className="rounded-t-lg object-cover"
            style={{
              width: "100%",
              height: 700,
            }}
            alt="image to send"
            src={image || ""}
          />
        </Box>
      </Modal>
    </div>
  );
}
