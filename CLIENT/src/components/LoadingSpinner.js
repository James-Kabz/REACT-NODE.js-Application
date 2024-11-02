import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loading-screen">
      <div className="spinner">
        {/* Simple CSS spinner or you can use any spinner library */}
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default LoadingSpinner;
