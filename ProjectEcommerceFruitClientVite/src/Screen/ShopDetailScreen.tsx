import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/store";
import dayjs from "dayjs";
import { pathImages, RoutePath } from "../constants/RoutePath";
import CircularProgress from "@mui/material/CircularProgress";
import { Product } from "../models/Product";

export default observer(function ShopDetailScreen() {
  const { id: userId } = useParams<{ id: any }>();

  const {
    GetStoreDetailByUserId,
    shopProductDetail,
    GetStoreProductUser,
    shopProductUser,
  } = useStore().shopuserStore;

  const { getOrderByStore, order } = useStore().orderStore;

  const shopDetail = shopProductDetail?.[0];

  useEffect(() => {
    GetStoreDetailByUserId(userId);
  }, []);

  useEffect(() => {
    getCategory();
    if (shopDetail) {
      getOrderByStore(shopDetail?.id);
      GetStoreProductUser(shopDetail?.userId);
    }
  }, [shopDetail]);

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

  const [selectedCategory, setSelectedCategory] = useState(0);

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
  };

  const navigate = useNavigate();

  //   let filterProduct = selectedCategory === 0
  //   ? shopProductUser
  //   : shopProductUser.filter(
  //       (x) => x.productGI.category.id === selectedCategory
  //     );

  //     const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);

  // // Sort products by price based on sortPrice state
  // if (sortPrice === "asc") {
  //   filterProduct = [...filterProduct].sort((a, b) => a.price - b.price);
  // } else if (sortPrice === "desc") {
  //   filterProduct = [...filterProduct].sort((a, b) => b.price - a.price);
  // }

  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "lowToHigh") {
      setSortPrice("asc");
    } else if (value === "highToLow") {
      setSortPrice("desc");
    }
  };

  let filterProduct =
    selectedCategory === 0
      ? shopProductUser
      : shopProductUser.filter(
          (x) => x.productGI.category.id === selectedCategory
        );

  // Sort products by price based on sortPrice state
  if (sortPrice === "asc") {
    filterProduct = [...filterProduct].sort((a, b) => a.price - b.price);
  } else if (sortPrice === "desc") {
    filterProduct = [...filterProduct].sort((a, b) => b.price - a.price);
  }

  console.log("categories", categories);

  const handleResetSort = async () => {
    setLoadingUser(true);
    await setSelectedCategory(0);
    getProduct(0);
    await setSortPrice(null);
    setTimeout(() => {
      setLoadingUser(false);
    }, 700);
  };

  return (
    <div>
      <div className="bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
              alt="Store Logo"
              className="w-16 h-16 object-cover rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold">{shopDetail?.name}</h1>
              <p className="text-gray-500 text-lg">
                สร้างโดย {shopDetail?.user.fullName}
              </p>
            </div>
          </div>

          <div className="space-y-8 text-center text-gray-600 pr-9">
            <div className="flex space-x-8 justify-center">
              <div>
                <span className="text-red-500 text-xl font-bold">
                  {shopProductUser.length}
                </span>
                <p>รายการสินค้า</p>
              </div>
              <div>
                <span className="text-red-500 text-xl font-bold">
                  {totalQuantity.toLocaleString()}
                </span>
                <p>จำนวนสินค้าที่ถูกซื้อ</p>
              </div>
              <div>
                <span className="text-red-500 text-xl font-bold">
                  {OrderByStore}
                </span>
                <p>ยอดการสั่งซื้อ</p>
              </div>
              <div>
                <span className="text-red-500 text-xl font-bold">
                  {timeAgo}
                </span>
                <p>เข้าร่วมเมื่อ</p>
              </div>
            </div>

            {/* บรรทัดที่สอง */}

            {shopProductDetail
              ?.filter((store: any) =>
                store.user.address.some((address: any) => address.isUsed_Store)
              )
              .map((store: any, index) => (
                <div key={index} className="flex space-x-8 justify-center">
                  {store.user.address
                    .filter((address: any) => address.isUsed_Store)
                    .map((address: any, i: any) => (
                      <div className="flex" key={i}>
                        <div className="mr-5">
                          <span className="text-red-500 text-xl font-bold">
                            {address.detail}
                          </span>
                          <p>บ้านเลขที่</p>
                        </div>
                        <div className="mr-5">
                          <span className="text-red-500 text-xl font-bold">
                            {address.subDistrict}
                          </span>
                          <p>ตำบล</p>
                        </div>
                        <div className="mr-5">
                          <span className="text-red-500 text-xl font-bold">
                            {address.district}
                          </span>
                          <p>อำเภอ</p>
                        </div>
                        <div>
                          <span className="text-red-500 text-xl font-bold">
                            {address.province}
                          </span>
                          <p>จังหวัด</p>
                        </div>
                      </div>
                    ))}
                </div>
              ))}

            {/* <div className="flex space-x-8 justify-center">
              <div>
                <span className="block text-green-500 text-xl font-bold">
                  123/45 หมู่ 6
                </span>
                <p>บ้านเลขที่</p>
              </div>
              <div>
                <span className="block text-gray-600 text-xl font-bold">
                  ตำบลบางใหญ่
                </span>
                <p>ตำบล</p>
              </div>
              <div>
                <span className="block text-blue-500 text-xl font-bold">
                  อำเภอบางใหญ่
                </span>
                <p>อำเภอ</p>
              </div>
              <div>
                <span className="block text-red-500 text-xl font-bold">
                  นนทบุรี
                </span>
                <p>จังหวัด</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="pl-14 pr-14 mt-10">
        <div className="bg-white p-4 shadow-md rounded-md -mb-6 border ">
          <h2 className="text-lg font-semibold mb-4">กรองข้อมูลสินค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 ">
                ประเภทผลไม้
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCate(Number(e.target.value))}
                className="block w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
              >
                {categories.map((item, i: number) => (
                  <option key={i} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white"
          onClick={() => setSortPrice("asc")}
        >
          ราคา: ต่ำไปสูง
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white ml-2"
          onClick={() => setSortPrice("desc")}
        >
          ราคา: สูงไปต่ำ
        </button>
      </div> */}

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                ช่วงราคาสินค้า
              </label>
              <select
                value={sortPrice || ""}
                onChange={onSortChange}
                className="block w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
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

            <div className="flex items-center space-x-4 ml-11">
              <button
                onClick={handleResetSort}
                className="w-52 text-base rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-white transition-all shadow-md hover:shadow-lg active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
                disabled={loadingUser}
              >
                {loadingUser ? (
                  <div>
                    {" "}
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pl-16 pr-16 mt-10">
        {filterProduct.map((product: Product, i: number) => {
          const userid = user?.id;
          const timePassed = dayjs(product.createdAt).locale("th").fromNow();

          console.log("product", product);

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
                  {product.productGI.category.name}
                </div>

                {userid == product?.productGI?.store?.userId && (
                  <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                    สินค้าของคุณ
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
                  <svg
                    height="13px"
                    width="13px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <g>
                        <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"></path>
                      </g>
                    </g>
                  </svg>
                  <span className="ml-1">{timePassed}</span>
                </span>

                <span className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                  <svg
                    className="h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    ></path>
                  </svg>
                  <span className="ml-1">{product.sold} ยอดขาย</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
