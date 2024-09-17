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

const InputThaiAddress = CreateInput();

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
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData: any = Object.fromEntries(data.entries());

    const dataForm = {
      id: dataId.id || 0,
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
        myToast("ลงทะเบียนร้านค้าสำเร็จ");
        if (dataEdit) {
          onChangeCU();
        } else {
          navigate(RoutePath.dashboardShopScreen);
        }
      }
    });
  };

  return (
    <div className="-mt-16">
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
              {dataId && dataId.id ? (
                <p>แก้ไขรายละเอียด</p>
              ) : (
                <p>สร้างร้านค้า</p>
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
              />
              <TextField
                defaultValue={dataId?.description}
                fullWidth
                label="รายละเอียด"
                variant="outlined"
                margin="normal"
                name="description"
                required
              />

              <TextField
                defaultValue={addresss?.detail}
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
              />
              <label>แขวง/ตำบล</label>
              <InputThaiAddress.District
                value={address["district"]}
                onChange={handleChange("district")}
                onSelect={(e: any) => handleSelect(e)}
              />
              <label>เขต/อำเภอ</label>
              <InputThaiAddress.Amphoe
                value={address["amphoe"]}
                onChange={handleChange("amphoe")}
                onSelect={(e: any) => handleSelect(e)}
              />
              <label>จังหวัด</label>
              <InputThaiAddress.Province
                value={address["province"]}
                onChange={handleChange("province")}
                onSelect={(e: any) => handleSelect(e)}
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
  );
});
