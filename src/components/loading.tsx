import { CircularProgress } from "@mui/material";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20 z-10">
      <CircularProgress color="primary" size={200} />
    </div>
  );
};

export default Loading;

