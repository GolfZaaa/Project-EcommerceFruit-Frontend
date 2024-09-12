import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useStore } from "../../store/store";
import { Button, Typography, Box } from "@mui/material";
import ToastAddToCart from "../../layout/component/ToastAddToCart";
import { pathImages } from "../../constants/RoutePath";

export default observer(function ProductDetailScreen() {
  const { getProductById, productDetail, DeleteProduct, getProduct } =
    useStore().productStore;
  const { user } = useStore().userStore;

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
      const result = await AddToCart({ ProductId, Quantity });
      if (result) {
        await GetCartItemByUser();
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
        // console.log("Successfully added to cart");
      } else {
        // console.log("Failed to add to cart");
      }
      // console.log(result);
    } catch (error) {
      alert("Failed to add product to cart.");
    }
  };

  console.log("productDetail", productDetail);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const hanldleDelete = async (productid: any) => {
    await DeleteProduct(productid);
    await getProductById(productid);
  };

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
        </div>
      </div>

      <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
        <div className="border-b border-gray-200 pb-6 flex justify-between">
          <div>
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

          {user && user?.id == productDetail?.productGI?.store?.userId && (
            <div>
              <button
                onClick={() => hanldleDelete(productDetail.id)}
                className={`p-2 ${
                  productDetail?.status
                    ? "bg-red-500 text-gray-700"
                    : "bg-green-400"
                } font-semibold rounded-2xl pl-5 pr-5`}
              >
                {productDetail?.status ? "ปิดการขาย" : "เปิดการขาย"}
              </button>
            </div>
          )}
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
        </button>
      </div>
    </div>
  );
});
