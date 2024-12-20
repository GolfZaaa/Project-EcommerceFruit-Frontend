import React, { useEffect, useRef, useState } from "react";
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
import { pathImages } from "../../constants/RoutePath";
import dayjs from "dayjs";
import { BiDownload } from "react-icons/bi";
import { RiFileExcel2Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";
import html2pdf from "html2pdf.js";
import ExcelJS from "exceljs";
import MyContent from "../../component/MyContent";
import { formatDateThai } from "../../helper/components";

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

  const onChangeCU = () => setOnCreate(!onCreate);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const componentRef = useRef(null);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); 

  const columns = [
    { id: "orderId", label: "รหัสคำสั่งซื้อ" },
    { id: "paymentImage", label: "รูปภาพสลิป" },
    { id: "description", label: "หมายเลขพัสดุ (tracking)" },
    { id: "createdAt", label: "สร้างเมื่อวันที่" },
    { id: "status", label: "สถานะ" },
    { id: "confirmReceipt", label: "สถานะพัสดุ" },
    ...(isGeneratingPDF ? [] : [{ id: "edit", label: "ตัวเลือก" }]),
  ];

  function generatePDF() {
    setIsGeneratingPDF(true); 
    const opt = {
      margin: 0.2,
      filename: "report_MyAccount.pdf",
      image: { type: "png", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true }, 
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const closeButton:any = document.querySelector("#closeButton");
    const downloadButton:any = document.querySelector("#downloadButton");

    if (downloadButton) {
      downloadButton.style.display = "none";
    }

    if (closeButton) {
      closeButton.style.display = "none";
    }

    html2pdf()
      .from(componentRef.current)
      .set(opt)
      .save()
      .then(() => {
        setIsGeneratingPDF(false);
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
        if (closeButton) {
          closeButton.style.display = "block";
        }
      });
  }

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Order Data");

    worksheet.columns = [
      { header: "รหัสคำสั่งซื้อ", key: "orderId", width: 20 },
      { header: "รูปภาพสลิป", key: "paymentImage", width: 30 },
      { header: "หมายเลขพัสดุ", key: "description", width: 30 },
      { header: "สร้างเมื่อวันที่", key: "createdAt", width: 20 },
      { header: "สถานะคำสั่งซื้อ", key: "status", width: 30 },
      { header: "สถานะพัสดุ", key: "confirmReceipt", width: 30 },
    ];

    worksheet.getRow(1).font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFF" },
    };
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0070C0" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const addStyledRow = (rowData: any) => {
      const row = worksheet.addRow(rowData);
      row.eachCell((cell, colIndex) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: colIndex === 2 ? "center" : "left",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        console.log("rowData.paymentImage", rowData.paymentImage);

        if (colIndex === 2 && rowData.paymentImage !== "ไม่มีรูปภาพ") {
          const imageUrl = `https://localhost:8168/paymentImage/${rowData.paymentImage}`; 
          cell.value = {
            text: "มีรูปภาพ",
            hyperlink: imageUrl,
          };
          cell.font = { color: { argb: "0000FF" }, underline: true }; 
        }
      });
    };

    for (const row of order) {
      const statusText =
        row.status === 0
          ? "กำลังรออนุมัติ"
          : row.status === 1
          ? "ยืนยันคำสั่งซื้อแล้ว"
          : row.status === 2
          ? "ยกเลิกคำสั่งซื้อแล้ว"
          : "เพิ่มสถานะด้วย";

      const confirmReceiptText =
        row.confirmReceipt === 0
          ? "กำลังดำเนินการ"
          : row.confirmReceipt === 1
          ? "ได้รับพัสดุแล้ว"
          : row.confirmReceipt === 2
          ? "ไม่ได้รับพัสดุ"
          : "เพิ่มสถานะด้วย";

      const createdAtFormatted = dayjs(row.createdAt)
        .add(543, "year")
        .format("DD/MM/YYYY");

      addStyledRow({
        orderId: row.orderId,
        paymentImage: row.paymentImage ? row.paymentImage : "ไม่มีรูปภาพ",
        description: row.tag || "ยังไม่ได้กรอกหมายเลขพัสดุ",
        createdAt: createdAtFormatted,
        status: statusText,
        confirmReceipt: confirmReceiptText,
      });
    }

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "order_data_with_images.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // const generateExcel = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Order Data");

  //   worksheet.columns = [
  //     { header: "รหัสคำสั่งซื้อ", key: "orderId", width: 20 },
  //     { header: "รูปภาพสลิป", key: "paymentImage", width: 30 },
  //     { header: "หมายเลขพัสดุ", key: "description", width: 30 },
  //     { header: "สร้างเมื่อวันที่", key: "createdAt", width: 20 },
  //     { header: "สถานะคำสั่งซื้อ", key: "status", width: 30 },
  //     { header: "สถานะพัสดุ", key: "confirmReceipt", width: 30 },
  //   ];

  //   worksheet.getRow(1).font = {
  //     bold: true,
  //     size: 14,
  //     color: { argb: "FFFFFF" },
  //   };
  //   worksheet.getRow(1).alignment = {
  //     horizontal: "center",
  //     vertical: "middle",
  //   };
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "0070C0" },
  //     };
  //     cell.border = {
  //       top: { style: "thin" },
  //       left: { style: "thin" },
  //       bottom: { style: "thin" },
  //       right: { style: "thin" },
  //     };
  //   });

  //   const addStyledRow = (rowData: any) => {
  //     const row = worksheet.addRow(rowData);
  //     row.eachCell((cell, colIndex) => {
  //       cell.alignment = {
  //         vertical: "middle",
  //         horizontal: colIndex === 2 ? "center" : "left",
  //       };
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" },
  //       };
  //     });
  //   };

  //   for (const row of order) {
  //     const statusText =
  //       row.status === 0
  //         ? "กำลังรออนุมัติ"
  //         : row.status === 1
  //         ? "ยืนยันคำสั่งซื้อแล้ว"
  //         : row.status === 2
  //         ? "ยกเลิกคำสั่งซื้อแล้ว"
  //         : "เพิ่มสถานะด้วย";

  //     const confirmReceiptText =
  //       row.confirmReceipt === 0
  //         ? "กำลังดำเนินการ"
  //         : row.confirmReceipt === 1
  //         ? "ได้รับพัสดุแล้ว"
  //         : row.confirmReceipt === 2
  //         ? "ไม่ได้รับพัสดุ"
  //         : "เพิ่มสถานะด้วย";

  //     const createdAtFormatted = dayjs(row.createdAt)
  //       .add(543, "year")
  //       .format("DD/MM/YYYY");

  //     const addedRow = worksheet.addRow({
  //       orderId: row.orderId,
  //       paymentImage: row.paymentImage ? "มีรูปภาพ" : "ไม่มีรูปภาพ",
  //       description: row.tag || "ยังไม่ได้กรอกหมายเลขพัสดุ",
  //       createdAt: createdAtFormatted,
  //       status: statusText,
  //       confirmReceipt: confirmReceiptText,
  //     });

  //     if (row.paymentImage) {
  //       //go to url pathImages.paymentImage + row.paymentImage
  //       // try {
  //       //   // const imageUrl =
  //       //   //   "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png";
  //       //   const imageUrl = pathImages.paymentImage + row.paymentImage;
  //       //   const response = await fetch(imageUrl);
  //       //   const arrayBuffer = await response.arrayBuffer();
  //       //   const imageId = workbook.addImage({
  //       //     buffer: arrayBuffer,
  //       //     extension: "png",
  //       //   });
  //       //   worksheet.addImage(imageId, {
  //       //     tl: { col: 1, row: addedRow.number - 1 },
  //       //     ext: { width: 100, height: 100 },
  //       //   });
  //       // } catch (error) {
  //       //   console.error("Error adding image to Excel:", error);
  //       // }
  //     }
  //   }

  //   workbook.xlsx.writeBuffer().then((data) => {
  //     const blob = new Blob([data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "order_data_with_images.xlsx";
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   });
  // };

  return (
    <div style={{ marginTop: 102 }}>
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
              <p className="FontPublic font-bold">
                <MyContent name="คำสั่งซื้อ" fontSize="large" />
              </p>
            </Typography>

            <div className="flex justify-end w-full mb-5">
              <button
                onClick={toggleDropdown}
                className=" p-2 bg-blue-500 text-white rounded-md"
              >
                <BiDownload />
              </button>
            </div>

            {openDropdown && (
              <div className="absolute right-16 top-44 mt-2 bg-white border rounded shadow-md w-20">
                <ul>
                  <li
                    className="p-2 hover:bg-gray-200 cursor-pointer flex items-center "
                    onClick={generatePDF}
                  >
                    <VscFilePdf className="mr-2" /> PDF
                  </li>
                  <li
                    className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                    onClick={generateExcel}
                  >
                    <RiFileExcel2Line className="mr-2" /> Excel
                  </li>
                </ul>
              </div>
            )}

            <TableContainer ref={componentRef} component={Paper}>
              <Table
                sx={{ width: "100%" }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        // align={i > 2 ? "center" : "left"}
                        align="center"
                      >
                        <p className="FontPublic">
                          <MyContent name={column.label} fontSize="small" />
                        </p>
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
                  ).map((row) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          style={{
                            width: 170,
                          }}
                        >
                          <p className="FontPublic">
                            <MyContent name={row.orderId} fontSize="smaller" />
                          </p>
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.paymentImage ? (
                            isGeneratingPDF ? (
                              <a
                                href={
                                  pathImages.paymentImage + row.paymentImage
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <p style={{ fontSize: 16, fontWeight: 500, color: '#0400ff', textDecoration: 'underline' }}>
                                ดูรูปภาพ
                              </p>
                              </a>
                            ) : (
                              <a
                                href={
                                  pathImages.paymentImage + row.paymentImage
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={
                                    pathImages.paymentImage + row.paymentImage
                                  }
                                  alt={
                                    pathImages.paymentImage +
                                    dataEdit?.paymentImage
                                  }
                                  width={130}
                                />
                              </a>
                            )
                          ) : (
                            <MyContent name="-" fontSize="normal" />
                          )}
                        </TableCell>
                        <TableCell style={{ width: 250 }} align="center">
                          <div
                            className={
                              row.status !== 2
                                ? !!row.tag
                                  ? ""
                                  : "text-yellow-500 bg-yellow-100 border border-yellow-500 px-3 py-1 rounded-full"
                                : ""
                            }
                          >
                            {row.status === 2 ? (
                              <p className="FontPublic">
                                <MyContent
                                  name="ยกเลิกคำสั่งซื้อแล้ว"
                                  fontSize="smaller"
                                />
                              </p>
                            ) : !!row.tag ? (
                              <p className="FontPublic">
                                <MyContent name={row.tag} fontSize="smaller" />
                              </p>
                            ) : (
                              <p className="FontPublic ">
                                <MyContent
                                  name="ยังไม่ได้กรอกหมายเลขพัสดุ"
                                  fontSize="smaller"
                                />
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            width: 200,
                          }}
                        >
                          <p className="FontPublic ">
                            <MyContent
                              name={formatDateThai(row.createdAt, +543, 1)}
                              fontSize="smaller"
                            />
                          </p>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            width: 160,
                          }}
                        >
                          <div
                            className={
                              (row.status === 0
                                ? "text-yellow-500 bg-yellow-100 border border-yellow-500"
                                : row.status === 1
                                ? "text-green-500 bg-green-100 border border-green-500"
                                : row.status === 2
                                ? "text-red-500 bg-red-100 border border-red-500"
                                : "") + " px-3 py-1 rounded-full font-semibold"
                            }
                          >
                            {row.status === 0 ? (
                              <p className="FontPublic font-semibold">
                                <MyContent
                                  name="กำลังรออนุมัติ"
                                  fontSize="smaller"
                                />
                              </p>
                            ) : row.status === 1 ? (
                              <p className="FontPublic font-semibold">
                                <MyContent
                                  name="ยืนยันคำสั่งซื้อแล้ว"
                                  fontSize="smaller"
                                />
                              </p>
                            ) : row.status === 2 ? (
                              <p className="FontPublic font-semibold">
                                <MyContent
                                  name="ยกเลิกคำสั่งซื้อแล้ว"
                                  fontSize="smaller"
                                />
                              </p>
                            ) : (
                              <p>
                                <MyContent
                                  name="กรุณาเพิ่มสถานะ"
                                  fontSize="smaller"
                                />
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            width: 160,
                          }}
                        >
                          {row.confirmReceipt === 0 ? (
                            <p className="FontPublic ">
                              <MyContent
                                name="กำลังดำเนินการ"
                                fontSize="smaller"
                              />
                            </p>
                          ) : row.confirmReceipt === 1 ? (
                            <p className="FontPublic ">
                              <MyContent
                                name="ได้รับพัสดุแล้ว"
                                fontSize="smaller"
                              />
                            </p>
                          ) : row.confirmReceipt === 2 ? (
                            <p className="FontPublic ">
                              <MyContent
                                name="ไม่ได้รับพัสดุ"
                                fontSize="smaller"
                              />
                            </p>
                          ) : (
                            <p className="FontPublic ">
                              <MyContent
                                name="กรุณาเพิ่มสถานะ"
                                fontSize="smaller"
                              />
                            </p>
                          )}
                        </TableCell>
                        {isGeneratingPDF ? (
                          <div></div>
                        ) : (
                          <TableCell
                            align="center"
                            style={{
                              width: 160,
                            }}
                          >
                            <Fab
                              variant="extended"
                              color="primary"
                              onClick={() => {
                                setDataEdit(row);
                                onChangeCU();
                              }}
                            >
                              <p className="FontPublic font-semibold">
                                <MyContent
                                  name="เพิ่มเติม"
                                  fontSize="smaller"
                                />
                              </p>
                            </Fab>
                          </TableCell>
                        )}

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
                                //   removeProduct(row.id);
                                //   getProductByStore(user?.stores[0].id || 0);
                                handleClose();
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
                    );
                  })}
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
