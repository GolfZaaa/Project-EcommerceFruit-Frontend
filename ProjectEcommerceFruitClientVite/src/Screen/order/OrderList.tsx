import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
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
import { pathImages } from "../../constants/RoutePath";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
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

const OrderList = () => {
  const { order, getOrderByStore } = useStore().orderStore;
  const { user } = useStore().userStore;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [onCreate, setOnCreate] = useState(false);

  const [dataEdit, setDataEdit] = useState<Order | null>();

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getOrderByStore(user?.stores[0].id || 0);
  }, [open, onCreate]);

  // Avoid a layout jump when reaching the last page with empty rows.
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
    { id: "orderId", label: "รหัสคำสั่งซื้อ" },
    { id: "paymentImage", label: "รูปภาพสลิป" },
    { id: "description", label: "หมายเลขพัสดุ (tracking)" },
    { id: "createdAt", label: "สร้างเมื่อวันที่" },
    { id: "status", label: "สถานะ" },
    { id: "edit", label: "ตัวเลือก" },
  ];

  const onChangeCU = () => setOnCreate(!onCreate);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="-mt-16">
      {onCreate ? (
        <EditOrderScreen onChangeCU={onChangeCU} dataEdit={dataEdit} />
      ) : (
        <Container maxWidth="lg">
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

            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column, i) => (
                      <TableCell
                        key={column.id}
                        align={i > 2 ? "center" : "left"}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? order.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : order
                  ).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.orderId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.paymentImage ? (
                          <img
                            src={pathImages.paymentImage + row.paymentImage}
                            alt={
                              pathImages.paymentImage + dataEdit?.paymentImage
                            }
                            width={100}
                          />
                        ) : (
                          "ไม่มีรูปภาพ"
                        )}
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
                          : row.status === 1
                          ? "ยืนยันคำสั่งซื้อแล้ว"
                          : row.status === 2
                          ? "ยกเลิกคำสั่งซื้อแล้ว"
                          : "เพิ่มสถานะด้วย"}
                      </TableCell>
                      <TableCell style={{ width: 100 }}>
                        <Fab
                          variant="extended"
                          color="primary"
                          onClick={() => {
                            setDataEdit(row);
                            onChangeCU();
                          }}
                        >
                          <EditIcon sx={{ mr: 1 }} />
                          แก้ไข
                        </Fab>
                      </TableCell>
                      {/* <TableCell style={{ width: 100 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          onClick={handleClickOpen}
                        >
                          ลบ
                        </Button>
                      </TableCell> */}

                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"ลบข้อมูลนี้ออกจากฐานข้อมูล"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            ลบข้อมูลนี้ออกจากฐานข้อมูล ยืนยันเพื่อลบ
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>ยกเลิก</Button>
                          <Button
                            onClick={() => {
                              //   removeProduct(row.id);
                              //   getProductByStore(user?.stores[0].id || 0);
                              handleClose();
                            }}
                            autoFocus
                          >
                            ยืนยัน
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "ทั้งหมด", value: -1 },
                      ]}
                      colSpan={3}
                      count={order.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            "aria-label": "rows per page",
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default observer(OrderList);
