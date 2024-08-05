import React from 'react'

export default function FirstScreenNew() {
  return (
    <div>


        {/* สินค้าล่าสุด Start */}
        <div className="xl:mx-auto xl:container">
            <div className="lg:px-20 md:px-6 px-4 md:py-12 py-8">
                <div className="flex flex-col-reverse lg:flex-row items-center">
                    <div className="w-full lg:w-1/2 md:py-9 py-6">
                        <img src="https://cdn.tuk.dev/assets/templates/e-commerce-kit/luxe2.png" alt="bag" className="lg:w-full h-full object-cover object-center w-full" />
                    </div>
                    <div className="lg:w-1/2 lg:pl-12 lg:pr-24">
                        <p className="text-sm leading-none text-gray-600 pb-2">Featured</p>
                        <p className="md:text-3xl lg:text-4xl text-2xl font-semibold lg:leading-9 text-gray-800 lg:pb-6 md:pb-4 pb-2">Luxe New York Streak</p>
                        <p className="text-sm leading-5 text-gray-600 md:pb-10 pb-8">Start off the new year by hitting the ground running with this purpose built workman’s bag. A culmination of productivity and luxury</p>
                        <div className="md:block flex items-center justify-center">
                            <button className="lg:w-auto w-full border border-gray-800 hover:text-gray-50 hover:bg-gray-800 focus:outline-none lg:px-10 px-7 lg:py-4 py-3 text-sm leading-none text-gray-800">Shop best sellers</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* สินค้าล่าสุด End */}

        {/* สินค้าขายดี Start */}
        <div className="2xl:mx-auto 2xl:container px-4 md:px-6 2xl:px-0 py-16 flex justify-center">
            <div className="fle flex-col justify-center items-center">
                <div className="flex justify-start items-start">
                    <p className="text-3xl lg:text-4xl font-semibold leading-9 text-gray-800">Featured items</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 justify-items-between mt-8 gap-y-8 lg:gap-y-0 gap-x-8">
                    <div className="flex items-start flex-col">
                        <div className="relative flex justify-center items-center bg-gray-100 py-12 px-16">
                            <img src="https://i.ibb.co/9HKkSpP/Rectangle-49.png" alt="mobile" />
                            <button className="absolute top-4 right-4 flex justify-center items-center p-3.5 bg-white rounded-full">
                                <svg className="fill-stroke text-gray-600 hover:text-gray-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.00002 6.59999V5.39999C6.00002 4.44521 6.37931 3.52953 7.05444 2.8544C7.72957 2.17927 8.64525 1.79999 9.60003 1.79999V1.79999C10.5548 1.79999 11.4705 2.17927 12.1456 2.8544C12.8207 3.52953 13.2 4.44521 13.2 5.39999V6.59999M3.00002 6.59999C2.84089 6.59999 2.68828 6.6632 2.57576 6.77572C2.46324 6.88825 2.40002 7.04086 2.40002 7.19999V15.3C2.40002 16.434 3.36602 17.4 4.50002 17.4H14.7C15.834 17.4 16.8 16.4809 16.8 15.3469V7.19999C16.8 7.04086 16.7368 6.88825 16.6243 6.77572C16.5118 6.6632 16.3592 6.59999 16.2 6.59999H3.00002Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M6 8.40002V9.00002C6 9.9548 6.37928 10.8705 7.05442 11.5456C7.72955 12.2207 8.64522 12.6 9.6 12.6C10.5548 12.6 11.4705 12.2207 12.1456 11.5456C12.8207 10.8705 13.2 9.9548 13.2 9.00002V8.40002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col items-start jusitfy-start mt-3 space-y-3">
                            <div>
                                <p className="text-lg font-medium leading-4 text-gray-800">iPhone XS</p>
                            </div>
                            <div>
                                <p className="text-lg leading-4 text-gray-600">$790</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start flex-col">
                        <div className="relative flex justify-center items-center bg-gray-100 py-12 px-16">
                            <img src="https://i.ibb.co/z7jvmjp/Rectangle-49-1.png" alt="headphones" />
                            <button className="absolute top-4 right-4 flex justify-center items-center p-3.5 bg-white rounded-full">
                                <svg className="fill-stroke text-gray-600 hover:text-gray-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.00002 6.59999V5.39999C6.00002 4.44521 6.37931 3.52953 7.05444 2.8544C7.72957 2.17927 8.64525 1.79999 9.60003 1.79999V1.79999C10.5548 1.79999 11.4705 2.17927 12.1456 2.8544C12.8207 3.52953 13.2 4.44521 13.2 5.39999V6.59999M3.00002 6.59999C2.84089 6.59999 2.68828 6.6632 2.57576 6.77572C2.46324 6.88825 2.40002 7.04086 2.40002 7.19999V15.3C2.40002 16.434 3.36602 17.4 4.50002 17.4H14.7C15.834 17.4 16.8 16.4809 16.8 15.3469V7.19999C16.8 7.04086 16.7368 6.88825 16.6243 6.77572C16.5118 6.6632 16.3592 6.59999 16.2 6.59999H3.00002Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M6 8.40002V9.00002C6 9.9548 6.37928 10.8705 7.05442 11.5456C7.72955 12.2207 8.64522 12.6 9.6 12.6C10.5548 12.6 11.4705 12.2207 12.1456 11.5456C12.8207 10.8705 13.2 9.9548 13.2 9.00002V8.40002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col items-start jusitfy-start mt-3 space-y-3">
                            <div>
                                <p className="text-lg font-medium leading-4 text-gray-800">Beats earphones</p>
                            </div>
                            <div>
                                <p className="text-lg leading-4 text-gray-600">$245</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start flex-col">
                        <div className="relative flex justify-center items-center bg-gray-100 py-12 px-16">
                            <img src="https://i.ibb.co/sFWSWKz/Rectangle-49-2.png" alt="camera" />
                            <button className="absolute top-4 right-4 flex justify-center items-center p-3.5 bg-white rounded-full">
                                <svg className="fill-stroke text-gray-600 hover:text-gray-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.00002 6.59999V5.39999C6.00002 4.44521 6.37931 3.52953 7.05444 2.8544C7.72957 2.17927 8.64525 1.79999 9.60003 1.79999V1.79999C10.5548 1.79999 11.4705 2.17927 12.1456 2.8544C12.8207 3.52953 13.2 4.44521 13.2 5.39999V6.59999M3.00002 6.59999C2.84089 6.59999 2.68828 6.6632 2.57576 6.77572C2.46324 6.88825 2.40002 7.04086 2.40002 7.19999V15.3C2.40002 16.434 3.36602 17.4 4.50002 17.4H14.7C15.834 17.4 16.8 16.4809 16.8 15.3469V7.19999C16.8 7.04086 16.7368 6.88825 16.6243 6.77572C16.5118 6.6632 16.3592 6.59999 16.2 6.59999H3.00002Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M6 8.40002V9.00002C6 9.9548 6.37928 10.8705 7.05442 11.5456C7.72955 12.2207 8.64522 12.6 9.6 12.6C10.5548 12.6 11.4705 12.2207 12.1456 11.5456C12.8207 10.8705 13.2 9.9548 13.2 9.00002V8.40002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col items-start jusitfy-start mt-3 space-y-3">
                            <div>
                                <p className="text-lg font-medium leading-4 text-gray-800">Digital camera</p>
                            </div>
                            <div>
                                <p className="text-lg leading-4 text-gray-600">$330</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start flex-col">
                        <div className="relative flex justify-center items-center bg-gray-100 py-12 px-16">
                            <img src="https://i.ibb.co/x5xbLxB/Rectangle-49-3.png" alt="speaker" />
                            <button className="absolute top-4 right-4 flex justify-center items-center p-3.5 bg-white rounded-full">
                                <svg className="fill-stroke text-gray-600 hover:text-gray-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.00002 6.59999V5.39999C6.00002 4.44521 6.37931 3.52953 7.05444 2.8544C7.72957 2.17927 8.64525 1.79999 9.60003 1.79999V1.79999C10.5548 1.79999 11.4705 2.17927 12.1456 2.8544C12.8207 3.52953 13.2 4.44521 13.2 5.39999V6.59999M3.00002 6.59999C2.84089 6.59999 2.68828 6.6632 2.57576 6.77572C2.46324 6.88825 2.40002 7.04086 2.40002 7.19999V15.3C2.40002 16.434 3.36602 17.4 4.50002 17.4H14.7C15.834 17.4 16.8 16.4809 16.8 15.3469V7.19999C16.8 7.04086 16.7368 6.88825 16.6243 6.77572C16.5118 6.6632 16.3592 6.59999 16.2 6.59999H3.00002Z"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M6 8.40002V9.00002C6 9.9548 6.37928 10.8705 7.05442 11.5456C7.72955 12.2207 8.64522 12.6 9.6 12.6C10.5548 12.6 11.4705 12.2207 12.1456 11.5456C12.8207 10.8705 13.2 9.9548 13.2 9.00002V8.40002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col items-start jusitfy-start mt-3 space-y-3">
                            <div>
                                <p className="text-lg font-medium leading-4 text-gray-800">Wireless speakers</p>
                            </div>
                            <div>
                                <p className="text-lg leading-4 text-gray-600">$140</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* สินค้าขายดี End */}

        {/* Card Start */}
        <div className="2xl:container 2xl:mx-auto lg:px-20 md:py-12 md:px-6 py-9 px-4">
            <div className=" grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 gap-6 ">
                {/* Safe Shopping Grid Card */}
                <div className=" p-6 bg-gray-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 3H13M12 7V3V7Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.6569 4.92871L19.0711 6.34292M15.5355 8.46424L18.364 5.63582L15.5355 8.46424Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 11V13M17 12H21H17Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.071 17.6572L17.6568 19.0714M15.5355 15.5359L18.3639 18.3643L15.5355 15.5359Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 21H11M12 17V21V17Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.34314 19.0713L4.92893 17.6571M8.46446 15.5358L5.63603 18.3642L8.46446 15.5358Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 13L3 11M7 12H3H7Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.92896 6.34277L6.34317 4.92856M8.46449 8.46409L5.63606 5.63567L8.46449 8.46409Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className=" text-xl text-gray-800 font-semibold leading-5 mt-6">Safe Shopping</p>
                    <p className=" font-normal text-base leading-6 text-gray-600 my-4">Our all outlets have industry-leading health precautions</p>
                    <a className=" cursor-pointer text-base leading-4 font-medium text-gray-800 border-b-2 border-gray-800 hover:text-gray-600 ">Learn More</a>
                </div>

                {/* Personal Shopping Grid Card */}
                <div className=" p-6 bg-gray-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21H21" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                            d="M3 7V8C3 8.79565 3.31607 9.55871 3.87868 10.1213C4.44129 10.6839 5.20435 11 6 11C6.79565 11 7.55871 10.6839 8.12132 10.1213C8.68393 9.55871 9 7.79565 9 7M3 7H9M3 7H21M3 7L5 3H19L21 7M9 7C9 7.79565 9.31607 9.55871 9.87868 10.1213C10.4413 10.6839 11.2044 11 12 11C12.7956 11 13.5587 10.6839 14.1213 10.1213C14.6839 9.55871 15 8.79565 15 8M9 7H15V8M15 8C15 8.79565 15.3161 9.55871 15.8787 10.1213C16.4413 10.6839 17.2044 11 18 11C18.7956 11 19.5587 10.6839 20.1213 10.1213C20.6839 9.55871 21 8.79565 21 8V7"
                            stroke="#1F2937"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M5 20.9996V10.8496" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 20.9996V10.8496" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 21V17C9 16.4696 9.21071 15.9609 9.58579 15.5858C9.96086 15.2107 10.4696 15 11 15H13C13.5304 15 14.0391 15.2107 14.4142 15.5858C14.7893 15.9609 15 16.4696 15 17V21" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className=" text-xl text-gray-800 font-semibold leading-5 mt-6">Personal Shopping</p>
                    <p className=" font-normal text-base leading-6 text-gray-600 my-4">Contact your local outlet to book a personal appointment</p>
                    <a className=" cursor-pointer text-base leading-4 font-medium text-gray-800 border-b-2 border-gray-800 hover:text-gray-600 ">Learn More</a>
                </div>

                {/* Free Shopping Grid Card */}
                <div className=" p-6 bg-gray-50">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                            <path d="M18.4142 12.7573L21.2426 9.92886C21.6177 9.55378 22.1264 9.34307 22.6568 9.34307C23.1873 9.34307 23.696 9.55378 24.071 9.92886C24.4461 10.3039 24.6568 10.8126 24.6568 11.3431C24.6568 11.8735 24.4461 12.3822 24.071 12.7573L21.2426 15.5857L23.3639 23.3639L21.2426 25.4852L17.7071 19.1212L14.8786 21.9497V24.7781L12.7573 26.8994L11.3431 22.6568L7.10048 21.2426L9.2218 19.1212H12.0502L14.8786 16.2928L8.51469 12.7573L10.636 10.636L18.4142 12.7573Z" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </svg>
                    <p className=" text-xl text-gray-800 font-semibold leading-5 mt-6">Free Shipping</p>
                    <p className=" font-normal text-base leading-6 text-gray-600 my-4">Free shipping all over the world on orders above $100</p>
                    <a className=" cursor-pointer text-base leading-4 font-medium text-gray-800 border-b-2 border-gray-800 hover:text-gray-600 ">Learn More</a>
                </div>
            </div>
        </div>
        {/* Card End */}

        {/* สเตตัส Start */}
        <div className="mt-7 mx-5">
      <div className="pb-20">
        <div className="mx-auto bg-gradient-to-l from-indigo-600 to-indigo-700 h-96">
          <div className="mx-auto container w-full flex flex-col justify-center items-center">
            <div className="flex justify-center items-center flex-col">
              <div className="mt-20">
                <h2 className="lg:text-6xl md:text-5xl text-4xl font-black leading-10 text-white">By the numbers</h2>
              </div>
              <div className="mt-6 mx-2 md:mx-0 text-center">
                <p className="lg:text-lg md:text-base leading-6 text-sm  text-white">5 years, consistent quality and you get results. No matter what</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto container md:-mt-28 -mt-20 flex justify-center items-center">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-x-2 gap-y-2 lg:gap-x-6 md:gap-x-6 md:gap-y-6 md:gap-y-6">
            <div className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl">
              <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">40+</h2>
              <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">Happy Clients</p>
            </div>
            <div className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl">
              <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">540+</h2>
              <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">Projects Completed</p>
            </div>
            <div className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl">
              <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">300</h2>
              <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">Dedicated Members</p>
            </div>
            <div className="flex justify-center flex-col items-center w-36 h-36 md:w-44 md:h-48 lg:w-56 lg:h-56 bg-white shadow rounded-2xl">
              <h2 className="lg:text-5xl md:text-4xl text-2xl font-extrabold leading-10 text-center text-gray-800">25+</h2>
              <p className="mt-4 text-sm md:text-base lg:text-lg leading-none text-center text-gray-600">Awards Won</p>
            </div>
          </div>
        </div>
      </div>
        </div>
        {/* สเตตัส End */}



        {/* ข่าวสาร Start */}
        <div className="container mx-auto px-4">
                <h1 className="text-5xl text-center f-m-w text-indigo-700 font-bold pt-0">ข่าวประชาสัมพันธ์</h1>
                <div className="pt-14 xl:px-0 px-4">
                    <div className="w-full lg:flex">
                        <div className="lg:w-1/2">
                            <img src="https://cdn.tuk.dev/assets/components/111220/blg-17/blog1.png" className="w-full" />
                            <div className="mt-8 lg:mb-0 mb-8">
                                <h1 className="f-m-m text-lg font-semibold leading-7">Beautiful Italy, Travel Blog</h1>
                                <p className="text-xs f-m-m leading-loose mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                <div className="mt-6">
                                    <a href="">
                                        <p className="text-indigo-700 underline text-base font-semibold f-m-m">อ่านเพิ่มเติม</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 lg:ml-8">
                            <div className="lg:flex items-start mb-8">
                                <img src="https://cdn.tuk.dev/assets/components/111220/blg-17/blog2.png" className="w-40" />
                                <div className="lg:ml-6">
                                    <h1 className="f-m-m text-lg font-semibold leading-7 lg:mt-0 mt-8">A Broken Backpack</h1>
                                    <p className="text-xs f-m-m leading-loose mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                    <div className="mt-4">
                                        <a href="">
                                            <p className="text-indigo-700 underline text-base font-semibold f-m-m">อ่านเพิ่มเติม</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:flex items-start mb-8">
                                <img src="https://cdn.tuk.dev/assets/components/111220/blg-17/blog3.png" className="w-40" />
                                <div className="lg:ml-6">
                                    <h1 className="f-m-m text-lg font-semibold leading-7 lg:mt-0 mt-8">My life’s a Movie</h1>
                                    <p className="text-xs f-m-m leading-loose mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                    <div className="mt-4">
                                        <a href="">
                                            <p className="text-indigo-700 underline text-base font-semibold f-m-m">อ่านเพิ่มเติม</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:flex items-start mb-8">
                                <img src="https://cdn.tuk.dev/assets/components/111220/blg-17/blog4.png" className="w-40" />
                                <div className="lg:ml-6">
                                    <h1 className="f-m-m text-lg font-semibold leading-7 lg:mt-0 mt-8">Lilii’s Travel Plans</h1>
                                    <p className="text-xs f-m-m leading-loose mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                    <div className="mt-4">
                                        <a href="">
                                            <p className="text-indigo-700 underline text-base font-semibold f-m-m">อ่านเพิ่มเติม</p>
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
    </div>
  )
}
