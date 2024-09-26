import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Order } from "../../models/Order";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MyOrderCardToSend from "./components/MyOrderCardToSend";
import { BiDownload } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
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

  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const [moreData, setmoreData] = useState(false);
  const toggleMoreData = () => {
    setmoreData(!moreData);
  };
  const dataForwardDriver: Order[] = order.filter((item) =>
    item.shippings[0].driverHistories.some(
      (history) => history.statusDriver === 3 && history.userId === user?.id
    )
  );

  return (
    <div className="-mt-12">
      <div className="mt-2 relative flex flex-wrap justify-center items-center gap-10 bg-white p-8 rounded-lg shadow-md border">
        <a
          href="#"
          className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-row items-center justify-center">
            <svg
              className="mr-3 fill-gray-500/95"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
            </svg>
            <span className="font-bold text-gray-600">
              {/* {totalPrice.toLocaleString()} */}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">รายได้สุทธิทั้งหมด</div>
        </a>

        <a
          href="#"
          className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"
        >
          <div className="flex flex-row items-center justify-center">
            <svg
              className="mr-3 fill-gray-500/95"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M5.68,19.74C7.16,20.95 9,21.75 11,21.95V19.93C9.54,19.75 8.21,19.17 7.1,18.31M13,19.93V21.95C15,21.75 16.84,20.95 18.32,19.74L16.89,18.31C15.79,19.17 14.46,19.75 13,19.93M18.31,16.9L19.74,18.33C20.95,16.85 21.75,15 21.95,13H19.93C19.75,14.46 19.17,15.79 18.31,16.9M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12M4.07,13H2.05C2.25,15 3.05,16.84 4.26,18.32L5.69,16.89C4.83,15.79 4.25,14.46 4.07,13M5.69,7.1L4.26,5.68C3.05,7.16 2.25,9 2.05,11H4.07C4.25,9.54 4.83,8.21 5.69,7.1M19.93,11H21.95C21.75,9 20.95,7.16 19.74,5.68L18.31,7.1C19.17,8.21 19.75,9.54 19.93,11M18.32,4.26C16.84,3.05 15,2.25 13,2.05V4.07C14.46,4.25 15.79,4.83 16.9,5.69M11,4.07V2.05C9,2.25 7.16,3.05 5.68,4.26L7.1,5.69C8.21,4.83 9.54,4.25 11,4.07Z" />
            </svg>
            {/* <span className="font-bold text-gray-600">{totalQuantity}</span> */}
          </div>
          <div className="mt-2 text-sm text-gray-400">จำนวนชิ้นที่หิ้วได้</div>
        </a>

        <a
          href="#"
          className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"
        >
          <div className="flex flex-row items-center justify-center">
            <svg
              className="mr-3 fill-gray-500/95"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
            </svg>
            <span className="font-bold text-gray-600">
              {/* {totalOrderSuccess} */}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">ยอดหิ้วที่สำเร็จ</div>
        </a>

        <a
          href="#"
          className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400/80 bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"
        >
          <div className="flex flex-row items-center justify-center">
            <svg
              className="mr-3 fill-gray-500/95"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M2.5 19.6L3.8 20.2V11.2L1.4 17C1 18.1 1.5 19.2 2.5 19.6M15.2 4.8L20.2 16.8L12.9 19.8L7.9 7.9V7.8L15.2 4.8M15.3 2.8C15 2.8 14.8 2.8 14.5 2.9L7.1 6C6.4 6.3 5.9 7 5.9 7.8V8L11 20.1L20.3 16.5L15.3 2.8M4.2 11.2V20.2L5.6 19.6C6.6 19.2 7.1 18.1 6.7 17L4.2 11.2Z" />
            </svg>
            <span className="font-bold text-gray-600">
              {/* {totalOrderCancel} */}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            ยอดหิ้วสุทธิของเดือนนี้
          </div>
        </a>

        <button
          id="downloadButton"
          onClick={toggleDropdown}
          className="absolute top-5 right-5 p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
          <BiDownload />
        </button>

        {openDropdown && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-28">
            <ul>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                // onClick={generatePDF}
              >
                <VscFilePdf className="mr-2" /> PDF
              </li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                // onClick={generateExcel}
              >
                <RiFileExcel2Line className="mr-2" /> Excel
              </li>
            </ul>
          </div>
        )}

        <div>
          <div
            className="flex items-center font-bold cursor-pointer"
            onClick={toggleMoreData}
          >
            ดูข้อมูลเพิ่มเติม <MdExpandMore size={25} className="-mb-1" />
          </div>

          {moreData && <div className="block mt-2">จริง</div>}
        </div>
      </div>

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
