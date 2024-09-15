import React from "react";
import Switch from "@mui/joy/Switch";
import Typography from "@mui/joy/Typography";

export const MySwitch = ({ handleChange, checked }: any) => {
  return (
    <Switch
      onClick={handleChange}
      defaultChecked={checked}
      slotProps={{
        track: {
          children: (
            <React.Fragment>
              <Typography component="span" level="inherit" sx={{ ml: "5px" }}>
                เปิด
              </Typography>
              <Typography component="span" level="inherit" sx={{ mr: "8px" }}>
                ปิด
              </Typography>
            </React.Fragment>
          ),
        },
      }}
      sx={{
        "--Switch-thumbSize": "27px",
        "--Switch-trackWidth": "74px",
        "--Switch-trackHeight": "31px",
      }}
    />
  );
};
