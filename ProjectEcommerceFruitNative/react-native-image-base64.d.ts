declare module "react-native-image-base64" {
  interface ImageToBase64 {
    getBase64String: (uri: string) => Promise<string>;
    getBase64StringWithSize: (
      uri: string,
      width: number,
      height: number
    ) => Promise<string>;
  }

  const ImgToBase64: ImageToBase64;
  export default ImgToBase64;
}
