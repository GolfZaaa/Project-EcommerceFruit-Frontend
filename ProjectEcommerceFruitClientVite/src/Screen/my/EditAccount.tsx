import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { TextField, Box, CardActions, Button, Card } from "@mui/material";
import { useStore } from "../../store/store";
import { myToast } from "../../helper/components";

const EditAccount = () => {
  const { user, editUser } = useStore().userStore;

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      fullName: formData?.fullName,
    };

    console.log("dataForm", dataForm);

    await editUser(dataForm).then((result) => {
      if (!!result) {
        myToast("แก้ไขเสร็จสิ้น");
      }
      myToast(result);
    });
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
        <TextField
          defaultValue={user?.fullName}
          fullWidth
          label="ชื่อ-นามสกุล"
          variant="outlined"
          margin="normal"
          name="fullName"
          autoFocus
          required
        />

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

export default observer(EditAccount);
