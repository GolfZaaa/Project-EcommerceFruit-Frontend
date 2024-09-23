import React, { useEffect, useRef, useState } from "react";
import image1 from "../image/FirstScreen1.jpg";
import image2 from "../image/FirstScreen2.jpg";
import image3 from "../image/FirstScreen3.png";
import News1 from "../image/News1.jpg";
import News2 from "../image/News2.jpg";
import News3 from "../image/News3.jpg";
import News4 from "../image/News4.jpg";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../layout/screen/Footer";

import AOS from "aos";
import "aos/dist/aos.css";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { pathImages, RoutePath } from "../constants/RoutePath";
import { Product } from "../models/Product";
import { motion, useAnimation } from "framer-motion";

const settingsImageSlide = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default observer(function FirstScreenNew() {
  const navigate = useNavigate();

  const { product, getProduct, getCategory } = useStore().productStore;

  const { getOrdersAll, order } = useStore().orderStore;

  const { getUserAll, userAll, user } = useStore().userStore;

  const { slideShow, getSlideShow, getSystemSetting } =
    useStore().systemSettingStore;

  const [randomProduct, setRandomProduct] = useState<Product>();
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await getProduct(0);
      await getOrdersAll();
      await getUserAll();
      await getSystemSetting();
      await getSlideShow();
    };
    fetchData();
  }, [getProduct, getCategory]);

  useEffect(() => {
    if (product.length > 0) {
      const funcrandom = Math.floor(Math.random() * product.length);
      const result: any = product[funcrandom];
      setRandomProduct(result);

      const sortedProducts = [...product].sort((a, b) => b.sold - a.sold);
      const topFour = sortedProducts.slice(0, 4);
      setTopProducts(topFour);
    }
  }, [product]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const removeHTMLTags = (string: any) => {
    return string.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const NavigateDetail = (product: any) => {
    navigate(RoutePath.productDetail(product.id));
  };

  const OrderDay = (order: any) => {
    const today = new Date();

    return order.filter((x: any) => {
      if (x.status === 1) {
        const createDate = new Date(x.createdAt);

        return (
          createDate.getFullYear() === today.getFullYear() &&
          createDate.getMonth() === today.getMonth() &&
          createDate.getDate() === today.getDate()
        );
      }
      return false;
    });
  };

  const [inView, setInView] = useState(false);
  const ref: any = useRef(null);
  const controls = useAnimation();

  const handleScroll = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom >= 0) {
        setInView(true);
      } else {
        setInView(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        },
      });
    } else {
      controls.start({
        opacity: 0,
        y: 50,
        scale: 0.95,
        rotate: 5,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      });
    }
  }, [inView, controls]);

  console.log("slideShow", JSON.stringify(slideShow.length));

  return (
    <div>
      {/* รูปสไลด์ Start */}
      <div className="overflow-hidden mt-4 ml-4 mr-4">
        <div className="w-full">
          {slideShow.length === 1 ? (
            <div className="p-2 relative group">
              <img
                src={pathImages.slideShow + slideShow[0]?.imageName || ""}
                className="w-full h-96 object-cover rounded-md transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-3"
                alt={`slide-image`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {/* <p className="text-lg font-semibold">รูปภาพ {index + 1}</p> */}
              </div>
            </div>
          ) : (
            <Slider {...settingsImageSlide}>
              {slideShow.map((image, index) => {
                console.log("image" + index, JSON.stringify(image));

                return (
                  <div key={index} className="p-2 relative group">
                    <img
                      src={pathImages.slideShow + image?.imageName || ""}
                      className="w-full h-96 object-cover rounded-md transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-3"
                      alt={`slide-${index}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {/* <p className="text-lg font-semibold">รูปภาพ {index + 1}</p> */}
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      </div>

      {/* รูปสไลด์ End */}

      {/* ข้อมูลหลัก Start */}
      <div className="overflow-hidden">
        <div className="flex flex-col lg:flex-row items-stretch justify-between lg:px-0 px-6 lg:py-20 py-8 2xl:mx-auto 2xl:container">
          {/* Image Section */}
          <div data-aos="fade-left" className="relative lg:w-1/2 z-30">
            {/* Desktop Image */}
            <motion.div
              data-aos="fade-up"
              className="hidden lg:flex justify-end items-center bg-gray-100 w-full lg:w-10/12 lg:h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                opacity: 0.9,
              }}
            >
              <div className="w-full lg:w-auto lg:-mr-32">
                <img
                  src="https://www.tot.co.th/images/default-source/default-album/digital-tips/63/farmer-online/mobile.jpg?sfvrsn=28ade211_4"
                  alt="image with decent chairs"
                  className="w-full relative z-30 lg:pl-20 px-6 py-14"
                />
              </div>
            </motion.div>

            {/* Mobile Image */}
            <motion.div
              data-aos="zoom-in"
              className="absolute top-0 left-0 bg-gray-100 w-full hidden md:block lg:hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                opacity: 0.9,
              }}
            >
              <img
                src="https://i.ibb.co/YQjkqWr/juan-burgos-FIy-XGZ1q0mc-unsplash-1.png"
                alt="image with decent chairs"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Text Section */}
          <div
            data-aos="fade-up"
            className="bg-gray-100 lg:w-1/2 lg:ml-12 lg:p-14 p-8 flex items-center"
          >
            <div>
              <motion.p
                data-aos="fade-right"
                className="text-4xl sm:text-5xl xl:text-5xl 2xl:text-5xl font-bold text-green-600 capitalize"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, color: "#2f855a", rotate: -2 }}
              >
                เกษตรกรออนไลน์
              </motion.p>
              <motion.p
                data-aos="fade-up"
                className="text-base leading-normal text-green-500 mt-5 font-normal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                whileHover={{ opacity: 0.8, color: "#2f855a" }}
              >
                เกษตรกรออนไลน์ เริ่มได้ง่าย ๆ
                เพียงใช้อินเทอร์เน็ตและอุปกรณ์เข้าถึงที่เราใช้กันอยู่แล้วในชีวิตประจำวัน
                อย่างแรกเลยคือการค้นคว้าหาข้อมูล
                และช่องทางการซื้อขายผลผลิตที่เราต้องการเข้าถึง
                โดยการซื้อขายสินค้าและผลผลิตทางการเกษตรก็มีหลายรูปแบบซึ่งไม่ต่างจากการซื้อขายสินค้าทั่วไป
              </motion.p>
              <motion.button
                data-aos="zoom-in"
                className="mt-8 text-base flex items-center justify-between py-4 px-8 bg-gray-800 text-white font-medium leading-none rounded-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#2d3748",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                เยี่ยมชมสินค้าเกษตร
                <div className="ml-2">
                  <svg
                    className="fill-stroke"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.33325 8H12.6666"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 10.6667L12.6667 8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 5.33301L12.6667 7.99967"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      {/* ข้อมูลรอง End */}

      {/* สินค้าสุ่ม Start */}
      <div className="xl:mx-auto xl:container">
        <div className="lg:px-20 md:px-6 px-4 md:py-12 py-8">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            <motion.div
              ref={ref}
              className="w-full lg:w-1/2 md:py-9 py-6"
              data-aos="fade-left"
            >
              <img
                src={randomProduct && pathImages.product + randomProduct.images}
                alt="product"
                className="lg:w-96 h-96 object-cover object-center w-full transition-transform duration-500"
              />
            </motion.div>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -50, scale: 0.95, rotate: -5 }}
              animate={controls}
              className="lg:w-1/2 lg:pl-12 lg:pr-24"
            >
              <p className="text-sm leading-none text-gray-600 pb-2">
                {randomProduct && randomProduct.productGI.category.name}
              </p>
              <p className="md:text-3xl lg:text-4xl text-2xl font-semibold lg:leading-9 text-gray-800 lg:pb-6 md:pb-4 pb-2">
                {randomProduct && randomProduct.productGI.name}
              </p>
              <p className="text-sm leading-5 text-gray-600 md:pb-10 pb-8">
                {randomProduct &&
                  removeHTMLTags(
                    randomProduct && randomProduct.productGI.description
                  )}
              </p>
              <div className="md:block flex items-center justify-center">
                <motion.button
                  onClick={() => NavigateDetail(randomProduct)}
                  className="lg:w-auto w-full border border-gray-800 hover:text-gray-50 hover:bg-gray-800 focus:outline-none lg:px-10 px-7 lg:py-4 py-3 text-sm leading-none text-gray-800"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.95, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  ดูรายละเอียดเพิ่มเติม
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* สินค้าสุ่ม End */}

      {/* สินค้าขายดี Start */}
      <div className="2xl:mx-auto 2xl:container px-4 md:px-6 2xl:px-0 py-16 flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-start items-start">
            <p
              data-aos="fade-up"
              className="text-3xl lg:text-4xl font-semibold leading-9 text-gray-800"
            >
              สินค้าที่โดดเด่น
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 justify-items-between mt-8 gap-y-8 lg:gap-y-0 gap-x-8">
            {topProducts.map((productItem, _) => {
              const userid = user?.id;

              return (
                <motion.div
                  key={productItem.id}
                  onClick={() => NavigateDetail(productItem)}
                  className="flex items-start flex-col cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    data-aos="fade-up"
                    className="relative flex justify-center items-center bg-white py-12 px-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      className="w-96 h-44 object-cover"
                      src={pathImages.product + productItem.images}
                      alt="mobile"
                    />
                    {userid === productItem?.productGI?.store?.user?.id && (
                      <motion.span
                        className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
                        whileHover={{
                          rotate: 15,
                          transition: { duration: 0.3 },
                        }}
                      >
                        สินค้าของคุณ
                      </motion.span>
                    )}
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        rotate: 15,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 flex justify-center items-center p-3.5 bg-white rounded-full"
                    >
                      <svg
                        className="fill-stroke text-gray-600 hover:text-gray-500"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.00002 6.59999V5.39999C6.00002 4.44521 6.37931 3.52953 7.05444 2.8544C7.72957 2.17927 8.64525 1.79999 9.60003 1.79999V1.79999C10.5548 1.79999 11.4705 2.17927 12.1456 2.8544C12.8207 3.52953 13.2 4.44521 13.2 5.39999V6.59999M3.00002 6.59999C2.84089 6.59999 2.68828 6.6632 2.57576 6.77572C2.46324 6.88825 2.40002 7.04086 2.40002 7.19999V15.3C2.40002 16.434 3.36602 17.4 4.50002 17.4H14.7C15.834 17.4 16.8 16.4809 16.8 15.3469V7.19999C16.8 7.04086 16.7368 6.88825 16.6243 6.77572C16.5118 6.6632 16.3592 6.59999 16.2 6.59999H3.00002Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 8.40002V9.00002C6 9.9548 6.37928 10.8705 7.05442 11.5456C7.72955 12.2207 8.64522 12.6 9.6 12.6C10.5548 12.6 11.4705 12.2207 12.1456 11.5456C12.8207 10.8705 13.2 9.9548 13.2 9.00002V8.40002"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  </motion.div>
                  <div className="flex flex-col items-start justify-start mt-3 space-y-3">
                    <motion.div
                      data-aos="fade-up"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-lg font-medium leading-4 text-gray-800">
                        {productItem.productGI.name}
                      </p>
                    </motion.div>

                    <motion.div data-aos="fade-up">
                      <p className="text-lg leading-4 text-gray-600">
                        {productItem.price.toLocaleString()} บาท
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      {/* สินค้าขายดี End */}

      {/* Card Start */}
      <div className="2xl:container 2xl:mx-auto lg:px-20 md:py-12 md:px-6 py-9 px-4">
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 gap-6 ">
          {/* Safe Shopping Grid Card */}
          <div className=" p-6 bg-gray-50">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 3H13M12 7V3V7Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.6569 4.92871L19.0711 6.34292M15.5355 8.46424L18.364 5.63582L15.5355 8.46424Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 11V13M17 12H21H17Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.071 17.6572L17.6568 19.0714M15.5355 15.5359L18.3639 18.3643L15.5355 15.5359Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 21H11M12 17V21V17Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.34314 19.0713L4.92893 17.6571M8.46446 15.5358L5.63603 18.3642L8.46446 15.5358Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 13L3 11M7 12H3H7Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.92896 6.34277L6.34317 4.92856M8.46449 8.46409L5.63606 5.63567L8.46449 8.46409Z"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p
              data-aos="fade-zoom-in"
              className=" text-xl text-gray-800 font-semibold leading-5 mt-6"
            >
              การซื้อสินค้าอย่างปลอดภัย
            </p>
            <p
              data-aos="fade-zoom-in"
              className=" font-normal text-base leading-6 text-gray-600 my-4"
            >
              ร้านค้าทุกสาขาของเรามีมาตรการด้านสุขอนามัยที่เป็นผู้นำในอุตสาหกรรม
            </p>
            <a
              data-aos="fade-zoom-in"
              className=" cursor-pointer text-base leading-4 font-medium text-gray-800 border-b-2 border-gray-800 hover:text-gray-600 "
            >
              เรียนรู้เพิ่มเติม
            </a>
          </div>

          <div className=" p-6 bg-gray-50">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21H21"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 7V8C3 8.79565 3.31607 9.55871 3.87868 10.1213C4.44129 10.6839 5.20435 11 6 11C6.79565 11 7.55871 10.6839 8.12132 10.1213C8.68393 9.55871 9 7.79565 9 7M3 7H9M3 7H21M3 7L5 3H19L21 7M9 7C9 7.79565 9.31607 9.55871 9.87868 10.1213C10.4413 10.6839 11.2044 11 12 11C12.7956 11 13.5587 10.6839 14.1213 10.1213C14.6839 9.55871 15 8.79565 15 8M9 7H15V8M15 8C15 8.79565 15.3161 9.55871 15.8787 10.1213C16.4413 10.6839 17.2044 11 18 11C18.7956 11 19.5587 10.6839 20.1213 10.1213C20.6839 9.55871 21 8.79565 21 8V7"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 20.9996V10.8496"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 20.9996V10.8496"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21V17C9 16.4696 9.21071 15.9609 9.58579 15.5858C9.96086 15.2107 10.4696 15 11 15H13C13.5304 15 14.0391 15.2107 14.4142 15.5858C14.7893 15.9609 15 16.4696 15 17V21"
                stroke="#1F2937"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p
              data-aos="fade-zoom-in"
              className=" text-xl text-gray-800 font-semibold leading-5 mt-6"
            >
              การช็อปปิ้งส่วนตัว
            </p>
            <p
              data-aos="fade-zoom-in"
              className=" font-normal text-base leading-6 text-gray-600 my-4"
            >
              ธุรกิจจำหน่ายผลไม้ออนไลน์เป็นช่องทางที่เพิ่มความสะดวกสบายให้แก่ผู้บริโภค
              โดยนำเสนอผลิตภัณฑ์สดใหม่จากสวนสู่หน้าจอ พร้อมบริการจัดส่งถึงบ้าน
            </p>
            <a
              data-aos="fade-zoom-in"
              className=" cursor-pointer text-base leading-4 font-medium text-gray-800 border-b-2 border-gray-800 hover:text-gray-600 "
            >
              เรียนรู้เพิ่มเติม
            </a>
          </div>

          <div className=" p-6 bg-gray-50">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M18.4142 12.7573L21.2426 9.92886C21.6177 9.55378 22.1264 9.34307 22.6568 9.34307C23.1873 9.34307 23.696 9.55378 24.071 9.92886C24.4461 10.3039 24.6568 10.8126 24.6568 11.3431C24.6568 11.8735 24.4461 12.3822 24.071 12.7573L21.2426 15.5857L23.3639 23.3639L21.2426 25.4852L17.7071 19.1212L14.8786 21.9497V24.7781L12.7573 26.8994L11.3431 22.6568L7.10048 21.2426L9.2218 19.1212H12.0502L14.8786 16.2928L8.51469 12.7573L10.636 10.636L18.4142 12.7573Z"
                  stroke="#1F2937"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            <p
              data-aos="fade-zoom-in"
              className=" text-xl text-gray-800 font-semibold leading-5 mt-6"
            >
              จัดส่งฟรี
            </p>
            <p
              data-aos="fade-zoom-in"
              className=" font-normal text-base leading-6 text-gray-600 my-4"
            >
              จัดส่งฟรีเมื่อช็อปปิ้งเมื่อสั่งซื้อเกิน ฿ 100
              สำหรับทุกรายการสินค้าในร้าน ไม่มีข้อยกเว้น
              ประหยัดค่าส่งและรับสินค้าถึงบ้านอย่างรวดเร็วภายใน 3-5 วันทำการ
              โปรโมชั่นพิเศษนี้มีระยะเวลาจำกัด
            </p>
            <a
              data-aos="fade-zoom-in"
              className=" cursor-pointer text-base leading-4 font-medium text-gray-800 border-b-2 border-gray-800 hover:text-gray-600 "
            >
              เรียนรู้เพิ่มเติม
            </a>
          </div>
        </div>
      </div>
      {/* Card End */}

      {/* สเตตัส Start */}
      <div className="mt-7 mx-5">
        <div className="pb-20">
          <div className="mx-auto bg-gradient-to-l from-green-400 to-green-600 h-96">
            <div className="mx-auto container w-full flex flex-col justify-center items-center">
              <div className="flex justify-center items-center flex-col">
                <div className="mt-20">
                  <h2 className="lg:text-5xl md:text-5xl text-4xl font-black leading-10 text-white">
                    แพลตฟอร์มจำหน่ายสินค้าเกษตรออนไลน์
                  </h2>
                </div>
                <div className="mt-6 mx-2 md:mx-0 text-center">
                  <p className="lg:text-lg md:text-base leading-6 text-sm  text-white">
                    จากสวนสู่บ้านคุณ: ผลไม้สดใหม่ คัดสรรคุณภาพ
                    ส่งตรงถึงประตูบ้าน
                    เพื่อประสบการณ์การรับประทานผลไม้ที่เหนือระดับ
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto container md:-mt-28 -mt-20 flex justify-center items-center">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-x-2 gap-y-2 lg:gap-x-6 md:gap-x-6 md:gap-y-6">
              <div
                data-aos="fade-up"
                data-aos-duration="500"
                className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl"
              >
                <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">
                  {order.length}
                </h2>
                <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">
                  จำนวนคำสั่งซื้อทั้งหมด
                </p>
              </div>
              <div
                data-aos="fade-up"
                data-aos-duration="700"
                className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl"
              >
                <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">
                  {product.length}
                </h2>
                <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">
                  รายการผลไม้ทั้งหมด
                </p>
              </div>
              <div
                data-aos="fade-up"
                data-aos-duration="900"
                className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl"
              >
                <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">
                  {userAll.length}
                </h2>
                <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">
                  ผู้ใช้ทั้งหมด
                </p>
              </div>
              <div
                data-aos="fade-up"
                data-aos-duration="1100"
                className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl"
              >
                <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">
                  {OrderDay(order).length}
                </h2>
                <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">
                  ยอดขายของวันนี้
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* สเตตัส End */}

      {/* ข่าวสาร Start */}
      <div className="container mx-auto px-4 mb-5 ">
        <h1 className="text-5xl text-center f-m-w text-green-500 font-bold pt-0">
          ข่าวประชาสัมพันธ์
        </h1>
        <div className="pt-14 xl:px-0 px-4">
          <div className="w-full lg:flex overflow-x-hidden">
            <div className="lg:w-1/2">
              <img
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
                src={News1}
                className="w-full"
              />
              <div
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
                className="mt-8 lg:mb-0 mb-8"
              >
                <h1
                  data-aos="fade-right"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  className="f-m-m text-lg font-semibold leading-7"
                >
                  ลงพื้นที่รับขึ้นทะเบียนเกษตรกร 67/68 ม.6 ต.ลิ่นถิ่น
                </h1>
                <p
                  data-aos="fade-right"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  className="text-xs f-m-m leading-loose mt-2"
                >
                  วันที่ 18 กรกฎาคม 2567 นายจตุพร อิ่มจิตร เกษตรอำเภอทองผาภูมิ
                  มอบหมายให้ นางสาวขนิษฐา บุญคำมา
                  นักวิชาการส่งเสริมการเกษตรชำนาญการ
                  ลงพื้นที่รับขึ้นทะเบียนเกษตรกรผู้ปลูกข้าว ปี67/68 ณ หมู่ 6
                  ตำบลลิ่นถิ่น อำเภอทองผาภูมิ จังหวัดกาญจนบุรี
                  พร้อมทั้งแจงโครงการปุ๋ยคนละครึ่ง ณ หมู่ 6 ตำบลลิ่นถิ่น
                  อำเภอทองผาภูมิ จังหวัดกาญจนบุรี
                </p>
                <div
                  data-aos="fade-right"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  className="mt-6"
                >
                  <a href="">
                    <p className="text-indigo-700 underline text-base font-semibold f-m-m">
                      อ่านเพิ่มเติม
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:ml-8 ">
              <div className="lg:flex items-start mb-8">
                <img
                  data-aos="fade-left"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  src={News2}
                  className="w-40"
                />
                <div className="lg:ml-6">
                  <h1
                    data-aos="fade-left"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine"
                    className="f-m-m text-lg font-semibold leading-7 lg:mt-0 mt-8"
                  >
                    ประชุมหารือผลวิเคราะห์ข้อมูลปริมาณการผลิตสินค้าเกษตรด้านพืช
                    ระดับจังหวัด
                  </h1>
                  <p
                    data-aos="fade-left"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine"
                    className="text-xs f-m-m leading-loose mt-2"
                  >
                    วันที่ 18 กรกฎาคม 2567 นายจตุพร เกษตรอำเภอทองผาภูมิ
                    มอบหมายให้ นางสาวขนิษฐา บุญคำมา
                    นักวิชาการส่งเสริมการเกษตรชำนาญการ
                    เข้าร่วมประชุมหารือผลวิเคราะห์ข้อมูลปริมาณการผลิตสินค้าเกษตรด้านพืช
                    ระดับจังหวัด ครั้งที่ 1/2567
                  </p>
                  <div className="mt-4">
                    <a href="">
                      <p
                        data-aos="fade-left"
                        data-aos-offset="300"
                        data-aos-easing="ease-in-sine"
                        className="text-indigo-700 underline text-base font-semibold f-m-m"
                      >
                        อ่านเพิ่มเติม
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:flex items-start mb-8">
                <img
                  data-aos="fade-left"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  src={News3}
                  className="w-40"
                />
                <div
                  data-aos="fade-left"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  className="lg:ml-6"
                >
                  <h1 className="f-m-m text-lg font-semibold leading-7 lg:mt-0 mt-8">
                    กิจกรรมปลูกผักสวนครัวโครงการพัฒนาพื้นที่ต้นแบบ
                    เพื่อพัฒนาคุณภาพชีวิตฯ
                  </h1>
                  <p className="text-xs f-m-m leading-loose mt-2">
                    ณ ศูนย์พัฒนาอาชีพหนองบัว ต.หนองบัว อ.เมือง จ.กาญจนบุรี
                    ร่วมกิจกรรมปลูกผักสวนครัว ตามโครงการพัฒนาพื้นที่ต้นแบบ
                    เพื่อพัฒนาคุณภาพชีวิตแบบอารยเกษตรตามแนวพระราชดำริ
                  </p>
                  <div className="mt-4">
                    <a href="">
                      <p className="text-indigo-700 underline text-base font-semibold f-m-m">
                        อ่านเพิ่มเติม
                      </p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:flex items-start mb-8">
                <img
                  data-aos="fade-left"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  src={News4}
                  className="w-40"
                />
                <div
                  data-aos="fade-left"
                  data-aos-offset="300"
                  data-aos-easing="ease-in-sine"
                  className="lg:ml-6"
                >
                  <h1 className="f-m-m text-lg font-semibold leading-7 lg:mt-0 mt-8">
                    ให้บริการขึ้นทะเบียนเกษตรกรและปรับปรุงทะเบียนเกษตรกร ม.2
                    ต.สหกรณ์นิคม
                  </h1>
                  <p className="text-xs f-m-m leading-loose mt-2">
                    วันที่ 10 กรกฎาคม 2567 นายจตุพร อิ่มจิตร เกษตรอำเภอทองผาภูมิ
                    มอบหมายให้ นางสาวรัตนาพร เปรมปรีดิ์
                    นักวิชาการส่งเสริมการเกษตร และ นายสุทัศน์ สุขศีลล้ำเลิศ
                    นักวิชาการส่งเสริมการเกษตรปฏิบัติการ
                    ลงพื้นที่รับขึ้นทะเบียนเกษตรกร ณ หมู่ 2 ตำบลสหกรณ์นิคม
                    อำเภอทองผาภูมิ จังหวัดกาญจนบุรี พร้อมทั้งแจ้ง
                  </p>
                  <div className="mt-4">
                    <a href="">
                      <p className="text-indigo-700 underline text-base font-semibold f-m-m">
                        อ่านเพิ่มเติม
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>

      {/* ข่าวสาร End */}
      <Footer />
    </div>
  );
});
