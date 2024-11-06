import { ActivityIndicator } from "react-native";
import React from "react";

interface size {
  small: string;
  large: string;
}

interface props {
  size: keyof size;
}

const MyActivityIndicator = ({ size }: props) => (
  <ActivityIndicator size={size} />
);

export default MyActivityIndicator;
