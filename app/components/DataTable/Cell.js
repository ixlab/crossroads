import React, { PropTypes } from "react";

const Cell = props =>
   props.header ? (
      <th className="bold">{props.content}</th>
   ) : (
      <td>{props.content}</td>
   );

Cell.propTypes = {
   header: PropTypes.bool,
   content: PropTypes.any
};

export default Cell;
