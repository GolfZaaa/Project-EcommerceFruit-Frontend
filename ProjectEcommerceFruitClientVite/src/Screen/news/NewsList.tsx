import React, { useEffect } from "react";
import { useStore } from "../../store/store";
import { observer } from "mobx-react-lite";
import { NEWS } from "../../models/NEWS";
import dayjs from "dayjs";
import { IoMdTime } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../constants/RoutePath";
import { resetScroll } from "../../api/agent";

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

  return (
    <div>
      <section className="py-16 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-manrope text-4xl font-bold text-gray-900 text-center mb-16">
            ข่าวสารทั้งหมด
          </h2>
          <div className="flex justify-center  gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.length > 0 &&
                news
                  .filter((x) => x.hidden === false)
                  .map((item: NEWS) => {
                    const createdAt = dayjs(item?.createdAt);
                    const timeAgo = createdAt ? createdAt.fromNow() : "N/A";
                    return (
                      <div className="group w-full border border-gray-300 rounded-2xl">
                        <div className="flex items-center">
                          <img
                            src="https://pagedone.io/asset/uploads/1696244317.png"
                            alt="blogs tailwind section"
                            className="rounded-t-2xl w-full object-cover"
                          />
                        </div>
                        <div className="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                          <span className="text-indigo-600 font-medium mb-3 flex items-center">
                            <IoMdTime className="mr-2" /> {timeAgo}
                          </span>
                          <h4 className="text-xl text-gray-900 font-medium leading-8 mb-5">
                            {item.title}

                            {item.title.replace(/<[^>]+>/g, "").length > 20
                              ? item.title
                                  .replace(/<[^>]+>/g, "")
                                  .slice(0, 20) + "..."
                              : item.title.replace(/<[^>]+>/g, "")}
                          </h4>
                          <p className="text-gray-500 leading-6 mb-10">
                            {item.description.replace(/<[^>]+>/g, "").length >
                            180
                              ? item.description
                                  .replace(/<[^>]+>/g, "")
                                  .slice(0, 180) + "..."
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
