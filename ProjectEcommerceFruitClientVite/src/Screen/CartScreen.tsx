import React from "react";
// import { BsShop } from "react-icons/bs";
import Navbar from "../layout/screen/Navbar";
import Footer from "../layout/screen/Footer";

export default function CartScreen() {
  return (
    <div style={{ backgroundColor: "#fbfbfb" }}>
      <Navbar />
      <div>
        <div className="cart-screen">
          <div className="cart-item-all">
            <div style={{ marginBottom: 13, marginLeft: 15 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <BsShop size={20} style={{ marginRight: "8px" }} /> */}
                <p style={{ marginTop: 5 }}>ชื่อร้านค้า</p>
              </div>
            </div>
            <div
              className="fontcarth1"
              style={{
                borderBottom: "1px solid #000",
                display: "flex",
                marginBottom: 5,
              }}
            ></div>
            <div className="cart-item">
              <img
                src="https://img.wongnai.com/p/1920x0/2021/05/17/32ad7f16089441f78d0f14947563dc3d.jpg"
                alt="OPPO Reno 11 case"
              />
              <div
                className="item-details"
                style={{
                  display: "flex",
                  gap: "16px",
                }}
              >
                <h2 style={{ flex: "1", textAlign: "left" }}>ทุเรียน</h2>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h2>น้ำหนัก</h2>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h2>฿68</h2>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      fontSize: "20px",
                      cursor: "pointer",
                      height: 30,
                      width: 30,
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontSize: "20px",
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    2
                  </span>
                  <button
                    style={{
                      fontSize: "20px",
                      cursor: "pointer",
                      height: 30,
                      width: 30,
                    }}
                  >
                    +
                  </button>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h2>฿100</h2>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h2>ลบ</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
