import { Button } from "@mui/material";
import React from "react";
import { observer } from "mobx-react-lite";
import { RoutePath } from "../constants/RoutePath";

export default function FirstScreen() {
  return (
    <div>
      <section
        style={{
          position: "relative",
          backgroundImage:
            "url(https://wallpapers.com/images/hd/full-4k-assorted-fruits-gbkgp9whmy8kpm0s.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to left, rgba(255, 255, 255, 0) -20%, rgb(255, 255, 255) 95%)",
          }}
        ></div>

        <div
          style={{
            position: "relative",
            margin: "0 auto ",
            maxWidth: "1280px",
            padding: "8rem 1rem",
          }}
        >
          <div
            style={{
              maxWidth: "50rem",
              marginLeft: 10,
            }}
          >
            <h1
              style={{
                fontSize: 40,
                fontWeight: "900",
                textShadow: "5px 2px 4px rgba(124, 255, 104, 0.5)",
                color: "#00b725",
              }}
            >
              สำนักงานเกษตรอำเภอทองผาภูมิ
              <strong
                style={{
                  display: "block",
                  fontWeight: "700",
                  color: "#00b725",
                  maxWidth: "37rem",
                  fontSize: 35,
                  textShadow: "5px 2px 4px rgba(124, 255, 104, 0.5)",
                }}
              >
                {" "}
                Thongphaphum District Agricultural Extension Office{" "}
              </strong>
            </h1>

            <p
              style={{
                marginTop: "1rem",
                maxWidth: "23rem",
                fontSize: 17.5,
                fontWeight: 500,
                color: "#000",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              ศูนย์กลางการตลาดเกษตร สร้างโอกาส เพิ่มรายได้ พัฒนาเศรษฐกิจชุมชน
              สู่ความสำเร็จที่ยั่งยืน
            </p>

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <Button
                variant="contained"
                href={RoutePath.homeScreen}
                style={{ backgroundColor: "#00973c", color: "#fff" }}
              >
                เริ่มต้นการใช้งาน
              </Button>

              <Button
                variant="contained"
                href="#"
                style={{ backgroundColor: "#00973c", color: "#fff" }}
              >
                เรียนรู้เพิ่มเติม
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
