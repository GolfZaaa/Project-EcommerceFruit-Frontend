import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { TextField, Box, CardActions, Button, Card, Fab } from "@mui/material";
import { useStore } from "../../store/store";
import { myToast } from "../../helper/components";
import CircularProgress from "@mui/material/CircularProgress";
import MyContent from "../../component/MyContent";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { RoutePath } from "../../constants/RoutePath";
import DashboardAdminShowUser from "../Private/DashboardAdmin/DashboardAdminShowUser";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface props {
  onChangeCU?: any;
  userEdit?: any;
  admin: boolean;
}

const EditAccount = ({ onChangeCU, userEdit, admin }: props) => {
  const { user, editUser } = useStore().userStore;
  const { loadings } = useStore().systemSettingStore;
  const navigate = useNavigate();
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
    <div>
      <div>
        {admin && (
          <div className=" z-20 cursor-pointer h-16 absolute top-32">
            <Fab variant="extended" color="primary" onClick={onChangeCU}>
              <ArrowBackIosIcon sx={{ mr: 1 }} />
              <p className="FontPublic">
                <MyContent name="กลับ" fontSize="littlenormal" />
              </p>
            </Fab>
            {/* <button
          onClick={onChangeCU}
          className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-700 focus:outline-none focus:shadow-outline"
        >
          <IoArrowBack />
        </button> */}
          </div>
        )}

        <div className={admin ? "mt-28" : ""}>
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
                InputProps={{
                  sx: {
                    fontSize: "1.5rem",
                    color: "#333",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: "1.2rem",
                    color: "#888",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
              />

              <CardActions sx={{ justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loadings}
                >
                  {loadings ? (
                    <div>
                      <CircularProgress size={25} color="inherit" />
                    </div>
                  ) : (
                    <p className="FontPublic font-semibold">
                      <MyContent name="บันทึก" fontSize="small" />
                    </p>
                  )}
                </Button>
              </CardActions>
            </Card>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default observer(EditAccount);
