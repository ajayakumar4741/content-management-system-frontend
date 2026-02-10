import React from "react";
import { ClipLoader } from "react-spinners";

function Spinner() {
  const size = window.innerWidth < 640 ? 40 : 60;

  return (
    <ClipLoader
      size={size}
      color="green"
      aria-label="Loading Spinner"
    />
  );
}

export default Spinner;
