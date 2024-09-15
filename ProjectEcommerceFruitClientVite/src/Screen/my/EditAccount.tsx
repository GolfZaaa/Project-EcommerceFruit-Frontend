import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { TextField, Box, CardActions, Button, Card } from "@mui/material";
import { useStore } from "../../store/store";
import { myToast } from "../../helper/components";

interface props {
  onChangeCU?: any;
  userEdit?: any;
}

const EditAccount = ({ onChangeCU, userEdit }: props) => {
  const { user, editUser } = useStore().userStore;

  console.log("userEdit", JSON.stringify(userEdit));
  console.log("userEdit - 1111", !!userEdit ? userEdit.id : 0);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      id: !!userEdit ? userEdit.id : 0,
      fullName: formData?.fullName,
    };

    await editUser(dataForm).then((result) => {
      if (!!result) {
        myToast("แก้ไขเสร็จสิ้น");
        if (userEdit) {
          onChangeCU();
        }
      }
      myToast(result);
    });
  };

  const data = userEdit ? userEdit : user;

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
          defaultValue={data?.fullName}
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
