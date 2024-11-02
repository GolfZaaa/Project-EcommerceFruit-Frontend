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

const InputThaiAddress = CreateInput();

const AddressList = ({ confirmChangeAddress }: any) => {
  const {
    myAddress,
    isUsedAddress,
    createUpdateAddress,
    getAddressByUserId,
    getAddressgotoOrderByUserId,
  } = useStore().addressStore;

  const { loadings } = useStore().systemSettingStore;

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
        <Grid item xs={8}></Grid>

        <Grid item xs={2}>
          {confirmChangeAddress !== undefined && (
            <Fab
              variant="extended"
              color="primary"
              onClick={confirmChangeAddress}
            >
              <ArrowBackIosIcon sx={{ mr: 1 }} />
              <MyContent name="กลับ" fontSize="small" />
            </Fab>
          )}
        </Grid>

        <Grid  item xs={12} sm={6} md={2} style={{ display: "flex", justifyContent: "flex-start" }}>
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
      minWidth: '95%',
      maxWidth: '250px',  // ปรับขนาดสูงสุดหากต้องการ
      boxShadow: 3,
      "&:hover": {
        backgroundColor: 'primary.dark',
      },
      transition: 'all 0.3s ease-in-out',
      ml: 1,
    }}
  >
    <AddIcon sx={{ mr: 1 }} />
    <MyContent name="เพิ่ม" fontSize="small" />
  </Fab>
</Grid>

        
      </Grid>


      {myAddress?.length ? (
        myAddress?.map((item, i) => (
          <div key={i}>

<Card style={{ marginBottom: "20px" }} key={i}>
  <Grid container spacing={2} alignItems="center">
    {/* ข้อมูลที่อยู่ */}
    <Grid item xs={12} md={5}>
      <CardContent>
        <MyContent name={item?.detail} fontSize="small" />
        <MyContent name={`แขวง/ตำบล ${item?.subDistrict}`} fontSize="small" />
        <MyContent name={`เขต/อำเภอ ${item?.district}`} fontSize="small" />
        <MyContent name={`จังหวัด ${item?.province}`} fontSize="small" />
        <MyContent name={`รหัสไปรษณีย์ ${item?.postCode}`} fontSize="small" />
      </CardContent>
    </Grid>

    {/* สวิตช์ที่อยู่ร้านค้า */}
    <Grid item xs={12} sm={6} md={2} className="flex-center">
      <div className="text-center">
        <MyContent name="ตั้งเป็นที่อยู่ร้านค้า" fontSize="small" />
        <Switch
          checked={item.isUsed_Store}
          onClick={() => handleAddressUpdate(item.id, true)}
          color="primary"
        />
      </div>
    </Grid>

    {/* สวิตช์ที่อยู่สั่งซื้อ */}
    <Grid item xs={12} sm={6} md={3} className="flex-center">
      <div className="text-center">
        <MyContent name="ตั้งเป็นที่อยู่สั่งซื้อ" fontSize="small" />
        <Switch
          checked={item.isUsed}
          onClick={() => {
            handleAddressUpdate(item.id, false);
            getAddressgotoOrderByUserId();
            if (confirmChangeAddress !== undefined) confirmChangeAddress();
          }}
          color="primary"
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
  <Fab
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
    sx={{
      minWidth: { xs: '80%', sm: '60%', md: '80%' },
      maxWidth: '200px',
      boxShadow: 3,
      "&:hover": {
        backgroundColor: 'primary.dark',
      },
      transition: 'all 0.3s ease-in-out',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <EditIcon sx={{ mr: 1 }} />
    <MyContent name="แก้ไข" fontSize="small" />
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
            }}
          >
            ที่อยู่ของคุณว่าง
          </div>
        </div>
      )}
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
              <p>บันทึก</p>
            </div>
          )}
        </Button>
      </Box>
    </>
  );
};

export default observer(AddressList);
