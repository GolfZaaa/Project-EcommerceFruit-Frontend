import { toast } from "react-toastify";

export const myToast = (name: string) => toast(name);

export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    ["image"],
  ],
};

export const formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "align",
  "image",
];

export function formatDateThai(date: Date, addYear = +543, format: number) {
  const createdAt = new Date(date);
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const day = createdAt.getDate();
  const month = months[createdAt.getMonth()];
  const year = createdAt.getFullYear() + addYear; 
  const hours = createdAt.getHours();
  const minutes = createdAt.getMinutes();
  return format === 1
    ? `${day} ${month} ${year}`
    : format === 2
    ? `${day} ${month} ${year} เวลา ${hours}:${minutes} นาที`
    : format === 3
    ? `เวลา ${hours}:${minutes} นาที`
    : `ไปเปลี่ยน if format ด่วนจ้า`;
}

// format
// 1 === วัน/เดือน/ปี
// 2 === วัน/เดือน/ปี/ชั่วโมง/นาที
// 3 === ชั่วโมง/นาที
