import React from "react";

export default function MyContent({
  name,
  fontSize,
}: {
  name: any;
  fontSize: string;
}) {

  const ConvertSize:any = {
    smaller: 15,
    small: 18,
    normal:25,
    large: 50,
  };
 
  return <div style={{ fontSize: ConvertSize[fontSize] }}>{name}</div>;
}
