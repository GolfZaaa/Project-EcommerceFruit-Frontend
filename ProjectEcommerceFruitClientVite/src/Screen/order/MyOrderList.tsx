import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Typography } from "@mui/material";
import { Order } from "../../models/Order";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MyOrderCard from "./components/MyOrderCard";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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

const MyOrderList = ({ order }: { order: Order[] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState(0);

  const handleChange = (value: number) => {
    setValue(value);
  };

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
          คำสั่งซื้อ
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
            label="ที่ต้องชำระ"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="กำลังรออนุมัติ"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="อนุมัติแล้ว"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ที่ต้องได้รับ"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="สำเร็จแล้ว"
            style={{
              width: "20%",
            }}
          />
          <Tab
            label="ยกเลิกแล้ว"
            style={{
              width: "20%",
            }}
          />
        </Tabs>

        <CustomTabPanel value={value} index={0}>
          <MyOrderCard
            order={order}
            index={0} //ทั้งหมด
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MyOrderCard
            order={order?.filter((item) => item?.paymentImage === null)} //ที่ต้องชำระ
            index={1}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <MyOrderCard
            order={order.filter(
              (item) => item?.paymentImage !== null && item?.status === 0 //กำลังรออนุมัติ
            )}
            index={2}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <MyOrderCard
            order={order.filter(
              (item) =>
                item?.paymentImage !== null &&
                item?.status === 1 &&
                item.confirmReceipt !== 1 && //อนุมัติแล้ว
                item.confirmReceipt !== 2
            )}
            index={3}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <MyOrderCard
            order={order.filter((item) =>
              item?.shippings[0]?.shippingStatus !== undefined
                ? item?.shippings[0]?.shippingStatus === 1 && //ที่ต้องได้รับ
                  item?.confirmReceipt === 0
                : item?.tag !== "จัดส่งผ่านผู้รับหิ้ว" &&
                  item?.tag !== null &&
                  item?.confirmReceipt === 0 &&
                  item?.status !== 2
            )}
            index={4}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <MyOrderCard
            order={order.filter(
              (item) => item?.status === 1 && item?.confirmReceipt === 1 //สำเร็จแล้ว
            )}
            index={5}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={6}>
          <MyOrderCard
            order={order.filter(
              (item) => item?.status === 2 || item?.confirmReceipt === 2 //ยกเลิกแล้ว
            )}
            index={6}
          />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default observer(MyOrderList);

{
  /* <TableContainer component={Paper}>
  <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
    <TableHead>
      <TableRow>
        {columns.map((column, i) => (
          <TableCell key={column.id} align={i > 2 ? "center" : "left"}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {(rowsPerPage > 0
        ? order.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : order
      ).map((row) => (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row">
            paymentImage
          </TableCell>
          <TableCell
          // style={{ width: 160 }}
          //   align="right"
          >
            {row.tag}
          </TableCell>
          <TableCell>{moment(row.createdAt).format("L")}</TableCell>
          <TableCell>
            {row.status === 0
              ? "กำลังรออนุมัติ"
              : row.status === 0
              ? "ยืนยันคำสั่งซื้อแล้ว"
              : "ยกเลิกคำสั่งซื้อแล้ว"}
          </TableCell> */
}

{
  /* <TableCell style={{ width: 100 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleClickOpen}
                >
                  ลบ
                </Button>
              </TableCell> */
}
//         </TableRow>
//       ))}

//       {emptyRows > 0 && (
//         <TableRow style={{ height: 53 * emptyRows }}>
//           <TableCell colSpan={6} />
//         </TableRow>
//       )}
//     </TableBody>

//     <TableFooter>
//       <TableRow>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, { label: "ทั้งหมด", value: -1 }]}
//           colSpan={3}
//           count={order.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           slotProps={{
//             select: {
//               inputProps: {
//                 "aria-label": "rows per page",
//               },
//               native: true,
//             },
//           }}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           ActionsComponent={TablePaginationActions}
//         />
//       </TableRow>
//     </TableFooter>
//   </Table>
// </TableContainer>;
