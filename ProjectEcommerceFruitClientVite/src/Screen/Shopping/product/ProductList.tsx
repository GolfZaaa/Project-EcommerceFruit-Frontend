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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CreateProductScreen from "../CreateProductScreen";
import { Product } from "../../../models/Product";
import HTMLReactParser from "html-react-parser/lib/index";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import { pathImages } from "../../../constants/RoutePath";
import { MySwitch } from "../../../helper/components/MySwitch";
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

const ProductList = () => {
  const { product, getProductByStore, isUsedProduct, removeProduct } =
    useStore().productStore;
  const { user } = useStore().userStore;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [onCreate, setOnCreate] = useState(false);

  const [dataEdit, setDataEdit] = useState<Product | null>();

  useEffect(() => {
    getProductByStore(user?.stores[0].id || 0);
  }, [open, onCreate]);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - product.length) : 0;

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
    { id: "description", label: "รูปภาพ" },
    { id: "category", label: "ประเภท" },
    { id: "price", label: "ราคา" },
    { id: "weight", label: "น้ำหนัก (กิโลกรัม)" },
    { id: "quantity", label: "จำนวน" },
    { id: "status", label: "สถานะ" },
    { id: "edit", label: "ตัวเลือก" },
    { id: "remove", label: "ตัวเลือก" },
  ];

  const onChangeCU = () => setOnCreate(!onCreate);

  const RenderProduct = ({ row }: { row: Product }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <TableRow key={row.id}>
        <TableCell component="th" scope="row">
          <p className="FontPublic overflow-hidden text-ellipsis whitespace-nowrap">
            <MyContent
              name={
                row.productGI.name.length > 8
                  ? `${row.productGI.name.slice(0, 8)}...`
                  : row.productGI.name
              }
              fontSize="small"
            />
          </p>
        </TableCell>
        <TableCell align="center">
          {row.images ? (
            <img
              src={pathImages.product + row.images}
              alt="product"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "250px",
                objectFit: "contain",
              }}
            />
          ) : (
            "ไม่มีรูปภาพ"
          )}
        </TableCell>
        <TableCell align="center">
          <p className="FontPublic ">
            <MyContent name={row?.productGI?.category.name} fontSize="small" />
          </p>
        </TableCell>
        <TableCell align="center">
          <p className="FontPublic">
            <MyContent name={row?.price} fontSize="small" />
          </p>
        </TableCell>
        <TableCell align="center">
          <p className="FontPublic">
            <MyContent name={row?.weight} fontSize="small" />
          </p>
        </TableCell>
        <TableCell align="center">
          <p className="FontPublic">
            <MyContent name={row?.quantity} fontSize="small" />
          </p>
        </TableCell>
        <TableCell>
          <MySwitch
            handleChange={async () => {
              await isUsedProduct(row.id).then(() => {
                getProductByStore(user?.stores[0].id || 0);
              });
            }}
            checked={row.status}
          />
        </TableCell>
        <TableCell align="center">
          <Fab
            variant="extended"
            color="primary"
            onClick={() => {
              setDataEdit(row);
              onChangeCU();
            }}
            size="small"
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
            size="small"
          >
            <RemoveIcon sx={{ mr: 1 }} />
            <p className="FontPublic">
              <MyContent name="ลบ" fontSize="small" />
            </p>
          </Fab>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ textAlign: "center" }}>
              <p className="FontPublic font-semibold">
                <MyContent
                  name="ลบข้อมูลออกจากระบบฐานข้อมูล"
                  fontSize="littlenormal"
                />
              </p>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
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
                onClick={async () => {
                  await removeProduct(row.id).then(() => {
                    getProductByStore(user?.stores[0].id || 0);
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
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="responsive-container" style={{ marginTop: 102 }}>
      {onCreate ? (
        <CreateProductScreen
          onChangeCU={onChangeCU}
          dataEdit={dataEdit}
          id={1}
        />
      ) : (
        <Container maxWidth="lg">
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              <p className="FontPublic font-bold">
                <MyContent name="เพิ่มสินค้า" fontSize="large" />
              </p>
            </Typography>
            <Grid container justifyContent="flex-end" mb={2} spacing={2}>
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

            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        <p className="FontPublic">
                          <MyContent name={column.label} fontSize="small" />
                        </p>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? product.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : product
                  ).map((row) => (
                    <RenderProduct row={row} />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={columns.length} />
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
                      colSpan={columns.length}
                      count={product.length}
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
          </Box>
        </Container>
      )}
    </div>
  );
};

export default observer(ProductList);
