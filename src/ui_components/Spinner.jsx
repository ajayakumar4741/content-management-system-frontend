import React from "react";
import { ClipLoader } from "react-spinners";

function Spinner() {
  const size = window.innerWidth < 640 ? 40 : 460;

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
  };

  return (
    <ClipLoader
      cssOverride={override}
      size={size}
      color="green"
      aria-label="Loading Spinner"
    />
  );
}

export default Spinner;
