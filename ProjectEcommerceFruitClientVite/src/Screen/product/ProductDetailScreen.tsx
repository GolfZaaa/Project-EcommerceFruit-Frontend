import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useStore } from "../../store/store";
import { Button, Typography, Box } from "@mui/material";
import ToastAddToCart from "../../layout/component/ToastAddToCart";
import { pathImages } from "../../constants/RoutePath";

export default observer(function ProductDetailScreen() {
  const { getProductById, productDetail } = useStore().productStore;

  const { AddToCart, GetCartItemByUser } = useStore().cartStore;
  const [showToast, setShowToast] = useState(false);

  const [preViewImage, setPreViewImage] = useState(
    productDetail && pathImages.product + productDetail?.images
  );

  const { id } = useParams<{ id: any }>();

  useEffect(() => {
    const getProduct = async () => {
      await getProductById(id);
    };

    getProduct();
    setPreViewImage(
      productDetail && pathImages.product + productDetail?.images
    );
  }, [id]);

  const [quantity, setQuantity] = useState<number>(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    try {
      const ProductId = productDetail?.id;
      const Quantity = quantity;
      console.log("ProductId", ProductId, "Quantity", Quantity);
      const result = await AddToCart({ ProductId, Quantity });
      console.log("Reusult", result);
      if (result) {
        await GetCartItemByUser();
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);

        console.log("Successfully added to cart");
      } else {
        console.log("Failed to add to cart");
      }
      console.log(result);
    } catch (error) {
      alert("Failed to add product to cart.");
    }
  };

  console.log("productDetail", productDetail);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
      {showToast && <ToastAddToCart />}
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        <img
          className="w-full"
          alt="image main"
          src={pathImages.product + productDetail?.images}
        />
        <div className="flex mt-2 space-x-4">
          {productDetail?.productGI.images.map((item) => (
            <img
              alt="img-tag-one"
              className="md:w-24 md:h-24 "
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

          {/* <img
            alt="img-tag-one"
            className="md:w-24 md:h-24 "
            src="https://i.ibb.co/f17NXrW/Rectangle-244.png"
          /> */}
        </div>
      </div>

      <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">
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
          >
            {productDetail && productDetail?.productGI?.name}
          </h1>
        </div>
        <div>
          <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 mt-7">
            วัสดุ TPU
            ที่ใช้ในเคสนี้มีคุณสมบัติป้องกันการกระแทกที่ช่วยปกป้องโทรศัพท์ของคุณจากความเสียหายจากอุบัติเหตุที่เกิดจากการตกหล่นและการกระแทก
            นอกจากนี้ยังป้องกันฝุ่นทำให้โทรศัพท์ของคุณสะอาดสะอ้านและยังป้องกันฝุ่นละอองทำให้โทรศัพท์ของคุณสะอาดสะอ้านและสะอาดสะอ้าน
            ซิลิโคนนุ่มน่าสัมผัสทำให้จับและถือได้ง่าย
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600">
            ขายแล้ว : 100 ชิ้น
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600 mb-5">
            ราคาต่อกิโลกรัม : {productDetail?.price} บาท
          </p>

          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" onClick={decreaseQuantity} size="medium">
              -
            </Button>
            <Typography variant="body1">{quantity}</Typography>
            <Button variant="outlined" onClick={increaseQuantity} size="medium">
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
                  className={"transform " + (show ? "rotate-180" : "rotate-0")}
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
              วัสดุ TPU
              ที่ใช้ในเคสนี้มีคุณสมบัติป้องกันการกระแทกที่ช่วยปกป้องโทรศัพท์ของคุณจากความเสียหายจากอุบัติเหตุที่เกิดจากการตกหล่นและการกระแทก
              นอกจากนี้ยัง
            </div>
          </div>
        </div>
        <div>
          <div className="border-b py-4 border-gray-200">
            <div
              onClick={() => setShow2(!show2)}
              className="flex justify-between items-center cursor-pointer"
            >
              <p className="text-base leading-4 text-gray-800">ติดต่อ/สอบถาม</p>
              <button
                className="
									cursor-pointer
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
									rounded
								"
                aria-label="show or hide"
              >
                <svg
                  className={"transform " + (show2 ? "rotate-180" : "rotate-0")}
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
                (show2 ? "block" : "hidden")
              }
              id="sect"
            >
              วัสดุ TPU
              ที่ใช้ในเคสนี้มีคุณสมบัติป้องกันการกระแทกที่ช่วยปกป้องโทรศัพท์ของคุณจากความเสียหายจากอุบัติเหตุที่เกิดจากการตกหล่นและการกระแทก
              นอกจากนี้ยัง
            </div>
          </div>
        </div>
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
        >
          {/* <svg
            className="mr-3"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.02301 7.18999C7.48929 6.72386 7.80685 6.12992 7.93555 5.48329C8.06425 4.83666 7.9983 4.16638 7.74604 3.55724C7.49377 2.94809 7.06653 2.42744 6.51835 2.06112C5.97016 1.6948 5.32566 1.49928 4.66634 1.49928C4.00703 1.49928 3.36252 1.6948 2.81434 2.06112C2.26615 2.42744 1.83891 2.94809 1.58665 3.55724C1.33439 4.16638 1.26843 4.83666 1.39713 5.48329C1.52583 6.12992 1.8434 6.72386 2.30968 7.18999L4.66634 9.54749L7.02301 7.18999Z"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.66699 4.83333V4.84166"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.69 13.8567C14.1563 13.3905 14.4738 12.7966 14.6025 12.15C14.7312 11.5033 14.6653 10.8331 14.413 10.2239C14.1608 9.61476 13.7335 9.09411 13.1853 8.72779C12.6372 8.36148 11.9926 8.16595 11.3333 8.16595C10.674 8.16595 10.0295 8.36148 9.48133 8.72779C8.93314 9.09411 8.5059 9.61476 8.25364 10.2239C8.00138 10.8331 7.93543 11.5033 8.06412 12.15C8.19282 12.7966 8.51039 13.3905 8.97667 13.8567L11.3333 16.2142L13.69 13.8567Z"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.333 11.5V11.5083"
              stroke="white"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
});
