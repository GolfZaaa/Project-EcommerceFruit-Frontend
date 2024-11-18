import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import Loading from "../layout/component/LoadingComponent";
import CircularProgress from "@mui/material/CircularProgress";
import { BsFillBarChartLineFill } from "react-icons/bs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import { resetScroll } from "../api/agent";
import MyLottie from "../helper/components/MyLottie";
import { MdAccessTimeFilled, MdInventory, MdStore } from "react-icons/md";
dayjs.extend(relativeTime);

import lottiteEmpty from "../assets/lotties/lf20_qh5z2fdq.json";
import MyContent from "../component/MyContent";

export default observer(function HomeScreen() {
  const navigate = useNavigate();

  const { product, getProduct, category, getCategory } =
    useStore().productStore;

  const { user, setLoadingUser, loadingUser } = useStore().userStore;

  const { GetStoreProductUser, shopProductUser } = useStore().shopuserStore;

  useEffect(() => {
    getProduct(0);
    getCategory();
    if (user?.id !== undefined) {
      GetStoreProductUser(user?.id);
    }
  }, [getProduct, getCategory]);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortPrice, setSortPrice] = useState("");

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];

  const onSelectCate = (categoryId: number) => {
    setSelectedCategory(categoryId);
    getProduct(categoryId);
  };

  const onSortChange = (e: any) => {
    setSortPrice(e.target.value);
  };

  const NavigateDetail = (product: any) => {
    navigate(RoutePath.productDetail(product.id));
    resetScroll();
  };

  if (!Array.isArray(product) || !Array.isArray(category)) {
    return <Loading />;
  }

  const [taps, setTaps] = useState("taps1");

  const handletaps1 = () => {
    setTaps("taps1");
  };

  const handletaps2 = () => {
    GetStoreProductUser(user?.id);
    setTaps("taps2");
  };

  const handleMyShop = () => {
    GetStoreProductUser(user?.id);
  };

  const filteredProducts = product
    .filter(
      (x) =>
        x.status === true &&
        x.quantity > 0 &&
        (selectedCategory === 0 || x.productGI.category.id === selectedCategory)
    )
    .sort((a, b) => {
      if (sortPrice) {
        if (sortPrice === "lowToHigh") {
          return a.price - b.price;
        } else if (sortPrice === "highToLow") {
          return b.price - a.price;
        }
      }
      return 0;
    });

    const filterMyProductStore = (shopProductUser || [])
    .filter(x=> (selectedCategory === 0 || x.productGI.category.id === selectedCategory))
    .slice()
    .sort((a, b) => {
      if (sortPrice) {
        if (sortPrice === "lowToHigh") {
          return a.price - b.price;
        } else if (sortPrice === "highToLow") {
          return b.price - a.price;
        }
      }
      return 0;
    });
  


  const handleResetSort = async () => {
    setLoadingUser(true);
    await setSelectedCategory(0);
    getProduct(0);
    await setSortPrice("");
    setTimeout(() => {
      setLoadingUser(false);
    }, 700);
  };

  return (
    <>
      <>
        <div className="bg-white">
          <div style={{ position: "relative", height: "16rem", width: "100%" }}>
            <img
              src="https://friutt06.wordpress.com/wp-content/uploads/2017/08/e0b895e0b8a5e0b8b2e0b894e0b89ce0b8a5e0b984e0b8a1e0b989-e0b888-e0b888e0b8b1e0b899e0b897e0b89ae0b8b8e0b8a3e0b8b5.jpg?w=1200"
              alt=""
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                textAlign: "center",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            >
              สินค้า
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between p-16  pt-20 -mb-20"></div>

            <div className="pl-14 pr-14">
              <div className="bg-white p-4 shadow-md rounded-md -mb-6 border ">
                <h2 className="text-lg font-semibold mb-4">
                  {" "}
                  <MyContent name={"กรองข้อมูลสินค้า"} fontSize="normal" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700 ">
                      <MyContent name={"ประเภทผลไม้"} fontSize="small" />
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => onSelectCate(Number(e.target.value))}
                      className="block w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
                    >
                      {categories.map((item, i: number) => (
                        <option key={i} value={item.id}>
                          {/* {item.name} */}
                          <MyContent name={item.name} fontSize="small" />
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                      {/* ช่วงราคาสินค้า */}
                      <MyContent name={"ช่วงราคาสินค้า"} fontSize="small" />
                    </label>
                    <select
                      value={sortPrice}
                      onChange={onSortChange}
                      className="block w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
                    >
                      <option value="" hidden>
                        <MyContent name={"ราคา"} fontSize="small" />
                        {/* ราคา */}
                      </option>

                      <option value="lowToHigh">
                        <MyContent
                          name={"ราคา: จากน้อยไปมาก"}
                          fontSize="small"
                        />
                      </option>
                      <option value="highToLow">
                        <MyContent
                          name={"ราคา: จากมากไปน้อย"}
                          fontSize="small"
                        />
                      </option>

                      {/* <option value="lowToHigh">ราคา: จากน้อยไปมาก</option>
                      <option value="highToLow">ราคา: จากมากไปน้อย</option> */}
                    </select>
                  </div>

                  <div className="flex items-center space-x-4  sm:w-full md:ml-11 md:w-36 lg:w-60">
                    {/* <div className="flex items-center space-x-4 ml-11 sm:w-full sm:ml-11"> */}
                    <button
                      onClick={handleResetSort}
                      className="text-base rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-white transition-all shadow-md hover:shadow-lg active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:opacity-50 disabled:shadow-none ml-2"
                      style={{
                        width: "100%",
                      }}
                      type="button"
                      disabled={loadingUser}
                    >
                      {loadingUser ? (
                        <div>
                          <CircularProgress size={17} color="inherit" />
                        </div>
                      ) : (
                        <div>
                          {/* <p></p> */}
                          <MyContent
                            name={"รีเซ็ตกรองข้อมูลสินค้า"}
                            fontSize="small"
                          />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="bg-white pl-10 pr-10">
              <div>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                  <div className="flex items-baseline justify-between pb-6 pt-24">
                    <div className="flex items-center">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                          id="menu-button"
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          Sort
                          <svg
                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        <div
                          className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="menu-button"
                          tabIndex={-1}
                        >
                          <div className="py-1" role="none">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm font-medium text-gray-900"
                              role="menuitem"
                              tabIndex={-1}
                              id="menu-item-0"
                            >
                              Most Popular
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-500"
                              role="menuitem"
                              tabIndex={-1}
                              id="menu-item-1"
                            >
                              Best Rating
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-500"
                              role="menuitem"
                              tabIndex={-1}
                              id="menu-item-2"
                            >
                              Newest
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-500"
                              role="menuitem"
                              tabIndex={-1}
                              id="menu-item-3"
                            >
                              Price: Low to High
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-500"
                              role="menuitem"
                              tabIndex={-1}
                              id="menu-item-4"
                            >
                              Price: High to Low
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        ประเภทสินค้า
                        <svg
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        ช่วงราคา
                        <svg
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </main>
              </div>
            </div> */}

            <section aria-labelledby="products-heading" className="">
              <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 ">
                <div className="border-b mb-5 flex justify-between text-sm">
                  <div
                    onClick={handletaps1}
                    className={`flex items-center pb-2 pr-2 border-b-2 uppercase cursor-pointer ${
                      taps === "taps1"
                        ? "text-indigo-600 border-indigo-600"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    <MdInventory className="h-6 w-6 mr-3" />
                    <div className="font-semibold inline-block">
                      <MyContent name={"รายการผลไม้ทั้งหมด"} fontSize="small" />
                    </div>
                  </div>

                  {user?.stores?.[0]?.name && (
                    <div
                      onClick={handletaps2}
                      className={`flex items-center pb-2 pr-2 border-b-2 uppercase cursor-pointer ${
                        taps === "taps2"
                          ? "text-indigo-600 border-indigo-600"
                          : "text-gray-500 border-transparent"
                      }`}
                    >
                       <MdStore className="h-6 w-6 mr-3" /> 
                      <div
                        onClick={handleMyShop}
                        className="font-semibold inline-block"
                      >
                        <MyContent name={"สินค้าของฉัน"} fontSize="small" />
                      </div>
                    </div>
                  )}
                </div>

                {taps === "taps1" && (
                  <>
                    {filteredProducts.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {filteredProducts
                          .map((product, i: number) => {
                            const userid = user?.id;
                            const timePassed = dayjs(product.createdAt)
                              .locale("th")
                              .fromNow();

                            return (
                              <div
                                key={i}
                                onClick={() => NavigateDetail(product)}
                                className="rounded overflow-hidden shadow-lg flex flex-col cursor-pointer"
                              >
                                <div className="relative">
                                  <img
                                    className="w-full h-72 object-cover"
                                    src={pathImages.product + product.images}
                                    alt="Sunset in the mountains"
                                  />
                                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                                  <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                                    <MyContent
                                      name={product.productGI.category.name}
                                      fontSize="smaller"
                                    />
                                  </div>

                                  {userid ==
                                    product?.productGI?.store?.user?.id && (
                                    <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                                      <MyContent
                                        name="สินค้าของคุณ"
                                        fontSize="small"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="px-6 py-4 mb-auto">
                                  <div className="font-medium text-lg hover:text-indigo-600 transition duration-500 ease-in-out flex justify-between mb-2">
                                    <span>{product.productGI.name}</span>

                                    <span>{product.price} บาท</span>
                                  </div>
                                </div>
                                <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                                  <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                    <MdAccessTimeFilled size={20} />
                                    <span className="ml-1">
                                      {" "}
                                      <MyContent
                                        name={timePassed}
                                        fontSize="small"
                                      />
                                    </span>
                                  </span>

                                  <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                    <BsFillBarChartLineFill size={20} />
                                    <span className="ml-1 flex">
                                      <MyContent
                                        name={product.sold}
                                        fontSize="small"
                                      />
                                      <p style={{ paddingLeft: 5 }}>
                                        <MyContent
                                          name={"ยอดขาย"}
                                          fontSize="small"
                                        />
                                      </p>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MyLottie lottieFile={lottiteEmpty} />
                      </div>
                    )}
                  </>
                )}

                {taps === "taps2" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {filterMyProductStore.map((myProduct, i: number) => {
                      const category = myProduct.productGI.category;
                      const userid = user?.id;
                      const timePassed = dayjs(myProduct.createdAt)
                        .locale("th")
                        .fromNow();

                      return (
                        <div
                          key={i}
                          onClick={() => NavigateDetail(myProduct)}
                          className={`relative rounded overflow-hidden shadow-lg flex flex-col cursor-pointer ${
                            myProduct.status == false ? "opacity-70" : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              className="w-full h-72 object-cover"
                              src={pathImages.product + myProduct.images}
                              alt="Sunset in the mountains"
                            />
                            <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                            <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                              {/* {category.name} */}
                              <MyContent
                                name={category.name}
                                fontSize="smaller"
                              />
                            </div>

                            {userid == myProduct?.productGI?.store?.userId && (
                              <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                                <MyContent
                                  name={"สินค้าของคุณ"}
                                  fontSize="small"
                                />
                              </div>
                            )}

                            {myProduct.hidden === false && myProduct.status === false &&
                              myProduct.quantity > 0 && (
                                <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col justify-center items-center text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                    />
                                  </svg>
                                  <span className="font-bold text-lg">
                                    สินค้านี้ปิดการขาย
                                  </span>
                                  <span className="text-sm mt-1">
                                    ท่านสามารถเปลี่ยนสถานะของสินค้าได้
                                  </span>
                                </div>
                              )}

                            {myProduct.quantity === 0 &&
                              myProduct.hidden == false && (
                                <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex flex-col justify-center items-center text-white">
                                  <svg
                                    viewBox="0 0 512 512"
                                    fill="red"
                                    height="4em"
                                    width="4em"
                                  >
                                    <path
                                      fill="none"
                                      stroke="red"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={32}
                                      d="M85.57 446.25h340.86a32 32 0 0028.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0028.17 47.17z"
                                    />
                                    <path
                                      fill="none"
                                      stroke="red"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={32}
                                      d="M250.26 195.39l5.74 122 5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 5.95z"
                                    />
                                    <path
                                      fill="red"
                                      d="M256 397.25a20 20 0 1120-20 20 20 0 01-20 20z"
                                    />
                                  </svg>

                                  <span className="font-bold text-lg mt-2">
                                    สินค้าชนิดนี้หมดจากคลังสินค้าแล้ว
                                  </span>
                                  <span className="text-sm mt-1">
                                    โปรดทำการเพิ่มสินค้าลงคลังสินค้า
                                  </span>
                                </div>
                              )}
                          </div>
                          <div className="px-6 py-4 mb-auto">
                            <div className="font-medium text-lg hover:text-indigo-600 transition duration-500 ease-in-out flex justify-between mb-2">
                              <span>{myProduct.productGI.name}</span>

                              <span>{myProduct.price} บาท</span>
                            </div>

                            {/* <p className="text-gray-500 text-sm">
                              {myProduct.detail.replace(/<\/?[^>]+(>|$)/g, "")}
                            </p> */}
                          </div>
                          <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                            <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                              <MdAccessTimeFilled size={20} />
                              <span className="ml-1">
                                <MyContent name={timePassed} fontSize="small" />
                              </span>
                            </span>

                            <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                              <BsFillBarChartLineFill size={20} />

                              {/* <span className="ml-1">
                                {myProduct.sold} ยอดขาย
                              </span> */}
                              <span className="ml-1 flex">
                                <MyContent
                                  name={myProduct.sold}
                                  fontSize="small"
                                />
                                <p style={{ paddingLeft: 5 }}>
                                  <MyContent name={"ยอดขาย"} fontSize="small" />
                                </p>
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </>
    </>
  );
});
