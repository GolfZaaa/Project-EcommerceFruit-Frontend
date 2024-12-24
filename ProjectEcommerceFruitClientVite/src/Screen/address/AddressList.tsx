import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Switch,
  Fab,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/store";
import AddIcon from "@mui/icons-material/Add";
import { Address } from "../../models/Address";
import { CreateInput } from "thai-address-autocomplete-react";
import { myToast } from "../../helper/components";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import MyLottie from "../../helper/components/MyLottie";
import lottiteEmptyList from "../../assets/lotties/emptyList.json";
import CircularProgress from "@mui/material/CircularProgress";
import MyContent from "../../component/MyContent";
import RemoveIcon from "@mui/icons-material/Remove";
import Swal from "sweetalert2";

const InputThaiAddress = CreateInput();

const AddressList = ({
  confirmChangeAddress,
  onSelectAddress,
  createShop,
}: any) => {
  const {
    myAddress,
    isUsedAddress,
    createUpdateAddress,
    getAddressByUserId,
    getAddressgotoOrderByUserId,
    removeAddressById,
  } = useStore().addressStore;

  const { loadings } = useStore().systemSettingStore;
  const { user } = useStore().userStore;

  const [form, setForm] = useState(false);
  const [dataEdit, setDataEdit] = useState<Address | null>(null);

  const [address, setAddress] = useState<Address | any>(
    dataEdit?.id !== 0 && dataEdit?.id !== undefined
      ? {
          district: dataEdit?.subDistrict, // ตำบล tambol
          amphoe: dataEdit?.district, // อำเภอ amphoe
          province: dataEdit?.province, // จังหวัด changwat
          zipcode: dataEdit?.postCode, // รหัสไปรษณีย์ postal code
          detail: dataEdit?.detail, // รหัสไปรษณีย์ postal code
        }
      : {
          district: "", // ตำบล tambol
          amphoe: "", // อำเภอ amphoe
          province: "", // จังหวัด changwat
          zipcode: "", // รหัสไปรษณีย์ postal code
          detail: "", // รหัสไปรษณีย์ postal code
        }
  );

  const onChangeCU = () => setForm(!form);

  const handleAddressUpdate = async (
    addressId: number,
    storeormine: boolean,
    item: any
  ) => {
    await isUsedAddress({ addressId, storeormine });
    getAddressByUserId();
    getAddressgotoOrderByUserId();

    if (confirmChangeAddress !== undefined) {
      onSelectAddress(item);
      confirmChangeAddress();
    }
  };

  const handleSubmit = async (event: any) => {
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

      const dataAddress = {
        id: dataEdit?.id || 0,
        subDistrict: address.district,
        district: address.amphoe,
        province: address.province,
        postCode: address.zipcode,
        detail: formData.detail,
        isUsed_Store: false,
        isUsed: true,
        gps: "",
      };

      await createUpdateAddress(dataAddress);
      myToast((dataEdit?.id ? "แก้ไข" : "เพิ่ม") + "ที่อยู่สำเร็จ");
      onChangeCU();
      getAddressByUserId();
    }
  };

  const handleChange = (scope: string) => (value: string) => {
    console.log("value", value);

    if (value && !/^\d+$/.test(value)) {
      myToast("รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น");
      // alert("รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น");
    } else if (value.length > 5) {
      myToast("รหัสไปรษณีย์ต้องมี 5 ตัวเลขเท่านั้น");
      // alert("รหัสไปรษณีย์ต้องมี 5 ตัวเลขเท่านั้น");
    } else {
      setAddress((oldAddr: Address) => ({
        ...oldAddr,
        [scope]: value,
      }));
    }
  };

  const handleSelect = (address: Address) => {
    setAddress(address);
  };

  const handleRemove = (addressId: number) => {
    Swal.fire({
      title: "ลบที่อยู่",
      text: "ยืนยันจะลบที่อยู่นี้ไหม!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeAddressById(addressId).then(() => {
          Swal.fire({
            title: "ลบที่อยู่แล้ว!",
            text: "ที่อยู่ของคุณถูกลบแล้ว",
            icon: "success",
          });
        });
      }
    });
  };

  return !form ? (
    <div className="FontPublic">
      <Grid
        container
        spacing={2}
        style={{
          marginBottom: 15,
        }}
      >
        <Grid
          item
          xs={createShop ? 10 : 8}
          sm={createShop ? 10 : 8}
          md={createShop ? 10 : 8}
        ></Grid>

        <Grid
          item
          xs={2}
          sm={2}
          md={2}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {confirmChangeAddress !== undefined && (
            <Fab
              variant="extended"
              color="primary"
              onClick={confirmChangeAddress}
            >
              <ArrowBackIosIcon sx={{ mr: 1 }} />
              <p className="FontPublic">
                <MyContent name="กลับ" fontSize="littlenormal" />
              </p>
            </Fab>
          )}
        </Grid>

        {!createShop && (
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            style={{ display: "flex", justifyContent: "flex" }}
          >
            <Fab
              variant="extended"
              color="primary"
              onClick={() => {
                setDataEdit(null);
                onChangeCU();
                setAddress({
                  district: "",
                  amphoe: "",
                  province: "",
                  zipcode: "",
                  detail: "",
                });
              }}
              sx={{
                minWidth: "95%",
                maxWidth: "250px",
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                transition: "all 0.3s ease-in-out",
                ml: 1,
                zIndex: 1,
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              <p className="FontPublic">
                <MyContent name="เพิ่ม" fontSize="littlenormal" />
              </p>
            </Fab>
          </Grid>
        )}
      </Grid>

      {myAddress?.length ? (
        myAddress?.map((item, i) => (
          <div key={i}>
            <Card style={{ marginBottom: "20px" }} key={i}>
              <Grid container spacing={2} alignItems="center">
                {/* ข้อมูลที่อยู่ */}
                <Grid item xs={12} md={4}>
                  <CardContent>
                    {/* <MyContent name={item?.detail} fontSize="small" /> */}
                    <MyContent
                      name={`บ้านเลขที่, หมู่, ซอย, ถนน : ${item?.detail}`}
                      fontSize="littlenormal"
                    />
                    <MyContent
                      name={`แขวง/ตำบล : ${item?.subDistrict}`}
                      fontSize="littlenormal"
                    />
                    <MyContent
                      name={`เขต/อำเภอ : ${item?.district}`}
                      fontSize="littlenormal"
                    />
                    <MyContent
                      name={`จังหวัด : ${item?.province}`}
                      fontSize="littlenormal"
                    />
                    <MyContent
                      name={`รหัสไปรษณีย์ : ${item?.postCode}`}
                      fontSize="littlenormal"
                    />
                  </CardContent>
                </Grid>

                {/* สวิตช์ที่อยู่ร้านค้า */}
                <Grid item xs={12} sm={6} md={2} className="flex-center">
                  {(!!user?.stores.length === true || createShop) && (
                    <div className="text-center">
                      <MyContent
                        name="ตั้งเป็นที่อยู่ร้านค้า"
                        fontSize="littlenormal"
                      />
                      <Switch
                        checked={item.isUsed_Store}
                        onClick={() => handleAddressUpdate(item.id, true, item)}
                        color="primary"
                      />
                    </div>
                  )}
                </Grid>

                {/* สวิตช์ที่อยู่สั่งซื้อ */}
                <Grid item xs={12} sm={6} md={2} className="flex-center">
                  <div className="text-center">
                    <MyContent
                      name="ตั้งเป็นที่อยู่สั่งซื้อ"
                      fontSize="littlenormal"
                    />
                    <Switch
                      checked={item.isUsed}
                      onClick={() => {
                        handleAddressUpdate(item.id, false, item);
                      }}
                      color="primary"
                      disabled={createShop}
                    />
                  </div>
                </Grid>

                {/* ปุ่มแก้ไขที่อยู่ */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {!createShop && (
                    <Fab
                      variant="extended"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setAddress({
                          district: item?.subDistrict,
                          amphoe: item?.district,
                          province: item?.province,
                          zipcode: item?.postCode,
                          detail: item?.detail,
                        });
                        setDataEdit(item);
                        onChangeCU();
                      }}
                      // sx={{
                      //   minWidth: { xs: "80%", sm: "60%", md: "80%" },
                      //   maxWidth: "200px",
                      //   boxShadow: 3,
                      //   "&:hover": {
                      //     backgroundColor: "primary.dark",
                      //   },
                      //   transition: "all 0.3s ease-in-out",
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   zIndex: 1,
                      // }}
                    >
                      <EditIcon sx={{ mr: 1 }} />
                      <p className="FontPublic">
                        <MyContent name="แก้ไข" fontSize="littlenormal" />
                      </p>
                    </Fab>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Fab
                    variant="extended"
                    color="error"
                    onClick={() => handleRemove(item.id)}
                    size="small"
                  >
                    <RemoveIcon sx={{ mr: 1 }} />
                    <p className="FontPublic">
                      <MyContent name="ลบ" fontSize="small" />
                    </p>
                  </Fab>
                </Grid>
              </Grid>
            </Card>
          </div>
        ))
      ) : (
        <div>
          <MyLottie lottieFile={lottiteEmptyList} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            <MyContent name="กรุณาเพิ่มที่อยู่" fontSize="large" />
          </div>
        </div>
      )}
    </div>
  ) : (
    <>
      <Grid item xs={1}>
        <Fab
          variant="extended"
          color="primary"
          onClick={onChangeCU}
          sx={{ zIndex: 1 }}
        >
          <ArrowBackIosIcon sx={{ mr: 1 }} />
          <p className="FontPublic">
            <MyContent name="กลับ" fontSize="littlenormal" />
          </p>
        </Fab>
      </Grid>

      <Box mt={2} component="form" onSubmit={handleSubmit}>
        <TextField
          defaultValue={dataEdit?.detail}
          fullWidth
          label="บ้านเลขที่, หมู่, ซอย, ถนน"
          variant="outlined"
          margin="normal"
          name="detail"
          required
          InputProps={{
            sx: {
              fontSize: "1.2rem",
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

        <label className="FontPublic">
          <MyContent name="รหัสไปรษณีย์" fontSize="small" />
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
        {/* <InputThaiAddress.Zipcode
          value={address["zipcode"]}
          onChange={handleChange("zipcode")}
          onSelect={(e: any) => handleSelect(e)}
          style={{
            height: "55px",
          }}
          className="custom-district-input FontPublic"
        /> */}

        <label className="FontPublic">
          <MyContent name="แขวง/ตำบล" fontSize="small" />
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

        <label className="FontPublic">
          <MyContent name="เขต/อำเภอ" fontSize="small" />
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

        <label className="FontPublic">
          <MyContent name="จังหวัด" fontSize="small" />
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
          disabled={loadings}
        >
          {loadings ? (
            <div className="flex justify-center items-center h-full mt-1 mb-1">
              <CircularProgress
                className="flex items-center"
                size={18}
                color="inherit"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center h-full ">
              <p className="FontPublic">
                <MyContent name="บันทึก" fontSize="littlenormal" />
              </p>
            </div>
          )}
        </Button>
      </Box>
    </>
  );
};

export default observer(AddressList);
