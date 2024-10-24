export function formatDateThaiNative(
  date: Date,
  addYear = +543,
  format: number
) {
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
  const year = createdAt.getFullYear() + addYear; // นับปี 543 ในปฏิทินไทย

  const hours = createdAt.getHours();
  const minutes = createdAt.getMinutes();

  return (
    `วันที่ ` +
    (format === 1
      ? `${day} ${month} ${year}`
      : format === 2
      ? `${day} ${month} ${year} เวลา ${hours}:${minutes} นาที`
      : format === 3
      ? `เวลา ${hours}:${minutes} นาที`
      : `ไปเปลี่ยน if format ด่วนจ้า`)
  );
}

// format
// 1 === วัน/เดือน/ปี
// 2 === วัน/เดือน/ปี/ชั่วโมง/นาที
// 3 === ชั่วโมง/นาที
