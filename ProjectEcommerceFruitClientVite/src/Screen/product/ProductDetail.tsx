import { observer } from "mobx-react-lite";
import React from "react";
import { useLocation } from "react-router-dom";

const ProductDetail = () => {
  const { state } = useLocation();

  console.log("state", state);

  return <div>ProductDetail จ้าา</div>;
};

export default observer(ProductDetail);
