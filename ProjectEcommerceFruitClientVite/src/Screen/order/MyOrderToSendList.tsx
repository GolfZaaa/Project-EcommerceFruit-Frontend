import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Order } from "../../models/Order";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MyOrderCardToSend from "./components/MyOrderCardToSend";
import { useStore } from "../../store/store";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        width: "100%",
      }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MyOrderToSendList = ({ order }: { order: Order[] }) => {
  const { user } = useStore().userStore;

  const [value, setValue] = useState(0);

  const handleChange = (value: number) => {
    setValue(value);
  };

  const dataForwardDriver: Order[] = order.filter((item) =>
    item.shippings[0].driverHistories.some(
      (history) => history.statusDriver === 3 && history.userId === user?.id
    )
  );

  return (
    <div className="-mt-12">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={4}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          สร้างรายได้
        </Typography>
        <Tabs
          value={value}
          onChange={(_, v) => handleChange(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          style={{
            width: "100%",
          }}
        >
          <Tab
            label="ทั้งหมด"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ที่ต้องส่ง"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ส่งแล้ว"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ส่งต่อให้ผู้จัดส่งคนอื่น"
            style={{
              width: "20%",
            }}
          />
        </Tabs>

        <CustomTabPanel value={value} index={0}>
          <MyOrderCardToSend order={order} index={0} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MyOrderCardToSend
            order={order.filter(
              (item) => item?.shippings[0]?.shippingStatus === 0
            )}
            index={1}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <MyOrderCardToSend
            order={order.filter(
              (item) => item?.shippings[0]?.shippingStatus === 1
            )}
            index={2}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <MyOrderCardToSend order={dataForwardDriver} index={3} />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default observer(MyOrderToSendList);
