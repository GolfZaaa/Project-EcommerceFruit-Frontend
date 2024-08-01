import { Button } from '@mui/material'
import React from 'react'

export default function NotFoundScreen() {
  return (
    <div>
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <img
        src="https://friutt06.wordpress.com/wp-content/uploads/2017/08/e0b895e0b8a5e0b8b2e0b894e0b89ce0b8a5e0b984e0b8a1e0b989-e0b888-e0b888e0b8b1e0b899e0b897e0b89ae0b8b8e0b8a3e0b8b5.jpg?w=1200"
        alt=""
        style={{ height: "16rem", width: "100%", objectFit: "cover" }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            margin: "auto",
            maxWidth: "36rem",
            padding: "2rem 1rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              letterSpacing: "-0.025em",
              color: "#111827",
            }}
          >
            เราไม่สามารถค้นพบหน้าเว็บที่ท่านต้องการได้
          </h1>
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
          โปรดลองค้นหาอีกครั้ง หรือกลับไปยังหน้าหลักเพื่อเริ่มต้นใหม่
          </p>
          <Button variant="contained">กลับสู่หน้าหลัก</Button>
        </div>
      </div>
    </div>
  </div>
  )
}
