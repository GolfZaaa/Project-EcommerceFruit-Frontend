import React from "react";

export default function MyContent({
  name,
  fontSize,
}: {
  name: string;
  fontSize: string;
}) {

  const ConvertSize:any = {
    small: 15,
    normal:25,
    large: 50,
  };
 
  return <div style={{ fontSize: ConvertSize[fontSize] }}>{name}</div>;
}
