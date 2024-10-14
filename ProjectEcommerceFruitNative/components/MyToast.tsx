import { ToastAndroid } from "react-native";

export const Mytoast = (name: string) => {
  ToastAndroid.showWithGravityAndOffset(
    name,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
};
