import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { pathImages } from "../../constants/RoutePath";

function DropZoneImageComponent({ image = null, onImageUpload }: any) {
  const [imageUri, setImageUri] = useState<any>(null);

  const onDrop: any = (acceptedFiles: any) => {
    console.log("Files dropped:", acceptedFiles);
    const file = acceptedFiles[0];
    if (file) {
      const fileInfo: any = {
        uri: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      };
      setImageUri(fileInfo);
      onImageUpload(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  console.log("imageUri", imageUri);

  return (
    <div>
      <div>
        <div
          {...getRootProps()}
          className="dropzoneStyle"
          style={{ marginLeft: "-80px" }}
        >
          <input {...getInputProps()} />
          {image && imageUri === null ? (
            <img
              src={pathImages.product + image}
              alt="product-image"
              style={{ objectFit: "contain" }}
            />
          ) : imageUri ? (
            <img
              src={imageUri.uri}
              alt="Selected"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <IoCloudUploadOutline size={60} style={{ color: "gray" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DropZoneImageComponent;
