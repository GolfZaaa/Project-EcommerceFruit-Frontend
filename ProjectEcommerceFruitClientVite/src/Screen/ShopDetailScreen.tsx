import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import dayjs from "dayjs";
import { pathImages, RoutePath } from "../constants/RoutePath";
import CircularProgress from "@mui/material/CircularProgress";
import { Product } from "../models/Product";
import { resetScroll } from "../api/agent";
import MyContent from "../component/MyContent";
import { MdAccessTimeFilled } from "react-icons/md";
import { BsFillBarChartLineFill } from "react-icons/bs";
import { Fab, Grid } from "@mui/material";

export default observer(function ShopDetailScreen() {
  const { id: userId } = useParams<{ id: any }>();

  const {
    GetStoreDetailByUserId,
    shopProductDetail,
    GetStoreProductUser,
    shopProductUser,
    loadingShopProducts,
  } = useStore().shopuserStore;

  const { getOrderByStore, order } = useStore().orderStore;

  const shopDetail = shopProductDetail?.[0];

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    GetStoreDetailByUserId(userId);
  }, []);

  useEffect(() => {
    getCategory();
    if (shopDetail) {
      getOrderByStore(shopDetail?.id);
      GetStoreProductUser(
        new URLSearchParams({
          userId: shopDetail?.userId.toString() || "",
        })
      );
    }
  }, [shopDetail]);

  useEffect(() => {
    handleSearch();
  }, [selectedCategory, sortPrice]);

  const totalQuantity = order.reduce((total, currentOrder) => {
    const orderItemsQuantity = currentOrder.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    return total + orderItemsQuantity;
  }, 0);

  const OrderByStore = order.filter((x) => x.status === 1).length;

  const createdAt = dayjs(shopDetail?.createdAt);
  const timeAgo = createdAt ? createdAt.fromNow() : "N/A";

  const onSelectCate = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // getProduct(categoryId);
  };

  const { product, getProduct, category, getCategory } =
    useStore().productStore;

  const categories = [
    {
      id: 0,
      name: "ทั้งหมด",
    },
    ...category,
  ];

  const { user, setLoadingUser, loadingUser } = useStore().userStore;

  const NavigateDetail = (product: any) => {
    navigate(RoutePath.productDetail(product.id));
    resetScroll();
  };

  const navigate = useNavigate();

  const [searchProduct, setSearchProduct] = useState("");

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "lowToHigh") {
      setSortPrice("asc");
    } else if (value === "highToLow") {
      setSortPrice("desc");
    }
  };

  // let filterProduct =
  //   selectedCategory === 0
  //     ? shopProductUser
  //     : shopProductUser.filter(
  //         (x) => x.productGI.category.id === selectedCategory
  //       );

  // if (sortPrice === "asc") {
  //   filterProduct = [...filterProduct].sort((a, b) => a.price - b.price);
  // } else if (sortPrice === "desc") {
  //   filterProduct = [...filterProduct].sort((a, b) => b.price - a.price);
  // }

  // const handleResetSort = async () => {
  //   setLoadingUser(true);
  //   await setSelectedCategory(0);
  //   getProduct(0);
  //   await setSortPrice(null);
  //   setTimeout(() => {
  //     setLoadingUser(false);
  //   }, 700);
  // };

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      userId: shopDetail?.userId.toString() || "",
      productName: searchProduct || "",
      categoryId: selectedCategory.toString(),
      sortPrice: (sortPrice === "asc"
        ? 1
        : sortPrice === "desc"
        ? 2
        : 0
      ).toString(),
    });

    await GetStoreProductUser(queryParams);
  };

  const handleResetSearch = async () => {
    setSearchProduct("");
    setSelectedCategory(0);
    setSortPrice(null);
    await GetStoreProductUser(
      new URLSearchParams({
        userId: shopDetail?.userId.toString() || "",
      })
    );
  };

  return (
    <div>
      <div className="bg-white p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <img
              src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
              alt="Store Logo"
              className="w-16 h-16 object-cover rounded-full"
            />
            <div>
              <h1 className="FontPublic text-xl font-semibold mb-6">
                <MyContent name={shopDetail?.name} fontSize="larger" />
              </h1>
              <div className="flex FontPublic text-gray-500 font-semibold">
                <span className="mr-1">
                  <MyContent name="สร้างโดย : " fontSize="normal" />
                </span>
                <span>
                  <MyContent
                    name={shopDetail?.user.fullName}
                    fontSize="normal"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-center text-gray-600 lg:pr-9">
            <div className="flex flex-wrap justify-center space-x-4 lg:space-x-8">
              <div className="flex flex-col items-center FontPublic">
                <div className="flex">
                  <span className="text-red-500  font-bold mr-1">
                    <MyContent
                      name={shopProductUser.length}
                      fontSize="littlenormal"
                    />
                  </span>
                  <span className="text-red-500  font-bold">
                    <MyContent name="รายการ" fontSize="littlenormal" />
                  </span>
                </div>
                <p>
                  <MyContent
                    name="รายการสินค้าทั้งหมด"
                    fontSize="littlenormal"
                  />
                </p>
              </div>

              <div className="flex flex-col items-center FontPublic">
                <div className="flex">
                  <span className="text-red-500  font-bold mr-1">
                    <MyContent
                      name={totalQuantity.toLocaleString()}
                      fontSize="littlenormal"
                    />
                  </span>
                  <span className="text-red-500  font-bold">
                    <MyContent name="ชิ้น" fontSize="littlenormal" />
                  </span>
                </div>
                <p>
                  <MyContent
                    name="จำนวนสินค้าที่ขายแล้ว"
                    fontSize="littlenormal"
                  />
                </p>
              </div>

              <div className="flex flex-col items-center FontPublic">
                <div className="flex">
                  <span className="text-red-500  font-bold mr-1">
                    <MyContent name={OrderByStore} fontSize="littlenormal" />
                  </span>
                  <span className="text-red-500  font-bold">
                    <MyContent name="รายการ" fontSize="littlenormal" />
                  </span>
                </div>
                <p>
                  <MyContent name="ยอดสั่งซื้อรวม" fontSize="littlenormal" />
                </p>
              </div>

              <div className="flex flex-col items-center FontPublic">
                <div className="flex">
                  <span className="text-red-500  font-bold mr-1">
                    <MyContent name={timeAgo} fontSize="littlenormal" />
                  </span>
                </div>
                <p>
                  <MyContent name="เข้าร่วมเมื่อ" fontSize="littlenormal" />
                </p>
              </div>
            </div>

            {shopProductDetail
              ?.filter((store: any) =>
                store.user.address.some((address: any) => address.isUsed_Store)
              )
              .map((store: any, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-center space-x-4 lg:space-x-8"
                >
                  {store.user.address
                    .filter((address: any) => address.isUsed_Store)
                    .map((address: any, i: any) => (
                      <div
                        className="FontPublic flex flex-col items-center lg:flex-row lg:space-x-4"
                        key={i}
                      >
                        <div className="mr-5">
                          <span className="text-red-500 text-xl font-bold">
                            <MyContent
                              name={address.detail}
                              fontSize="littlenormal"
                            />
                          </span>
                          <p>
                            <MyContent
                              name="บ้านเลขที่"
                              fontSize="littlenormal"
                            />
                          </p>
                        </div>

                        <div className="mr-5">
                          <span className="text-red-500 text-xl font-bold">
                            <MyContent
                              name={address.subDistrict}
                              fontSize="littlenormal"
                            />
                          </span>
                          <p>
                            <MyContent name="ตำบล" fontSize="littlenormal" />
                          </p>
                        </div>
                        <div className="mr-5">
                          <span className="text-red-500 text-xl font-bold">
                            <MyContent
                              name={address.district}
                              fontSize="littlenormal"
                            />
                          </span>
                          <p>
                            <MyContent name="อำเภอ" fontSize="littlenormal" />
                          </p>
                        </div>
                        <div>
                          <span className="text-red-500 text-xl font-bold">
                            <MyContent
                              name={address.province}
                              fontSize="littlenormal"
                            />
                          </span>
                          <p>
                            <MyContent name="จังหวัด" fontSize="littlenormal" />
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* <div className="px-4 md:px-14 mt-10">
        <div className="bg-white p-4 shadow-md rounded-md border">
          <h2 className="text-lg font-semibold mb-4">กรองข้อมูลสินค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-gray-700">
                ประเภทผลไม้
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCate(Number(e.target.value))}
                className="block w-full md:w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                {categories.map((item, i: number) => (
                  <option key={i} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <label className="text-sm font-medium text-gray-700">
                ช่วงราคาสินค้า
              </label>
              <select
                value={sortPrice || ""}
                onChange={onSortChange}
                className="block w-full md:w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                <option value="" hidden>
                  {sortPrice === "asc"
                    ? "ราคา: จากน้อยไปมาก"
                    : sortPrice === "desc"
                    ? "ราคา: จากมากไปน้อย"
                    : "ราคา"}
                </option>
                <option value="lowToHigh">ราคา: จากน้อยไปมาก</option>
                <option value="highToLow">ราคา: จากมากไปน้อย</option>
              </select>
            </div>

            <div className="flex items-center justify-start lg:justify-end">
              <button
                onClick={handleResetSort}
                className="w-full md:w-52 text-base rounded-md bg-green-600 py-2 px-4 border border-transparent text-white transition-all shadow-md hover:shadow-lg active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                disabled={loadingUser}
              >
                {loadingUser ? (
                  <div>
                    <CircularProgress size={17} color="inherit" />
                  </div>
                ) : (
                  <div>
                    <p>รีเซ็ตกรองข้อมูลสินค้า</p>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="pl-14 pr-14 mt-10">
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{
            marginBottom: 30,
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
                className="block h-14 pr-16 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none bg-white"
                placeholder="ค้นหาสินค้า"
                style={{
                  width: "100%",
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
                }}
                sx={{
                  width: "100%",
                  height: 50,
                  boxShadow: 3,
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  transition: "all 0.3s ease-in-out",
                  zIndex: 1,
                }}
                disabled={loadingShopProducts}
              >
                {loadingShopProducts ? (
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
                value={sortPrice || ""}
                onChange={onSortChange}
                className="block w-full md:w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                <option value="" hidden>
                  {sortPrice === "asc"
                    ? "ราคา: จากน้อยไปมาก"
                    : sortPrice === "desc"
                    ? "ราคา: จากมากไปน้อย"
                    : "ราคา"}
                </option>
                <option value="lowToHigh">ราคา: จากน้อยไปมาก</option>
                <option value="highToLow">ราคา: จากมากไปน้อย</option>
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
                disabled={loadingUser}
              >
                {loadingUser ? (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pl-16 pr-16 mt-10 mb-10">
        {shopProductUser.map((product: Product, i: number) => {
          const userid = user?.id;
          const timePassed = dayjs(product.createdAt).locale("th").fromNow();
          return (
            <div
              key={i}
              onClick={() => NavigateDetail(product)}
              className="rounded overflow-hidden shadow-lg flex flex-col cursor-pointer"
            >
              <div className="relative">
                <img
                  className="w-full h-72 "
                  src={pathImages.product + product.images}
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

                {userid == product?.productGI?.store?.userId && (
                  <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                    <p className="FontPublic">
                      <MyContent name="สินค้าของคุณ" fontSize="small" />
                    </p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 mb-auto">
                <div className="font-medium text-lg hover:text-indigo-600 transition duration-500 ease-in-out flex justify-between mb-2">
                  <span className="FontPublic">{product.productGI.name}</span>
                  <span className="FontPublic">{product.price} บาท</span>
                </div>
              </div>
              <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                  <MdAccessTimeFilled size={20} />
                  <span className="ml-1 FontPublic">
                    {" "}
                    <MyContent name={timePassed} fontSize="small" />
                  </span>
                </span>

                <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                  <BsFillBarChartLineFill size={20} />
                  <span className="ml-1 flex FontPublic">
                    <MyContent name={product.sold} fontSize="small" />
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
    </div>
  );
});
