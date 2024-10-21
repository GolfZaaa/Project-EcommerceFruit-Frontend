interface fontSizeOptions {
  smaller: string;
  small: string;
  normal: string;
  large: string;
  larger: string;
}

interface MyContentProps {
  name: string | number | undefined | null;
  fontSize: keyof fontSizeOptions;
}

export default function MyContent({ name, fontSize }: MyContentProps) {
  const ConvertSize: any = {
    smaller: 15,
    small: 19,
    normal: 25,
    large: 35,
    larger: 50,
  };

  return <div style={{ fontSize: ConvertSize[fontSize] }}>{name}</div>;
}
