import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageLocal, pathImages, RoutePath } from "../constants/RoutePath";
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
import { FaRegWindowClose } from "react-icons/fa";
import { Fab, Grid } from "@mui/material";

export default observer(function HomeScreen() {
  const navigate = useNavigate();

  const {
    product,
    // getProduct,
    category,
    getCategory,
    getFilterProduct,
    loadingP,
    loadingReset,
    resetFilterProduct,
  } = useStore().productStore;

  const { user, setLoadingUser, loadingUser } = useStore().userStore;

  const { GetStoreProductUser, shopProductUser } = useStore().shopuserStore;

  useEffect(() => {
    // getProduct(0);
    getCategory();
    if (user?.id !== undefined) {
      handleSearchMyShop();
    }
    // }, [getProduct, getCategory]);
  }, [getCategory]);

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortPrice, setSortPrice] = useState("");

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];

  useEffect(() => {
    handleSearch();
  }, [selectedCategory, sortPrice]);

  useEffect(() => {
    handleSearchMyShop();
  }, [selectedCategory, sortPrice]);

  const onSelectCate = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // getProduct(categoryId);
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
    handleSearchMyShop();
    setTaps("taps2");
  };

  const handleMyShop = () => {
    handleSearchMyShop();
  };

  // const filteredProducts = product
  //   .filter(
  //     (x) =>
  //       x.status === true &&
  //       x.quantity > 0 &&
  //       (selectedCategory === 0 || x.productGI.category.id === selectedCategory)
  //   )
  //   .sort((a, b) => {
  //     if (sortPrice) {
  //       if (sortPrice === "lowToHigh") {
  //         return a.price - b.price;
  //       } else if (sortPrice === "highToLow") {
  //         return b.price - a.price;
  //       }
  //     }
  //     return 0;
  //   });

  // const filterMyProductStore = (shopProductUser || [])
  //   .filter(
  //     (x) =>
  //       selectedCategory === 0 || x.productGI.category.id === selectedCategory
  //   )
  //   .slice()
  //   .sort((a, b) => {
  //     if (sortPrice) {
  //       if (sortPrice === "lowToHigh") {
  //         return a.price - b.price;
  //       } else if (sortPrice === "highToLow") {
  //         return b.price - a.price;
  //       }
  //     }
  //     return 0;
  //   });

  // const handleResetSort = async () => {
  //   setLoadingUser(true);
  //   await setSelectedCategory(0);
  //   getProduct(0);
  //   await setSortPrice("");
  //   setTimeout(() => {
  //     setLoadingUser(false);
  //   }, 700);
  // };

  const [searchProduct, setSearchProduct] = useState("");

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      productName: searchProduct || "",
      categoryId: selectedCategory.toString(),
      sortPrice: (sortPrice === "lowToHigh"
        ? 1
        : sortPrice === "highToLow"
        ? 2
        : 0
      ).toString(),
    });

    await getFilterProduct(queryParams);
  };

  const handleSearchMyShop = async () => {
    const queryParams = new URLSearchParams({
      userId: user?.id.toString() || "",
      productName: searchProduct || "",
      categoryId: selectedCategory.toString(),
      sortPrice: (sortPrice === "lowToHigh"
        ? 1
        : sortPrice === "highToLow"
        ? 2
        : 0
      ).toString(),
    });

    await GetStoreProductUser(queryParams);
  };

  const handleResetSearch = async () => {
    setSearchProduct("");
    setSelectedCategory(0);
    setSortPrice("");
    await resetFilterProduct(new URLSearchParams());
    await GetStoreProductUser(
      new URLSearchParams({
        userId: user?.id.toString() || "",
      })
    );
  };

  return (
    <>
      <div className="bg-white">
        <div style={{ position: "relative", height: "16rem", width: "100%" }}>
          <img
            src="https://friutt06.wordpress.com/wp-content/uploads/2017/08/e0b895e0b8a5e0b8b2e0b894e0b89ce0b8a5e0b984e0b8a1e0b989-e0b888-e0b888e0b8b1e0b899e0b897e0b89ae0b8b8e0b8a3e0b8b5.jpg?w=1200"
            alt=""
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              opacity: 0.8,
              filter: "brightness(60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
              fontSize: "6rem",
              fontWeight: "bold",
              textShadow:
                "2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 15px #2bf411, 0 0 30px #03b246",
              letterSpacing: "0.2rem",
              lineHeight: "1.2",
            }}
          >
            <p className="FontPublic">สินค้า</p>
            {/* <MyContent name={"สินค้า"} fontSize="larger" /> */}
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* <div className="flex items-baseline justify-between p-16  pt-20 -mb-20"></div> */}
          <Grid
            container
            spacing={2}
            alignItems="center"
            style={{
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Grid item xs={10}>
              <div className="relative">
                <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                      stroke="#9CA3AF"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <path
                      d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                      stroke="black"
                      stroke-opacity="0.2"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="default-search"
                  className="block h-14 pr-16 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 placeholder-gray-400 focus:outline-none bg-white"
                  placeholder="ค้นหาสินค้า"
                  style={{
                    width: "101%",
                    borderRadius: "50px 0 0 50px",
                  }}
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
              </div>
            </Grid>
            <Grid item xs={2}>
              <div>
                <Fab
                  variant="extended"
                  color="primary"
                  onClick={() => {
                    handleSearch();
                    handleSearchMyShop();
                  }}
                  sx={{
                    width: "100%",
                    borderRadius: "0 50px 50px 0",
                    height: 56,
                    boxShadow: 3,
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    transition: "all 0.3s ease-in-out",
                    zIndex: 1,
                  }}
                  disabled={loadingP}
                >
                  {loadingP ? (
                    <div
                      style={{
                        position: "relative",
                        top: 3,
                      }}
                    >
                      <CircularProgress size={19} color="inherit" />
                    </div>
                  ) : (
                    <div>
                      <p className="FontPublic">
                        <MyContent name="ค้นหา" fontSize="littlenormal" />
                      </p>
                    </div>
                  )}
                </Fab>
              </div>
            </Grid>
          </Grid>

          <div className="pl-14 pr-14">
            <div className="bg-white p-4 shadow-md rounded-md -mb-6 border ">
              <h2 className="text-lg font-semibold mb-4 FontPublic">
                <MyContent name={"กรองข้อมูลสินค้า"} fontSize="normal" />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 FontPublic">
                    <MyContent name={"ประเภทผลไม้"} fontSize="small" />
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onSelectCate(Number(e.target.value))}
                    className="block w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
                  >
                    {categories.map((item, i: number) => (
                      <option key={i} value={item.id} className="FontPublic">
                        {/* {item.name} */}
                        <MyContent name={item.name} fontSize="small" />
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="FontPublic text-sm font-medium text-gray-700">
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

                    <option value="lowToHigh" className="FontPublic">
                      <MyContent name={"ราคา: จากน้อยไปมาก"} fontSize="small" />
                    </option>
                    <option value="highToLow" className="FontPublic">
                      <MyContent name={"ราคา: จากมากไปน้อย"} fontSize="small" />
                    </option>
                  </select>
                </div>

                <div className="flex items-center space-x-4  sm:w-full md:ml-11 md:w-36 lg:w-60">
                  <button
                    onClick={handleResetSearch}
                    className="text-base rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-white transition-all shadow-md hover:shadow-lg active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:opacity-50 disabled:shadow-none ml-2"
                    style={{
                      width: "100%",
                    }}
                    type="button"
                    disabled={loadingReset}
                  >
                    {loadingReset ? (
                      <div>
                        <CircularProgress size={17} color="inherit" />
                      </div>
                    ) : (
                      <div>
                        <p className="FontPublic">
                          <MyContent
                            name={"รีเซ็ตกรองข้อมูลสินค้า"}
                            fontSize="small"
                          />
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                    <p className="FontPublic">
                      <MyContent name={"รายการผลไม้ทั้งหมด"} fontSize="small" />
                    </p>
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
                      <p className="FontPublic">
                        <MyContent name={"สินค้าของฉัน"} fontSize="small" />
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {taps === "taps1" && (
                <>
                  {product.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                      {product.map((product, i: number) => {
                        const userid = user?.id;
                        const timePassed = dayjs(product.createdAt)
                          .locale("th")
                          .fromNow();

                        console.log("product.images", product.images);

                        return (
                          <div
                            key={i}
                            onClick={() => NavigateDetail(product)}
                            className="rounded overflow-hidden shadow-lg flex flex-col cursor-pointer"
                          >
                            <div className="relative">
                              <img
                                className="w-full h-72 object-cover"
                                src={
                                  product.images
                                    ? pathImages.product + product.images
                                    : imageLocal.noPicture
                                }
                                alt="Sunset in the mountains"
                              />
                              <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                              <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                                <p className="FontPublic">
                                  <MyContent
                                    name={product.productGI.category.name}
                                    fontSize="smaller"
                                  />
                                </p>
                              </div>

                              {userid ==
                                product?.productGI?.store?.user?.id && (
                                <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                                  <p className="FontPublic">
                                    <MyContent
                                      name="สินค้าของคุณ"
                                      fontSize="small"
                                    />
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="px-6 py-4 mb-auto">
                              <div className="font-medium text-lg hover:text-indigo-600 transition duration-500 ease-in-out flex justify-between mb-2">
                                <span className="FontPublic">
                                  {product.productGI.name}
                                </span>
                                <span className="FontPublic">
                                  {product.price} บาท
                                </span>
                              </div>
                            </div>
                            <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                              <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <MdAccessTimeFilled size={20} />
                                <span className="ml-1 FontPublic">
                                  {" "}
                                  <MyContent
                                    name={timePassed}
                                    fontSize="small"
                                  />
                                </span>
                              </span>

                              <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <BsFillBarChartLineFill size={20} />
                                <span className="ml-1 flex FontPublic">
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
                  {shopProductUser.map((myProduct, i: number) => {
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
                            <p className="FontPublic">
                              <MyContent
                                name={category.name}
                                fontSize="smaller"
                              />
                            </p>
                          </div>

                          {userid == myProduct?.productGI?.store?.userId && (
                            <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                              <p className="FontPublic">
                                <MyContent
                                  name={"สินค้าของคุณ"}
                                  fontSize="small"
                                />
                              </p>
                            </div>
                          )}

                          {myProduct.hidden === false &&
                            myProduct.status === false &&
                            myProduct.quantity > 0 && (
                              <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col justify-center items-center text-white">
                                <FaRegWindowClose
                                  size={50}
                                  className="mb-3"
                                  style={{ color: "#d70000" }}
                                />
                                <span className="font-bold text-lg FontPublic">
                                  สินค้านี้ปิดการขาย
                                </span>
                                <span className="text-sm mt-1 FontPublic">
                                  ท่านสามารถเปลี่ยนสถานะเป็นเปิดการขายได้
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

                                <span className="font-bold text-lg mt-2 FontPublic">
                                  สินค้าชนิดนี้หมดจากคลังสินค้า
                                </span>
                                <span className="text-sm mt-1 FontPublic">
                                  โปรดทำการเพิ่มสินค้าลงคลังสินค้า
                                </span>
                              </div>
                            )}
                        </div>
                        <div className="px-6 py-4 mb-auto">
                          <div className="font-medium text-lg hover:text-indigo-600 transition duration-500 ease-in-out flex justify-between mb-2">
                            <span className="FontPublic">
                              {myProduct.productGI.name}
                            </span>

                            <span className="FontPublic">
                              {myProduct.price} บาท
                            </span>
                          </div>

                          {/* <p className="text-gray-500 text-sm">
                              {myProduct.detail.replace(/<\/?[^>]+(>|$)/g, "")}
                            </p> */}
                        </div>
                        <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                          <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                            <MdAccessTimeFilled size={20} />
                            <span className="ml-1 FontPublic">
                              <MyContent name={timePassed} fontSize="small" />
                            </span>
                          </span>

                          <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                            <BsFillBarChartLineFill size={20} />
                            <span className="ml-1 flex FontPublic">
                              <MyContent
                                name={myProduct.sold}
                                fontSize="small"
                              />
                              <p
                                className="FontPublic"
                                style={{ paddingLeft: 5 }}
                              >
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
  );
});
