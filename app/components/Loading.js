import React, { PropTypes } from "react";

const Loading = ({ text = "Loading..." }) => (
   <div className="jumbotron">
      <div className="jumbotron-content">
         <div className="loader loader-xl" />
         <h3 className="text-center">{text}</h3>
      </div>
   </div>
);

Loading.propTypes = {
   text: PropTypes.string
};

export default Loading;
