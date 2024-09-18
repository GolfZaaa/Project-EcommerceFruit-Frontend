import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Switch,
  Fab,
  Container,
  TextField,
  Button,
  Typography,
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

const InputThaiAddress = CreateInput();

const AddressList = ({ confirmChangeAddress }: any) => {
  const {
    myAddress,
    isUsedAddress,
    createUpdateAddress,
    getAddressByUserId,
    getAddressgotoOrderByUserId,
  } = useStore().addressStore;

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
    storeormine: boolean
  ) => {
    await isUsedAddress({ addressId, storeormine });
    getAddressByUserId();
    getAddressgotoOrderByUserId();
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
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
  };

  const handleChange = (scope: string) => (value: string) => {
    setAddress((oldAddr: Address) => ({
      ...oldAddr,
      [scope]: value,
    }));
  };

  const handleSelect = (address: Address) => {
    setAddress(address);
  };

  return !form ? (
    <>
      <Grid
        container
        spacing={2}
        style={{
          marginBottom: 15,
        }}
      >
        <Grid item xs={10}></Grid>

        <Grid item xs={1}>
          {confirmChangeAddress !== undefined && (
            <Fab
              variant="extended"
              color="primary"
              onClick={confirmChangeAddress}
            >
              <ArrowBackIosIcon sx={{ mr: 1 }} />
              กลับ
            </Fab>
          )}
        </Grid>

        <Grid item xs={1}>
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
          >
            <AddIcon sx={{ mr: 1 }} />
            เพิ่ม
          </Fab>
        </Grid>
      </Grid>

      {myAddress?.map((item, i) => (
        <div key={i}>
          <Card style={{ marginBottom: "20px" }} key={i}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <CardContent>
                  {item?.detail}
                  <br />
                  แขวง/ตำบล
                  {item?.subDistrict}
                  <br />
                  เขต/อำเภอ
                  {item?.district}
                  <br />
                  จังหวัด
                  {item?.province}
                  <br />
                  รหัสไปรษณีย์ {item?.postCode}
                </CardContent>
              </Grid>
              <Grid item xs={2}>
                ตั้งเป็นที่อยู่ร้านค้า
                <Switch
                  checked={item.isUsed_Store}
                  onClick={() => handleAddressUpdate(item.id, true)}
                />
              </Grid>
              <Grid item xs={2}>
                ตั้งเป็นที่อยู่สั่งซื้อ
                <Switch
                  checked={item.isUsed}
                  onClick={() => {
                    handleAddressUpdate(item.id, false);
                    getAddressgotoOrderByUserId();

                    if (confirmChangeAddress !== undefined) {
                      confirmChangeAddress();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Fab
                  style={{
                    margin: 15,
                  }}
                  variant="extended"
                  color="primary"
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
                >
                  <EditIcon sx={{ mr: 1 }} />
                  แก้ไข
                </Fab>
              </Grid>
            </Grid>
          </Card>
        </div>
      ))}
    </>
  ) : (
    <>
      <Grid item xs={1}>
        <Fab variant="extended" color="primary" onClick={onChangeCU}>
          <ArrowBackIosIcon sx={{ mr: 1 }} />
          กลับ
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
        />
        <label>รหัสไปรษณีย์</label>
        <InputThaiAddress.Zipcode
          value={address["zipcode"]}
          onChange={handleChange("zipcode")}
          onSelect={(e: any) => handleSelect(e)}
          style={{
            height: "55px",
          }}
        />
        <label>แขวง/ตำบล</label>
        <InputThaiAddress.District
          value={address["district"]}
          onChange={handleChange("district")}
          onSelect={(e: any) => handleSelect(e)}
          style={{
            height: "55px",
          }}
        />
        <label>เขต/อำเภอ</label>
        <InputThaiAddress.Amphoe
          value={address["amphoe"]}
          onChange={handleChange("amphoe")}
          onSelect={(e: any) => handleSelect(e)}
          style={{
            height: "55px",
          }}
        />
        <label>จังหวัด</label>
        <InputThaiAddress.Province
          value={address["province"]}
          onChange={handleChange("province")}
          onSelect={(e: any) => handleSelect(e)}
          style={{
            height: "55px",
          }}
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
          บันทึก
        </Button>
      </Box>
    </>
  );
};

export default observer(AddressList);
