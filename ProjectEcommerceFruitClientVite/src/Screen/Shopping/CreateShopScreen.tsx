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
  Fab,
  Modal,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import { RoutePath } from "../../constants/RoutePath";
import { myToast } from "../../helper/components";
import { Address } from "../../models/Address";
import { CreateInput } from "thai-address-autocomplete-react";
import MyContent from "../../component/MyContent";
import AddressList from "../address/AddressList";
import { IoArrowBack } from "react-icons/io5";
import DashboardAdminShowStore from "../Private/DashboardAdmin/DashboardAdminShowStore";

const InputThaiAddress = CreateInput();
type Props = Parameters<typeof CreateInput>[0];

interface props {
  onChangeCU?: any;
  dataEdit?: any;
  shopTo: any;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid gray",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default observer(function CreateShopScreen({
  onChangeCU,
  dataEdit,
  shopTo,
}: props) {
  const navigate = useNavigate();
  const { usershop, GetShopByUserId, createandupdate } =
    useStore().shopuserStore;
  const { getUserDetailbyId, user } = useStore().userStore;
  const {
    address: addressed,
    createUpdateAddress,
    getAddressByUserId,
    GetAddressByStore,
  }: any = useStore().addressStore;

  useEffect(() => {
    if (!!dataEdit) {
      GetShopByUserId();
    }
    getAddressByUserId();
  }, []);

  const dataId = !!dataEdit ? dataEdit : usershop;

  let addresss = !!dataEdit ? dataEdit : addressed;

  const [addressId, setAddressId] = useState(0);

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

  const [isSelectAddress, setIsSelectAddress] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (scope: string) => (value: string) => {
    setAddress((oldAddr: Address) => ({
      ...oldAddr,
      [scope]: value,
    }));
  };

  const confirmChangeAddress = () => {
    handleClose();
  };

  const onSelectAddress = (values: any) => {
    console.log("values", values);

    setIsSelectAddress(true);
    // addresss = {
    //   id: values?.id,
    //   detail: values?.detail,
    // };
    setAddressId(values?.id);
    setAddress({
      district: values?.subDistrict, // ตำบล tambol
      amphoe: values?.district, // อำเภอ amphoe
      province: values?.province, // จังหวัด changwat
      zipcode: values?.postCode, // รหัสไปรษณีย์ postal code
      detail: values?.detail, // รหัสไปรษณีย์ postal code
    });

    console.log("addresss : addresss :", addresss);
  };

  const handleSelect = (address: Address) => {
    setAddress(address);
  };

  const handleSubmit = async (event: any) => {
    console.log("address", address);
    event.preventDefault();

    if (
      address.detail === "" ||
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
        id: dataId?.id || addressId,
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
            detail: address?.detail,
            isUsed_Store: true,
            isUsed: false,
            gps: "",
          };

          console.log("addresss?.id", addresss?.id);
          console.log("dataAddress", dataAddress);

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
            GetAddressByStore();
            navigate(RoutePath.dashboardShopScreen);
          }
        }
      });
    }
  };
  
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddressList
            confirmChangeAddress={confirmChangeAddress}
            onSelectAddress={onSelectAddress}
            createShop={true}
          />
        </Box>
      </Modal>

      <div>
        <div className=" z-20 cursor-pointer h-16 absolute top-32">
          <button
            onClick={onChangeCU}
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
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
              >
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
                  label="รายละเอียด หรือ คำอธิบายร้านค้า"
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

                {!dataEdit && !shopTo && (
                  <Fab
                    variant="extended"
                    color="primary"
                    onClick={handleOpen}
                    sx={{
                      width: "100%",
                      height: 56,
                      marginTop: 0.7,
                      borderRadius: 1,
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      transition: "all 0.3s ease-in-out",
                      zIndex: 1,
                    }}
                  >
                    <p className="FontPublic">
                      <MyContent
                        name="เลือกที่อยู่ร้านจากที่อยู่ของคุณ"
                        fontSize="littlenormal"
                      />
                    </p>
                  </Fab>
                )}

                <TextField
                  defaultValue={address?.detail}
                  value={address["detail"]}
                  onChange={(e) => {
                    setAddress((oldAddr: Address) => ({
                      ...oldAddr,
                      ["detail"]: e.target.value,
                    }));
                  }}
                  fullWidth
                  label="บ้านเลขที่, หมู่, ซอย, ถนน"
                  variant="outlined"
                  margin="normal"
                  name="detail"
                  // required
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
    </div>
  );
});
