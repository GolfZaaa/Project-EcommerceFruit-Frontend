import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { RoutePath } from "../../constants/RoutePath";
import { myToast } from "../../helper/components";
import { Address } from "../../models/Address";
import { CreateInput } from "thai-address-autocomplete-react";
import MyContent from "../../component/MyContent";
import DashboardAdminShowStore from "../Private/DashboardAdmin/DashboardAdminShowStore";
import { IoArrowBack } from "react-icons/io5";

const InputThaiAddress = CreateInput();
type Props = Parameters<typeof CreateInput>[0];

interface props {
  onChangeCU?: any;
  dataEdit?: any;
}

export default observer(function CreateShopScreen({
  onChangeCU,
  dataEdit,
}: props) {
  const navigate = useNavigate();
  const { usershop, GetShopByUserId, createandupdate } =
    useStore().shopuserStore;
  const { getUserDetailbyId, user } = useStore().userStore;
  const { address: addressed, createUpdateAddress }: any =
    useStore().addressStore;

  useEffect(() => {
    if (!!dataEdit) {
      GetShopByUserId();
    }
  }, []);

  const dataId = !!dataEdit ? dataEdit : usershop;

  const addresss = !!dataEdit ? dataEdit : addressed;

  const [address, setAddress] = useState<Address | any>(
    addresss?.id !== 0 && addresss?.id !== undefined
      ? {
          district: addresss?.subDistrict, // ตำบล tambol
          amphoe: addresss?.district, // อำเภอ amphoe
          province: addresss?.province, // จังหวัด changwat
          zipcode: addresss?.postCode, // รหัสไปรษณีย์ postal code
          detail: addresss?.detail, // รหัสไปรษณีย์ postal code
        }
      : {
          district: "", // ตำบล tambol
          amphoe: "", // อำเภอ amphoe
          province: "", // จังหวัด changwat
          zipcode: "", // รหัสไปรษณีย์ postal code
          detail: "", // รหัสไปรษณีย์ postal code
        }
  );

  const handleChange = (scope: string) => (value: string) => {
    setAddress((oldAddr: Address) => ({
      ...oldAddr,
      [scope]: value,
    }));
  };

  const handleSelect = (address: Address) => {
    setAddress(address);
  };

  const handleSubmit = async (event: any) => {
    console.log("address", address);
    event.preventDefault();

    if (
      address.district === "" ||
      address.amphoe === "" ||
      address.province === "" ||
      address.zipcode === ""
    ) {
      myToast("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
    } else {
      const data = new FormData(event.currentTarget);
      const formData: any = Object.fromEntries(data.entries());

      const dataForm = {
        id: dataId?.id || 0,
        name: formData.name,
        description: formData.description,
      };

      await createandupdate(dataForm).then(async (result) => {
        if (result) {
          const dataAddress = {
            id: addresss?.id || 0,
            subDistrict: address.district,
            district: address.amphoe,
            province: address.province,
            postCode: address.zipcode,
            detail: formData.detail,
            isUsed_Store: true,
            isUsed: false,
            gps: "",
          };

          await createUpdateAddress(dataAddress);
          if (user?.stores.length) {
            myToast("บันทึกสำเร็จ");
          } else {
            myToast("ลงทะเบียนร้านค้าสำเร็จ");
          }

          getUserDetailbyId();

          if (dataEdit) {
            onChangeCU();
          } else {
            navigate(RoutePath.dashboardShopScreen);
          }
        }
      });
    }
  };

    const [showDashboard, setShowDashboard] = useState(false);
  
    const handleGoBack = () => {
      setShowDashboard(true);
    };

  return (
    <div className="">

      {showDashboard ? (
         <DashboardAdminShowStore />
      ):(
        <div>
<div className=" z-20 cursor-pointer h-16 absolute top-32">
        <button
          onClick={handleGoBack}
          className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-700 focus:outline-none focus:shadow-outline"
        >
          <IoArrowBack />
        </button>
      </div>
          <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={10}
          style={{
            backgroundColor: "white",
          }}
        >
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              {dataId && dataId?.id ? (
                <p className="FontPublic font-bold">
                  <MyContent name="ข้อมูลร้านค้า" fontSize="large" />
                </p>
              ) : (
                <p className="FontPublic font-bold">
                  <MyContent name="สร้างร้านค้า" fontSize="large" />
                </p>
              )}
            </Typography>
            <Box mt={2} component="form" onSubmit={handleSubmit}>
              <TextField
                defaultValue={dataId?.name}
                fullWidth
                label="ชื่อร้านค้า"
                variant="outlined"
                margin="normal"
                name="name"
                autoFocus
                required
                InputProps={{
                  sx: {
                    fontSize: "1.3rem",
                    color: "#333",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: "1.1rem",
                    color: "#888",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
              />
              <TextField
                defaultValue={dataId?.description}
                fullWidth
                label="รายละเอียด"
                variant="outlined"
                margin="normal"
                name="description"
                required
                InputProps={{
                  sx: {
                    fontSize: "1.3rem",
                    color: "#333",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: "1.1rem",
                    color: "#888",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
              />

              <TextField
                defaultValue={addresss?.detail}
                fullWidth
                label="บ้านเลขที่, หมู่, ซอย, ถนน"
                variant="outlined"
                margin="normal"
                name="detail"
                required
                InputProps={{
                  sx: {
                    fontSize: "1.3rem",
                    color: "#333",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: "1.1rem",
                    color: "#888",
                    fontFamily: '"Noto Sans Thai Looped", sans-serif',
                  },
                }}
              />

              <label>
                <p className="FontPublic">
                  <MyContent name={`รหัสไปรษณีย์`} fontSize="small" />
                </p>
              </label>
              <InputThaiAddress.Zipcode
                value={address["zipcode"]}
                onChange={handleChange("zipcode")}
                onSelect={(e: any) => handleSelect(e)}
                style={{
                  height: "55px",
                }}
                className="custom-district-input FontPublic"
              />

              <label>
                <p className="FontPublic">
                  <MyContent name={`แขวง/ตำบล`} fontSize="small" />
                </p>
              </label>
              <InputThaiAddress.District
                value={address["district"]}
                // onChange={handleChange("district")}
                onSelect={(e: any) => handleSelect(e)}
                style={{
                  height: "55px",
                  pointerEvents: "none",
                  opacity: 0.6,
                }}
                className="custom-district-input FontPublic"
              />

              <label>
                <p className="FontPublic">
                  <MyContent name={`เขต/อำเภอ`} fontSize="small" />
                </p>
              </label>
              <InputThaiAddress.Amphoe
                value={address["amphoe"]}
                // onChange={handleChange("amphoe")}
                onSelect={(e: any) => handleSelect(e)}
                style={{
                  height: "55px",
                  pointerEvents: "none",
                  opacity: 0.6,
                }}
                className="custom-district-input FontPublic"
              />

              <label>
                <p className="FontPublic">
                  <MyContent name={`จังหวัด`} fontSize="small" />
                </p>
              </label>
              <InputThaiAddress.Province
                value={address["province"]}
                // onChange={handleChange("province")}
                onSelect={(e: any) => handleSelect(e)}
                style={{
                  height: "55px",
                  pointerEvents: "none",
                  opacity: 0.6,
                }}
                className="custom-district-input FontPublic"
              />

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
                <p className="FontPublic font-semibold">
                  <MyContent name="บันทึก" fontSize="small" />
                </p>
              </Button>
            </Box>
          </CardContent>

          {/* <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Link to={"/SuccessShopScreen"}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              fullWidth
            >
              Create Shop
            </Button>
            </Link>
          </CardActions> */}
        </Box>
          </Container>
        </div>
      )}

      
    </div>
  );
});
