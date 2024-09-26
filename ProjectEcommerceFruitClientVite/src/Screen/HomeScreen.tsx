import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import Loading from "../layout/component/LoadingComponent";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import { resetScroll } from "../api/agent";
import MyLottie from "../helper/components/MyLottie";
dayjs.extend(relativeTime);

import lottiteEmpty from "../assets/lotties/lf20_qh5z2fdq.json";

export default observer(function HomeScreen() {
  const navigate = useNavigate();

  const { product, getProduct, category, getCategory } =
    useStore().productStore;

  const { user, setLoadingUser, loadingUser, getUserDetailbyId } =
    useStore().userStore;

  const { GetStoreProductUser, shopProductUser } = useStore().shopuserStore;

  useEffect(() => {
    getProduct(0);
    getCategory();
    getUserDetailbyId();
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

                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                      ช่วงราคาสินค้า
                    </label>
                    <select
                      value={sortPrice}
                      onChange={onSortChange}
                      className="block w-52 bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring focus:ring-indigo-200"
                    >
                      <option value="" hidden>
                        ราคา
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
                    <svg
                      className="h-6 mr-3"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      viewBox="0 0 455.005 455.005"
                    >
                      <g>
                        <path d="M446.158,267.615c-5.622-3.103-12.756-2.421-19.574,1.871l-125.947,79.309c-3.505,2.208-4.557,6.838-2.35,10.343 c2.208,3.505,6.838,4.557,10.343,2.35l125.947-79.309c2.66-1.675,4.116-1.552,4.331-1.432c0.218,0.12,1.096,1.285,1.096,4.428 c0,8.449-6.271,19.809-13.42,24.311l-122.099,76.885c-6.492,4.088-12.427,5.212-16.284,3.084c-3.856-2.129-6.067-7.75-6.067-15.423 c0-19.438,13.896-44.61,30.345-54.967l139.023-87.542c2.181-1.373,3.503-3.77,3.503-6.347s-1.323-4.974-3.503-6.347L184.368,50.615 c-2.442-1.538-5.551-1.538-7.993,0L35.66,139.223C15.664,151.815,0,180.188,0,203.818v4c0,23.63,15.664,52.004,35.66,64.595 l209.292,131.791c3.505,2.207,8.136,1.154,10.343-2.35c2.207-3.505,1.155-8.136-2.35-10.343L43.653,259.72 C28.121,249.941,15,226.172,15,207.818v-4c0-18.354,13.121-42.122,28.653-51.902l136.718-86.091l253.059,159.35l-128.944,81.196 c-20.945,13.189-37.352,42.909-37.352,67.661c0,13.495,4.907,23.636,13.818,28.555c3.579,1.976,7.526,2.956,11.709,2.956 c6.231,0,12.985-2.176,19.817-6.479l122.099-76.885c11.455-7.213,20.427-23.467,20.427-37.004 C455.004,277.119,451.78,270.719,446.158,267.615z">
                          {" "}
                        </path>
                        <path d="M353.664,232.676c2.492,0,4.928-1.241,6.354-3.504c2.207-3.505,1.155-8.136-2.35-10.343l-173.3-109.126 c-3.506-2.207-8.136-1.154-10.343,2.35c-2.207,3.505-1.155,8.136,2.35,10.343l173.3,109.126 C350.916,232.303,352.298,232.676,353.664,232.676z">
                          {" "}
                        </path>
                        <path d="M323.68,252.58c2.497,0,4.938-1.246,6.361-3.517c2.201-3.509,1.14-8.138-2.37-10.338L254.46,192.82 c-3.511-2.202-8.139-1.139-10.338,2.37c-2.201,3.51-1.14,8.138,2.37,10.338l73.211,45.905 C320.941,252.21,322.318,252.58,323.68,252.58z">
                          {" "}
                        </path>
                        <path d="M223.903,212.559c-3.513-2.194-8.14-1.124-10.334,2.39c-2.194,3.514-1.124,8.14,2.39,10.334l73.773,46.062 c1.236,0.771,2.608,1.139,3.965,1.139c2.501,0,4.947-1.251,6.369-3.529c2.194-3.514,1.124-8.14-2.39-10.334L223.903,212.559z">
                          {" "}
                        </path>
                        <path d="M145.209,129.33l-62.33,39.254c-2.187,1.377-3.511,3.783-3.503,6.368s1.345,4.983,3.54,6.348l74.335,46.219 c1.213,0.754,2.586,1.131,3.96,1.131c1.417,0,2.833-0.401,4.071-1.201l16.556-10.7c3.479-2.249,4.476-6.891,2.228-10.37 c-2.248-3.479-6.891-4.475-10.37-2.228l-12.562,8.119l-60.119-37.38l48.2-30.355l59.244,37.147l-6.907,4.464 c-3.479,2.249-4.476,6.891-2.228,10.37c2.249,3.479,6.894,4.476,10.37,2.228l16.8-10.859c2.153-1.392,3.446-3.787,3.429-6.351 c-0.018-2.563-1.344-4.94-3.516-6.302l-73.218-45.909C150.749,127.792,147.647,127.795,145.209,129.33z">
                          {" "}
                        </path>
                        <path d="M270.089,288.846c2.187-3.518,1.109-8.142-2.409-10.329l-74.337-46.221c-3.518-2.188-8.143-1.109-10.329,2.409 c-2.187,3.518-1.109,8.142,2.409,10.329l74.337,46.221c1.232,0.767,2.601,1.132,3.953,1.132 C266.219,292.387,268.669,291.131,270.089,288.846z">
                          {" "}
                        </path>
                        <path d="M53.527,192.864c-2.187,3.518-1.109,8.142,2.409,10.329l183.478,114.081c1.232,0.767,2.601,1.132,3.953,1.132 c2.506,0,4.956-1.256,6.376-3.541c2.187-3.518,1.109-8.142-2.409-10.329L63.856,190.455 C60.338,188.266,55.714,189.346,53.527,192.864z">
                          {" "}
                        </path>
                      </g>
                    </svg>
                    <div className="font-semibold inline-block">
                      รายการผลไม้ทั้งหมด
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
                      <svg
                        className="h-6 mr-3"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 455.005 455.005"
                      >
                        <g>
                          <path d="M446.158,267.615c-5.622-3.103-12.756-2.421-19.574,1.871l-125.947,79.309c-3.505,2.208-4.557,6.838-2.35,10.343 c2.208,3.505,6.838,4.557,10.343,2.35l125.947-79.309c2.66-1.675,4.116-1.552,4.331-1.432c0.218,0.12,1.096,1.285,1.096,4.428 c0,8.449-6.271,19.809-13.42,24.311l-122.099,76.885c-6.492,4.088-12.427,5.212-16.284,3.084c-3.856-2.129-6.067-7.75-6.067-15.423 c0-19.438,13.896-44.61,30.345-54.967l139.023-87.542c2.181-1.373,3.503-3.77,3.503-6.347s-1.323-4.974-3.503-6.347L184.368,50.615 c-2.442-1.538-5.551-1.538-7.993,0L35.66,139.223C15.664,151.815,0,180.188,0,203.818v4c0,23.63,15.664,52.004,35.66,64.595 l209.292,131.791c3.505,2.207,8.136,1.154,10.343-2.35c2.207-3.505,1.155-8.136-2.35-10.343L43.653,259.72 C28.121,249.941,15,226.172,15,207.818v-4c0-18.354,13.121-42.122,28.653-51.902l136.718-86.091l253.059,159.35l-128.944,81.196 c-20.945,13.189-37.352,42.909-37.352,67.661c0,13.495,4.907,23.636,13.818,28.555c3.579,1.976,7.526,2.956,11.709,2.956 c6.231,0,12.985-2.176,19.817-6.479l122.099-76.885c11.455-7.213,20.427-23.467,20.427-37.004 C455.004,277.119,451.78,270.719,446.158,267.615z">
                            {" "}
                          </path>
                          <path d="M353.664,232.676c2.492,0,4.928-1.241,6.354-3.504c2.207-3.505,1.155-8.136-2.35-10.343l-173.3-109.126 c-3.506-2.207-8.136-1.154-10.343,2.35c-2.207,3.505-1.155,8.136,2.35,10.343l173.3,109.126 C350.916,232.303,352.298,232.676,353.664,232.676z">
                            {" "}
                          </path>
                          <path d="M323.68,252.58c2.497,0,4.938-1.246,6.361-3.517c2.201-3.509,1.14-8.138-2.37-10.338L254.46,192.82 c-3.511-2.202-8.139-1.139-10.338,2.37c-2.201,3.51-1.14,8.138,2.37,10.338l73.211,45.905 C320.941,252.21,322.318,252.58,323.68,252.58z">
                            {" "}
                          </path>
                          <path d="M223.903,212.559c-3.513-2.194-8.14-1.124-10.334,2.39c-2.194,3.514-1.124,8.14,2.39,10.334l73.773,46.062 c1.236,0.771,2.608,1.139,3.965,1.139c2.501,0,4.947-1.251,6.369-3.529c2.194-3.514,1.124-8.14-2.39-10.334L223.903,212.559z">
                            {" "}
                          </path>
                          <path d="M145.209,129.33l-62.33,39.254c-2.187,1.377-3.511,3.783-3.503,6.368s1.345,4.983,3.54,6.348l74.335,46.219 c1.213,0.754,2.586,1.131,3.96,1.131c1.417,0,2.833-0.401,4.071-1.201l16.556-10.7c3.479-2.249,4.476-6.891,2.228-10.37 c-2.248-3.479-6.891-4.475-10.37-2.228l-12.562,8.119l-60.119-37.38l48.2-30.355l59.244,37.147l-6.907,4.464 c-3.479,2.249-4.476,6.891-2.228,10.37c2.249,3.479,6.894,4.476,10.37,2.228l16.8-10.859c2.153-1.392,3.446-3.787,3.429-6.351 c-0.018-2.563-1.344-4.94-3.516-6.302l-73.218-45.909C150.749,127.792,147.647,127.795,145.209,129.33z">
                            {" "}
                          </path>
                          <path d="M270.089,288.846c2.187-3.518,1.109-8.142-2.409-10.329l-74.337-46.221c-3.518-2.188-8.143-1.109-10.329,2.409 c-2.187,3.518-1.109,8.142,2.409,10.329l74.337,46.221c1.232,0.767,2.601,1.132,3.953,1.132 C266.219,292.387,268.669,291.131,270.089,288.846z">
                            {" "}
                          </path>
                          <path d="M53.527,192.864c-2.187,3.518-1.109,8.142,2.409,10.329l183.478,114.081c1.232,0.767,2.601,1.132,3.953,1.132 c2.506,0,4.956-1.256,6.376-3.541c2.187-3.518,1.109-8.142-2.409-10.329L63.856,190.455 C60.338,188.266,55.714,189.346,53.527,192.864z">
                            {" "}
                          </path>
                        </g>
                      </svg>
                      <div
                        onClick={handleMyShop}
                        className="font-semibold inline-block"
                      >
                        สินค้าของฉัน
                      </div>
                    </div>
                  )}

                </div>

                {taps === "taps1" && (
                  <>
                    {filteredProducts.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {filteredProducts
                          .filter((x) => x.productGI.store.hidden != true)
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
                                    className="w-full h-72 "
                                    src={pathImages.product + product.images}
                                    alt="Sunset in the mountains"
                                  />
                                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                                  <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                                    {product.productGI.category.name}
                                  </div>

                                  {userid ==
                                    product?.productGI?.store?.user?.id && (
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

                                  {/* <p className="text-gray-500 text-sm">
                              {product.detail.replace(/<\/?[^>]+(>|$)/g, "")}
                            </p> */}
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
                                    <span className="ml-1">
                                      {product.sold} ยอดขาย
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
                              {category.name}
                            </div>

                            {userid == myProduct?.productGI?.store?.userId && (
                              <div className="absolute top-0 left-0 bg-green-600 px-4 py-2 text-white mt-3 ml-3 text-xs font-bold rounded">
                                สินค้าของคุณ
                              </div>
                            )}

                            {myProduct.status == false &&
                              myProduct.quantity == 0 && (
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

                            {myProduct.quantity == 0 &&
                              myProduct.status == true && (
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
                              <span className="ml-1">
                                {myProduct.sold} ยอดขาย
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
