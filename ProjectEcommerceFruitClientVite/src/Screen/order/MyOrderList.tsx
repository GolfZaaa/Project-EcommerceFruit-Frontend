import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Alert,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  Fab,
} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useStore } from "../../store/store";
import { Order } from "../../models/Order";
import EditOrderScreen from "./EditOrderScreen";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { OrderItem } from "../../models/OrderItem";
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

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyOrderList = () => {
  const { order, getOrdersByUser } = useStore().orderStore;

  useEffect(() => {
    getOrdersByUser();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [value, setValue] = useState(0);

  const handleChange = (value: number) => {
    setValue(value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - order.length) : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: "paymentImage", label: "รูปภาพสลิป" },
    { id: "description", label: "หมายเลขพัสดุ (tracking)" },
    { id: "createdAt", label: "สร้างเมื่อวันที่" },
    { id: "status", label: "สถานะ" },
    { id: "edit", label: "ตัวเลือก" },
  ];

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
          label="สำเร็จแล้ว"
          style={{
            width: "20%",
          }}
        />
        <Tab
          label="ยกเลิก"
          style={{
            width: "20%",
          }}
        />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <MyOrderCard order={order} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MyOrderCard
          order={order.filter((item) => item.paymentImage === null)}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <MyOrderCard order={order.filter((item) => item.status === 1)} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <MyOrderCard order={order.filter((item) => item.status === 2)} />
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
