// import React, { useState } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";

// const products = [
//   { id: 1, name: "สมาร์ทโฟน", category: "อิเล็กทรอนิกส์", price: 15000 },
//   { id: 2, name: "แล็ปท็อป", category: "อิเล็กทรอนิกส์", price: 35000 },
//   { id: 3, name: "เสื้อยืด", category: "เสื้อผ้า", price: 300 },
//   { id: 4, name: "กางเกงยีนส์", category: "เสื้อผ้า", price: 1200 },
//   { id: 5, name: "หม้อหุงข้าว", category: "เครื่องใช้ในบ้าน", price: 2500 },
// ];

// const categories = [
//   "ทั้งหมด",
//   "อิเล็กทรอนิกส์",
//   "เสื้อผ้า",
//   "เครื่องใช้ในบ้าน",
// ];

// const TestScreen = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
//   const [priceRange, setPriceRange] = useState([0, 50000]);

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (selectedCategory === "ทั้งหมด" ||
//         product.category === selectedCategory) &&
//       product.price >= priceRange[0] &&
//       product.price <= priceRange[1]
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">สินค้าของเรา</h1>

//       <div className="mb-4 flex space-x-2">
//         <Input
//           type="text"
//           placeholder="ค้นหาสินค้า"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-grow"
//         />
//         <Button variant="outline">
//           <Search className="h-4 w-4" />
//         </Button>
//       </div>

//       <div className="mb-4 flex space-x-2">
//         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="เลือกหมวดหมู่" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((category) => (
//               <SelectItem key={category} value={category}>
//                 {category}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <div className="flex-grow">
//           <p className="mb-2">
//             ช่วงราคา: {priceRange[0]} - {priceRange[1]} บาท
//           </p>
//           <Slider
//             min={0}
//             max={50000}
//             step={100}
//             value={priceRange}
//             onValueChange={setPriceRange}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="border p-4 rounded">
//             <h2 className="text-lg font-semibold">{product.name}</h2>
//             <p>หมวดหมู่: {product.category}</p>
//             <p>ราคา: {product.price} บาท</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TestScreen;
