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
import { useStore } from "../../../store/store";
import TableHead from "@mui/material/TableHead";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import { NavLink } from "react-router-dom";
import { RoutePath } from "../../../constants/RoutePath";
import CreateFruitGIScreen from "../CreateFruitGIScreen";
import { ProductGI } from "../../../models/ProductGI";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HTMLReactParser from "html-react-parser/lib/index";
import CircularProgress from "@mui/material/CircularProgress";
import { myToast } from "../../../helper/components";
import MyContent from "../../../component/MyContent";

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

const ProductGIList = () => {
  const { productGI, getProductGI, getCategory, removeProductGI, loadingPGI } =
    useStore().productStore;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [onCreate, setOnCreate] = useState(false);

  const [dataEdit, setDataEdit] = useState<ProductGI | null>();

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getProductGI(1);
    getCategory();
  }, []);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productGI.length) : 0;

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
    { id: "name", label: "ชื่อ" },
    { id: "category", label: "ประเภท" },
    { id: "edit", label: "ตัวเลือก" },
    { id: "remove", label: "ตัวเลือก" },
  ];

  const onChangeCU = () => setOnCreate(!onCreate);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("loadingPGI", loadingPGI);

  return (
    <Box className="mt-9" sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {onCreate ? (
        <CreateFruitGIScreen onChangeCU={onChangeCU} dataEdit={dataEdit} />
      ) : (
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={4}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h4" gutterBottom>
              <p className="FontPublic font-bold">
                <MyContent name="เพิ่มข้อมูล (GI) สินค้า" fontSize="large" />
              </p>
            </Typography>
            <Grid
              container
              spacing={2}
              justifyContent="flex-end"
              mb={2}
              sx={{ width: "100%" }}
            >
              <Grid item>
                <Fab
                  variant="extended"
                  color="primary"
                  onClick={() => {
                    setDataEdit(null);
                    onChangeCU();
                  }}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  <p className="FontPublic">
                    <MyContent name="เพิ่ม" fontSize="small" />
                  </p>
                </Fab>
              </Grid>
            </Grid>

            {loadingPGI ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
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
                          <p className="FontPublic font-semibold">
                            <MyContent name={column.label} fontSize="small" />
                          </p>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? productGI.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : productGI
                    ).map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          <p className="FontPublic">
                            <MyContent name={row.name} fontSize="small" />
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="FontPublic">
                            <MyContent
                              name={row?.category?.name}
                              fontSize="small"
                            />
                          </p>
                        </TableCell>
                        <TableCell>
                          <Fab
                            variant="extended"
                            color="primary"
                            onClick={() => {
                              setDataEdit(row);
                              onChangeCU();
                            }}
                          >
                            <EditIcon sx={{ mr: 1 }} />
                            <p className="FontPublic">
                              <MyContent name="แก้ไข" fontSize="small" />
                            </p>
                          </Fab>
                        </TableCell>
                        <TableCell align="center">
                          <Fab
                            variant="extended"
                            color="error"
                            onClick={handleClickOpen}
                          >
                            <RemoveIcon sx={{ mr: 1 }} />
                            <p className="FontPublic">
                              <MyContent name="ลบ" fontSize="small" />
                            </p>
                          </Fab>
                        </TableCell>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle
                            id="alert-dialog-title"
                            sx={{ textAlign: "center" }}
                          >
                            <p className="FontPublic font-semibold">
                              <MyContent
                                name="ลบข้อมูลออกจากระบบฐานข้อมูล"
                                fontSize="littlenormal"
                              />
                            </p>
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText
                              id="alert-dialog-description"
                              sx={{ textAlign: "center" }}
                            >
                              <p className="FontPublic">
                                <MyContent
                                  name="การดำเนินการนี้ต้องได้รับการยืนยันก่อนดำเนินการ"
                                  fontSize="small"
                                />
                              </p>
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>
                              <p className="FontPublic">
                                <MyContent name="ยกเลิก" fontSize="small" />
                              </p>
                            </Button>
                            <Button
                              onClick={() => {
                                removeProductGI(row.id).then((res) => {
                                  if (res !== true) {
                                    myToast("ข้อมูล GI นี้มีการใช้งานอยู่");
                                  }
                                  handleClose();
                                });
                              }}
                              autoFocus
                            >
                              <p className="FontPublic">
                                <MyContent name="ยืนยัน" fontSize="small" />
                              </p>
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
                        count={productGI.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default observer(ProductGIList);
