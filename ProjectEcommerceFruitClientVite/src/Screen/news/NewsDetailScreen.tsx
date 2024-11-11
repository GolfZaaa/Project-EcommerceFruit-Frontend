import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/store";
import MyContent from "../../component/MyContent";
import { IoMdTime } from "react-icons/io";
import { pathImages } from "../../constants/RoutePath";
import "dayjs/locale/th"; 
import dayjs from "dayjs";

dayjs.locale("th"); 

export default function NewsDetailScreen() {
  const { id } = useParams<{ id: any }>();

  const { getNewsById, newsdetail } = useStore().systemSettingStore;

  const formattedDate = dayjs(newsdetail?.createdAt)
    .locale("th")
    .format("D MMM") + ` ${dayjs(newsdetail?.createdAt).year() + 543} (${dayjs(newsdetail?.createdAt).format("HH:mm น.")})`;

  useEffect(() => {
    const fetchData = async () => {
      await getNewsById(id);
    };
    fetchData();
  }, []);

  console.log("newssss", newsdetail);

  return (
    <div className="p-9 bg-white">
     <nav className="flex border-b border-slate-300 pb-7 mb-4" aria-label="Breadcrumb">
  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
    <li className="inline-flex items-center">
      <a
        href="#"
        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-zinc-700"
      >
        <svg
          className="w-3 h-3 me-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
        </svg>
        <MyContent name={"หน้าหลัก"} fontSize="small" />
      </a>
    </li>
    <li>
      <div className="flex items-center">
        <svg
          className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 9 4-4-4-4"
          />
        </svg>
        <a
          href="#"
          className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-zinc-700"
        >
          <MyContent name={"ข่าวทั้งหมด"} fontSize="small" />
        </a>
      </div>
    </li>
    <li aria-current="page">
      <div className="flex items-center">
        <svg
          className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 9 4-4-4-4"
          />
        </svg>
        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-600">
          <p>
            <MyContent
              name={
                newsdetail?.title
                  ? newsdetail?.title.replace(/<[^>]+>/g, "").length > 60
                    ? newsdetail?.title
                        .replace(/<[^>]+>/g, "")
                        .slice(0, 60) + "..."
                    : newsdetail?.title.replace(/<[^>]+>/g, "")
                  : "ไม่มีข้อมูล"
              }
              fontSize="small"
            />
          </p>
        </span>
      </div>
    </li>
  </ol>
</nav>


      <div className="mt-12">
        <h1 className="text-4xl font-bold mb-4">{newsdetail?.title}</h1>
      </div>

      <div className="text-gray-500 mb-6 ">
        <span className="flex items-center gap-1">
          <IoMdTime size={20} />
          {formattedDate}
          <span className="mx-2">|</span>
          <span>พิมพ์</span>
        </span>
      </div>

      <div className="mb-6">
        <img
          src={pathImages.news + newsdetail?.imageName}
          alt="Lao Lottery"
          className="w-full rounded-lg h-96 object-cover"
        />
      </div>

      <div className="text-2xl" style={{ textIndent: "2em" }}>
        {newsdetail?.description.replace(/<[^>]+>/g, "")}
      </div>
    </div>
  );
}
