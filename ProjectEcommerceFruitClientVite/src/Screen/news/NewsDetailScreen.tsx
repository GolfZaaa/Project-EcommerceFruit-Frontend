import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/store";
import MyContent from "../../component/MyContent";
import { IoMdTime } from "react-icons/io";
import { pathImages, RoutePath } from "../../constants/RoutePath";
import "dayjs/locale/th";
import dayjs from "dayjs";
import { resetScroll } from "../../api/agent";
import { PiPrinter } from "react-icons/pi";

dayjs.locale("th");

export default function NewsDetailScreen() {
  const { id } = useParams<{ id: any }>();
  const { getNewsById, newsdetail } = useStore().systemSettingStore;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const formattedDate =
    dayjs(newsdetail?.createdAt).locale("th").format("D MMM") +
    ` ${dayjs(newsdetail?.createdAt).year() + 543} (${dayjs(
      newsdetail?.createdAt
    ).format("HH:mm น.")})`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getNewsById(id);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    navigate(RoutePath.firstscreen);
    resetScroll();
  };

  const handleGoNewsList = () => {
    navigate(RoutePath.newsList);
    resetScroll();
  };

  return (
    <div className="p-9 bg-white mb-5">
      {id && newsdetail && (
        <div>
          <nav
            className="flex border-b border-slate-300 pb-7 mb-4 "
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse ">
              <li
                className="inline-flex items-center cursor-pointer"
                onClick={handleGoHome}
              >
                <svg
                  className="w-4 h-4 me-1 hiddenPrint text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>

                <a className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-zinc-700 hiddenPrint">
                  <MyContent name={"หน้าหลัก"} fontSize="small" />
                </a>
              </li>
              <li>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleGoNewsList}
                >
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1 hiddenPrint"
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
                  <a className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-zinc-700 hiddenPrint">
                    <MyContent name={"ข่าวทั้งหมด"} fontSize="small" />
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1 hiddenPrint"
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
                  <span className="ms-1 text-sm font-semibold text-gray-500 md:ms-2 dark:text-gray-600 hiddenPrint">
                    <p>
                      <MyContent
                        name={
                          newsdetail?.title
                            ? newsdetail?.title.replace(/<[^>]+>/g, "").length >
                              60
                              ? newsdetail?.title
                                  .replace(/<[^>]+>/g, "")
                                  .slice(0, 60) + " ... "
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
            <span className="flex items-center gap-1 text-xl">
              <IoMdTime size={20} />
              {formattedDate}
              <span className="mx-2">|</span>
              <span
                onClick={handlePrint}
                className="cursor-pointer flex items-center hover:text-black"
              >
                <PiPrinter size={20} className="mr-1" />
                พิมพ์
              </span>
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
      )}
    </div>
  );
}
