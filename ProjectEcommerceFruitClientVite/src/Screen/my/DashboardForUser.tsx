import ReactECharts from "echarts-for-react";

export default function DashboardForUser() {
  const lineChartDataFiltered = [
    { date: "January", price: 120000 },
    { date: "February", price: 150000 },
    { date: "March", price: 170000 },
    { date: "April", price: 140000 },
    { date: "May", price: 200000 },
    { date: "June", price: 190000 },
    { date: "July", price: 210000 },
  ];

  const option = {
    xAxis: {
      type: "category",
      data: lineChartDataFiltered.map((item) => item.date),
      axisLabel: {
        fontSize: 10,
        fontWeight: 600,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value:any) => value.toLocaleString(),
        fontSize: 10,
        fontWeight: 600,
      },
    },
    series: [
      {
        data: lineChartDataFiltered.map((item) => item.price),
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#00910a",
          width: 2,
        },
        itemStyle: {
          color: "#00910a",
          borderColor: "#00910a",
        },
        areaStyle: {
          color: "rgba(0, 145, 10, 0.2)",
        },
        symbolSize: 6,
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: (params:any) => `${params[0].data.toLocaleString()} บาท`,
      textStyle: {
        fontSize: 14,
      },
    },
  };

  const pieChartData = [
    { value: 120, name: "Category A" },
    { value: 150, name: "Category B" },
    { value: 170, name: "Category C" },
    { value: 140, name: "Category D" },
    { value: 200, name: "Category E" },
    { value: 190, name: "Category F" },
    { value: 210, name: "Category G" },
  ];

  const pieOption = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      textStyle: {
        fontSize: 14,
      },
    },
    series: [
      {
        name: "Categories",
        type: "pie",
        radius: "50%",
        data: pieChartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div className="-ml-16 -mt-16">
      <div>
      <div className="mt-2 flex flex-wrap justify-center items-center gap-10">
    <a href="#"
        className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600 transition-colors duration-100 ease-in-out hover:border-gray-400/80">
        <div className="flex flex-row items-center justify-center">
            <svg className="mr-3 fill-gray-500/95" xmlns="http://www.w3.org/2000/svg"
                version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
            </svg>

            <span className="font-bold text-gray-600"> 4.6K </span>
        </div>

        <div className="mt-2 text-sm text-gray-400">ยอดเงินทั้งหมดที่ซื้อ</div>
    </a>

    <a href="#"
        className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80">
        <div className="flex flex-row items-center justify-center">
            <svg className="mr-3 fill-gray-500/95" xmlns="http://www.w3.org/2000/svg"
                version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M2.5 19.6L3.8 20.2V11.2L1.4 17C1 18.1 1.5 19.2 2.5 19.6M15.2 4.8L20.2 16.8L12.9 19.8L7.9 7.9V7.8L15.2 4.8M15.3 2.8C15 2.8 14.8 2.8 14.5 2.9L7.1 6C6.4 6.3 5.9 7 5.9 7.8C5.9 8 5.9 8.3 6 8.6L11 20.5C11.3 21.3 12 21.7 12.8 21.7C13.1 21.7 13.3 21.7 13.6 21.6L21 18.5C22 18.1 22.5 16.9 22.1 15.9L17.1 4C16.8 3.2 16 2.8 15.3 2.8M10.5 9.9C9.9 9.9 9.5 9.5 9.5 8.9S9.9 7.9 10.5 7.9C11.1 7.9 11.5 8.4 11.5 8.9S11.1 9.9 10.5 9.9M5.9 19.8C5.9 20.9 6.8 21.8 7.9 21.8H9.3L5.9 13.5V19.8Z" />
            </svg>

            <span className="font-bold text-gray-600"> 45 </span>
        </div>

        <div className="mt-2 text-sm text-gray-400">ยอดคำสั่งซื้อทั้งหมด</div>
    </a>

    <a href="#"
        className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80">
        <div className="flex flex-row items-center justify-center">
            <svg className="mr-3 fill-gray-500/95" xmlns="http://www.w3.org/2000/svg"
                version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M5.68,19.74C7.16,20.95 9,21.75 11,21.95V19.93C9.54,19.75 8.21,19.17 7.1,18.31M13,19.93V21.95C15,21.75 16.84,20.95 18.32,19.74L16.89,18.31C15.79,19.17 14.46,19.75 13,19.93M18.31,16.9L19.74,18.33C20.95,16.85 21.75,15 21.95,13H19.93C19.75,14.46 19.17,15.79 18.31,16.9M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12M4.07,13H2.05C2.25,15 3.05,16.84 4.26,18.32L5.69,16.89C4.83,15.79 4.25,14.46 4.07,13M5.69,7.1L4.26,5.68C3.05,7.16 2.25,9 2.05,11H4.07C4.25,9.54 4.83,8.21 5.69,7.1M19.93,11H21.95C21.75,9 20.95,7.16 19.74,5.68L18.31,7.1C19.17,8.21 19.75,9.54 19.93,11M18.32,4.26C16.84,3.05 15,2.25 13,2.05V4.07C14.46,4.25 15.79,4.83 16.9,5.69M11,4.07V2.05C9,2.25 7.16,3.05 5.68,4.26L7.1,5.69C8.21,4.83 9.54,4.25 11,4.07Z" />
            </svg>

            <span className="font-bold text-gray-600"> 120K </span>
        </div>

        <div className="mt-2 text-sm text-gray-400">จำนวนสินค้าที่ซื้อ</div>
    </a>

    <a href="#"
        className="flex h-28 w-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-600  transition-colors duration-100 ease-in-out hover:border-gray-400/80">
        <div className="flex flex-row items-center justify-center">
            <svg className="mr-3 fill-gray-500/95" xmlns="http://www.w3.org/2000/svg"
                 version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
            </svg>

            <span className="font-bold text-gray-600"> 4.6K </span>
        </div>

        <div className="mt-2 text-sm text-gray-400">ยอดคำสั่งซื้อที่สำเร็จ</div>
    </a>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-4 gap-4 mt-5">
            <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-2 -mb-8">
                <p className="font-semibold">กราฟแสดงยอดเงินซื้อสินค้า</p>
              </div>
              <div className="p-2">
                <ReactECharts
                  option={option}
                  style={{ height: "300px", width: "100%" }}
                />
              </div>
            </div>
            <div className="col-span-2 bg-white border rounded-sm overflow-hidden shadow">
              <div className="p-2 -mb-3">
                <p className="font-semibold">กราฟแสดงยอดขายของแต่ละผลไม้</p>
              </div>
              <div className="p-2">
                <ReactECharts
                  option={pieOption}
                  style={{ height: "300px", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
