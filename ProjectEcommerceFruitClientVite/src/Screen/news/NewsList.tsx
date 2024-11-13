import React, { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { observer } from "mobx-react-lite";
import { NEWS } from "../../models/NEWS";
import dayjs from "dayjs";
import { IoMdTime } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../../constants/RoutePath";
import { resetScroll } from "../../api/agent";
import MyContent from "../../component/MyContent";

export default observer(function NewsList() {
  const { getNEWSs, news } = useStore().systemSettingStore;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getNEWSs();
    };
    fetchData();
  }, [getNEWSs]);

  const NavigateNewsDetail = (item: any) => {
    navigate(RoutePath.newsListDetail(item.id));
    resetScroll();
  };

  const NavigateFirstScreen = () => {
    navigate(RoutePath.firstscreen);
    resetScroll();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredAndSortedNews = news
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.hidden
    )
    .sort((a, b) => {
      const dateA: any = dayjs(a.createdAt);
      const dateB: any = dayjs(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  return (
    <div>
      <nav
        className="flex border-b border-slate-300 pb-7 mb-4 p-9"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse ">
          <li
            onClick={NavigateFirstScreen}
            className="inline-flex items-center cursor-pointer"
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
            <div className="flex items-center ">
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
              <a className="ms-1 text-sm font-semibold text-gray-500 md:ms-2 dark:text-gray-600 ">
                <MyContent name={"ข่าวทั้งหมด"} fontSize="small" />
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-600 hiddenPrint">
                <p>
                  {/* <MyContent
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
                      /> */}
                </p>
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <section className="py-16 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-manrope text-4xl font-bold text-gray-900 text-center mb-16">
            ข่าวสารทั้งหมด
          </h2>

          <div className="flex justify-between items-center mb-6 px-4">
            <input
              type="text"
              placeholder="ค้นหาข่าว..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-1/3 border-gray-400"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded px-3 py-2 ml-4"
            >
              <option value="desc">ใหม่ล่าสุด</option>
              <option value="asc">เก่าสุด</option>
            </select>
          </div>

          <div className="flex justify-center  gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.length > 0 &&
                filteredAndSortedNews
                  .filter((x) => x.hidden === false)
                  .map((item: NEWS) => {
                    const createdAt = dayjs(item?.createdAt);
                    const timeAgo = createdAt ? createdAt.fromNow() : "N/A";
                    return (
                      <div className="group w-full border border-gray-300 rounded-2xl">
                        <div className="flex items-center">
                          <img
                            src={pathImages.news + item.imageName}
                            alt="blogs tailwind section"
                            className="rounded-t-2xl w-96 h-64 object-cover"
                          />
                        </div>
                        <div className="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                          <span className="text-indigo-600 font-medium mb-3 flex items-center">
                            <IoMdTime className="mr-2" /> {timeAgo}
                          </span>
                          <h4 className="text-xl text-gray-900 font-medium leading-8 mb-5">
                            {item.title.replace(/<[^>]+>/g, "").length > 55
                              ? item.title
                                  .replace(/<[^>]+>/g, "")
                                  .slice(0, 55) + "..."
                              : item.title.replace(/<[^>]+>/g, "")}
                          </h4>
                          <p className="text-gray-500 leading-6 mb-10">
                            {item.description.replace(/<[^>]+>/g, "").length >
                            120
                              ? item.description
                                  .replace(/<[^>]+>/g, "")
                                  .slice(0, 120) + "..."
                              : item.description.replace(/<[^>]+>/g, "")}
                          </p>
                          <a
                            onClick={() => NavigateNewsDetail(item)}
                            href="javascript:;"
                            className="cursor-pointer text-lg text-indigo-600 font-semibold"
                          >
                            อ่านเพิ่มเติม..
                          </a>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
