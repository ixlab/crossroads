import React, { PropTypes } from "react";

const Row = props => (
   <tr className={props.header ? "header-row" : ""}>
      {props.children.map((child, i) =>
         React.cloneElement(child, {
            key: i,
            header: props.header
         })
      )}
   </tr>
);

Row.propTypes = {
   header: PropTypes.bool
};

export default Row;
