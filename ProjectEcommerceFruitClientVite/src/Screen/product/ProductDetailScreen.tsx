import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/store";
import { Button, Typography, Box } from "@mui/material";
import ToastAdd from "../../layout/component/ToastAdd";
import { pathImages, RoutePath } from "../../constants/RoutePath";
import { FaPlus } from "react-icons/fa6";
import { Product } from "../../models/Product";
import CircularProgress from "@mui/material/CircularProgress";
import { GrNext, GrPrevious } from "react-icons/gr";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import { fontSizeBiglittle, fontSizenormal, fontSizesmall, resetScroll } from "../../api/agent";
import MyDescription from "../../component/MyDescription";
import { motion } from "framer-motion";

dayjs.extend(relativeTime);
dayjs.locale("th");

export default observer(function ProductDetailScreen() {
  const navigate = useNavigate();
  const { getProductById, productDetail, DeleteProduct, addStockProduct } =
    useStore().productStore;
  const { user } = useStore().userStore;
  const {
    GetStoreProductUser,
    shopProductUser,
    GetStoreDetailByUserId,
    shopProductDetail,
  } = useStore().shopuserStore;
  const { getOrderByStore, order } = useStore().orderStore;
  const { product, getProduct } = useStore().productStore;

  useEffect(() => {
    getProduct(0);
    GetStoreDetailByUserId(productDetail?.productGI.store.userId);
    if (productDetail?.productGI.store.id) {
      getOrderByStore(productDetail?.productGI.store.id);
    }
  }, [getProduct, productDetail]);

  const OrderByStore = order.filter((x) => x.status === 1).length;

  const totalQuantity = order.reduce((total, currentOrder) => {
    const orderItemsQuantity = currentOrder.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    return total + orderItemsQuantity;
  }, 0);

  const createdAt = dayjs(shopProductDetail?.[0]?.createdAt);
  const timeAgo = createdAt ? createdAt.fromNow() : "N/A";

  const { AddToCart, GetCartItemByUser, loadingCart } = useStore().cartStore;
  const { id } = useParams<{ id: any }>();

  const [showToast, setShowToast] = useState(false);
  const [checkToast, setCheckToast] = useState("");

  const [preViewImage, setPreViewImage] = useState<any>(null);

  const [addquantity, setAddQuantity] = useState<any>();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const increaseQuantity = (quantityy: any) => {
    if (quantity < quantityy) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    try {
      const ProductId = productDetail?.id;
      const Quantity = quantity;
      const result = await AddToCart({ ProductId, Quantity });
      if (result) {
        await GetCartItemByUser();
        setShowToast(true);
        setCheckToast("AddToCart");
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
      }
    } catch (error) {
      alert("Failed to add product to cart.");
    }
  };

  const hanldleDelete = async (productid: any) => {
    await DeleteProduct(productid);
    await getProductById(productid);
  };

  const handleIncrease = () => {
    setAddQuantity((prevQuantity: any) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (addquantity > 1) {
      setAddQuantity((prevQuantity: any) => prevQuantity - 1);
    }
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value.replace(/,/g, "");
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue > 0) {
      setAddQuantity(numberValue);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);

    const getProduct = async () => {
      await getProductById(id);
    };
    getProduct();
  }, [id]);

  useEffect(() => {
    GetStoreProductUser(productDetail?.productGI.store.userId);
  }, [productDetail]);

  const [openModel, setOpenModel] = useState(false);

  const handlemodel = async (product: any) => {
    await getProductById(product.id);
    setAddQuantity(productDetail?.quantity);
    setOpenModel(!openModel);
  };

  const handleAddQuantity = async (product: Product) => {
    const productId = product.id;
    const quantity = addquantity;
    await addStockProduct({ productId, quantity });
    getProductById(productId);
    setOpenModel(false);
    setCheckToast("AddStockProduct");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const NavigateDetail = (product: any) => {
    navigate(RoutePath.productDetail(product.id));
    resetScroll();
  };

  const carouselRef: any = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const handleNext = () => {
    const remainingItems = shopProductUser.filter(
      (x) => x.id !== productDetail?.id
    ).length;
    if (currentIndex < remainingItems - itemsPerPage) {
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + 1, remainingItems - itemsPerPage)
      );
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const isDisabled =
    currentIndex >=
    shopProductUser.filter((x) => x.id !== productDetail?.id).length - 1;

  const [visibleCount, setVisibleCount] = useState(8);

  const loadMore = () => {
    setVisibleCount((x) => x + 4);
  };

  const filteredProducts = product.filter(
    (x) =>
      x.quantity > 0 &&
      x.status === true &&
      x.hidden != true &&
      x.productGI.store.hidden != true &&
      x.id != productDetail?.id &&
      x.productGI.category.name === productDetail?.productGI.category.name &&
      x.productGI.store.userId != user?.id
  );

  const handleShopDetail = (item: any) => {
    navigate(RoutePath.shopDetail(item[0].userId));
    resetScroll();
  };

  const RecommendProducts = shopProductUser.filter(
    (x) =>
      x.id !== productDetail?.id &&
      x.hidden !== true &&
      x.productGI.store.hidden !== true
  );

  return (
    <div className="bg-gray-100 py-12 2xl:px-20 md:px-6 px-4">
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4 bg-white">
        {showToast && <ToastAdd Check={checkToast} />}
        {/* <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden"> */}
        <div>
          <img
            className="h-96 rounded-t-lg object-cover"
            alt="image main"
            src={
              preViewImage
                ? preViewImage
                : pathImages.product + productDetail?.images
            }
          />
          <div className="flex mt-2 space-x-4">
            {productDetail?.productGI.images.map((item) => (
              <img
                alt="img-tag-one"
                className="md:w-24 md:h-24 rounded-t-lg object-cover "
                onClick={() =>
                  setPreViewImage(
                    preViewImage === pathImages.product_GI + item.imageName
                      ? pathImages.product + productDetail?.images
                      : pathImages.product_GI + item.imageName
                  )
                }
                src={pathImages.product_GI + item.imageName}
              />
            ))}
          </div>
        </div>

        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
          <div className="border-b border-gray-200 pb-6 flex justify-between">
            <div>
              <p className="text-sm leading-none text-gray-600" style={{fontSize:fontSizesmall}}>
                {productDetail && productDetail?.productGI?.category.name}
              </p>
              <h1
                className="
							lg:text-2xl
							text-xl
							font-semibold
							lg:leading-6
							leading-7
							text-gray-800
							mt-2
						"
            style={{fontSize:fontSizeBiglittle}}
              >
                {productDetail && productDetail?.productGI?.name}
              </h1>
            </div>

            {user && user?.id == productDetail?.productGI?.store?.userId && (
              <div className="flex items-center">
                <div>
                  <button
                    onClick={() => handlemodel(productDetail)}
                    className={
                      "bg-green-400 font-semibold rounded-2xl pl-5 pr-5 p-2 mr-6 flex items-center"
                    }
                  >
                    <FaPlus className="mr-3" /> เพิ่มสินค้า
                  </button>
                </div>

                {openModel && (
                  <div className="overflow-y-auto overflow-x-hidden bg-opacity-50 bg-black inset-0 fixed flex z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                      {/* Modal content */}
                      <div className="relative p-4  rounded-lg shadow bg-white sm:p-5">
                        {/* Modal header */}
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                          <h3 className="text-lg font-semibold text-black-800 dark:text-black">
                            รายละเอียดสินค้า
                          </h3>
                          <button
                            onClick={handlemodel}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-black-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                        </div>
                        {/* Modal body */}
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                            >
                              ชื่อสินค้า
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="disabled:bg-gray-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Type product name"
                              value={productDetail?.productGI?.name}
                              disabled
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="brand"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                            >
                              ราคา
                            </label>
                            <input
                              type="text"
                              name="brand"
                              id="brand"
                              className="disabled:bg-gray-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Product brand"
                              value={productDetail.price}
                              disabled
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                            >
                              จำนวนสินค้า
                            </label>
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={handleDecrease}
                                className="px-4 py-1 bg-red-500 rounded-lg mr-6 text-white text-xl"
                              >
                                -
                              </button>
                              <input
                                className="bg-white border border-green-800 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500 text-center font-bold"
                                value={addquantity.toLocaleString()}
                                onChange={handleInputChange}
                              />
                              <button
                                type="button"
                                onClick={handleIncrease}
                                className="px-3 py-1 bg-green-500 rounded-lg ml-6 text-white text-xl"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                            >
                              ประเภท
                            </label>
                            <input
                              name="price"
                              id="price"
                              className="disabled:bg-gray-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              value={productDetail.productGI.category.name}
                              disabled
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                            >
                              รายละเอียด
                            </label>
                            <textarea
                              id="description"
                              rows={4}
                              className=" disabled:bg-gray-300 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Write product description here"
                              value={productDetail.detail.replace(
                                /<\/?[^>]+(>|$)/g,
                                ""
                              )}
                              disabled
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddQuantity(productDetail)}
                          className="text-white inline-flex items-center bg-green-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          <svg
                            className="mr-1 -ml-1 w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          เพิ่มสินค้า
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => hanldleDelete(productDetail.id)}
                  className={`p-2 ${
                    productDetail?.quantity === 0
                      ? "bg-gray-400 text-gray-700"
                      : !productDetail?.hidden
                      ? "bg-red-500 text-gray-700"
                      : "bg-green-400"
                  } font-semibold rounded-2xl pl-5 pr-5`}
                  disabled={productDetail?.quantity === 0}
                >
                  {productDetail?.quantity === 0
                    ? "สินค้าหมด"
                    : !productDetail?.hidden
                    ? "ปิดการขาย"
                    : "เปิดการขาย"}
                </button>
              </div>
            )}
          </div>
          <div>
            <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 mt-7">
              {/* {productDetail?.detail.replace(/<\/?[^>]+(>|$)/g, "")} */}
             {productDetail?.detail ? <MyDescription text={productDetail?.detail} /> : <div></div>} 
            </p>
            <p className="text-base leading-4 mt-4 text-gray-600">
              ขายแล้ว : {productDetail?.sold} ชิ้น
            </p>
            <p className="text-base leading-4 mt-4 text-gray-600 mb-5">
              ราคาต่อกิโลกรัม : {productDetail?.price} บาท
            </p>
            <p className="text-base leading-4 mt-4 text-gray-600 mb-5">
              คงเหลือ : {productDetail?.quantity} ชิ้น
            </p>

            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                onClick={decreaseQuantity}
                size="medium"
              >
                -
              </Button>
              <Typography variant="body1">{quantity}</Typography>
              <Button
                variant="outlined"
                onClick={() => increaseQuantity(productDetail?.quantity)}
                size="medium"
              >
                +
              </Button>
            </Box>
          </div>
          <div>
            <div className="border-t border-b py-4 mt-7 border-gray-200">
              <div
                onClick={() => setShow(!show)}
                className="flex justify-between items-center cursor-pointer"
              >
                <p className="text-base leading-4 text-gray-800">
                  ข้อมูล IG ของสินค้า
                </p>
                <button
                  className="
									cursor-pointer
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
									rounded
								"
                  aria-label="show or hide"
                >
                  <svg
                    className={
                      "transform " + (show ? "rotate-180" : "rotate-0")
                    }
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1L5 5L1 1"
                      stroke="#4B5563"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div
                className={
                  "pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 " +
                  (show ? "block" : "hidden")
                }
                id="sect"
              >
                {productDetail?.productGI?.description ? <MyDescription text={productDetail?.productGI?.description} /> : <div></div>}
                {/* <MyDescription text={productDetail?.productGI?.description} /> */}
              </div>
            </div>
          </div>
          {user && user?.id == productDetail?.productGI?.store?.userId ? (
            <button
              className="
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base
						flex
						items-center
						justify-center
						leading-none
						text-white
						bg-gray-400
						w-full
						py-4
						hover:bg-gray-400
                        mt-4 
					"
              disabled
              onClick={handleAddToCart}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              นี่คือสินค้าในร้านของคุณ
            </button>
          ) : (
            <button
              className="
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base
						flex
						items-center
						justify-center
						leading-none
						text-white
						bg-gray-800
						w-full
						py-4
						hover:bg-gray-700
                        mt-4 
					"
              onClick={handleAddToCart}
              disabled={loadingCart}
            >
              {loadingCart ? (
                <div>
                  <CircularProgress size={23} color="inherit" />
                </div>
              ) : (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  เพิ่มลงตะกร้า
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="pl-14 pr-14">
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto mt-10 border border-gray-200">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
                alt="Store Logo"
                className="rounded-full w-20 h-20 rounded-t-lg object-cover"
              />
            </div>

            <div className="flex-grow">
              <h1 className="text-2xl font-bold">
                {shopProductDetail?.[0]?.name}
              </h1>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleShopDetail(shopProductDetail)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold border hover:bg-gray-200 hover:text-gray-800"
              >
                ดูร้านค้า
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-500">จำนวนสินค้าที่ถูกซื้อ</p>
              <p className="text-red-500 text-xl font-bold">
                {totalQuantity.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">รายการสินค้า</p>
              <p className="text-red-500 text-xl font-bold">
                {shopProductUser.length.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">ยอดการสั่งซื้อ</p>
              <p className="text-red-500 text-xl font-bold">
                {OrderByStore.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">เข้าร่วมเมื่อ</p>
              <p className="text-red-500 text-xl font-bold">{timeAgo}</p>
            </div>
          </div>
        </div>
      </div>






      {RecommendProducts.length > 0 && (
  <div className="bg-white mt-5">
    <div className="ml-12 pt-5 text-2xl mb-3 flex justify-between">
      <p>สินค้าจากร้านเดียวกัน</p>
      <div className="mr-10 flex cursor-pointer" onClick={() => handleShopDetail(shopProductDetail)}>
        <p className="font-semibold text-sm text-red-500">ดูทั้งหมด</p>
        <GrNext className="text-red-500" />
      </div>
    </div>

    <div className="relative">
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-green-700 rounded-full p-2"
        disabled={currentIndex <= 0}
      >
        <GrPrevious className="text-white" />
      </button>

      <motion.div 
        ref={carouselRef} 
        className="flex overflow-hidden"
        transition={{ type: 'tween', duration: 0.5 }} // กำหนด transition
      >
        {RecommendProducts.slice(currentIndex, currentIndex + itemsPerPage).map((item) => (
          <motion.div
            onClick={() => NavigateDetail(item)}
            key={item.id}
            className="m-custom-marginleft mb-9 w-64 max-w-custom-size overflow-hidden rounded-lg bg-white border relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }} // เริ่มต้นด้วยความโปร่งใส 0 และเลื่อนขึ้นเล็กน้อย
            animate={{ opacity: 1, y: 0 }} // เปลี่ยนเป็นโปร่งใส 1 และกลับมาอยู่ที่ตำแหน่งเดิม
            exit={{ opacity: 0, y: -20 }} // เมื่อเลิกแสดงให้ลดความโปร่งใสและเลื่อนขึ้นเล็กน้อย
            transition={{ duration: 0.5 }} // ใช้เวลาประมาณ 0.5 วินาทีในการทำให้โปร่งใส
          >
            {/* เนื้อหาสินค้า */}
            <div className="shadow-md relative">
              <img
                className="h-48 w-full rounded-t-lg object-cover"
                src={pathImages.product + item.images}
                alt="product image"
              />
              {user && user?.id === productDetail?.productGI?.store?.userId ? (
                <span className="absolute top-0 left-0 w-28 translate-y-6 -translate-x-6 -rotate-45 bg-red-500 text-center text-sm text-white z-10">
                  สินค้าของคุณ
                </span>
              ) : null}

              <div className="mt-4 px-3 pb-5">
                <h5 className="text-base font-semibold tracking-tight text-slate-900" style={{ fontSize: fontSizenormal }}>
                  {item.productGI.name}
                </h5>
                <div className="flex items-center justify-between mt-10">
                  <p>
                    <span className="text-xl font-bold text-slate-900">
                      ฿{item.price.toLocaleString()}
                    </span>
                  </p>
                  <button className="flex items-center rounded-md bg-slate-900 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {/* เพิ่มสินค้าลงตะกร้า */}
                    รายละเอียดสินค้า
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <button
        onClick={handleNext}
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2 ${
          isDisabled ? "bg-gray-400" : "bg-green-700"
        }`}
        disabled={isDisabled}
      >
        <GrNext className="text-white" />
      </button>
    </div>
  </div>
)}





      

      <div className="bg-white mt-5">
        <div className="ml-12 pt-5 text-2xl mb-3 flex justify-between">
          <p>สินค้าใกล้เคียงกัน</p>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div className="grid grid-cols-4 gap-4">
              {filteredProducts.slice(0, visibleCount).map((item) => (
                <div
                  onClick={() => NavigateDetail(item)}
                  key={item.id}
                  className="m-4 w-64 max-w-full overflow-hidden rounded-lg bg-white border relative cursor-pointer"
                >
                  <div className="shadow-md relative">
                    <img
                      className="h-48 w-full rounded-t-lg object-cover"
                      src={pathImages.product + item.images}
                      alt="product image"
                    />
                    {/* <span className="absolute top-0 left-0 w-28 translate-y-6 -translate-x-6 -rotate-45 bg-red-500 text-center text-sm text-white z-10">
                      ยอดนิยม
                    </span> */}
                    <div className="mt-4 px-3 pb-5">
                      <h5 className="text-base font-semibold tracking-tight text-slate-900" style={{fontSize:fontSizenormal}}>
                        {item.productGI.name}
                      </h5>
                      <div className="flex items-center justify-between mt-10">
                        <p>
                          <span className="text-xl font-bold text-slate-900">
                            ฿{item.price}
                          </span>
                        </p>
                        <button className="flex items-center rounded-md bg-slate-900 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {/* เพิ่มสินค้าลงตะกร้า */}
                          รายละเอียดสินค้า
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {visibleCount < filteredProducts.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-300 w-96 border border-gray-300"
          >
            ดูเพิ่มเติม
          </button>
        </div>
      )}
    </div>
  );
});
