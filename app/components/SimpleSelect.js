import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Select extends Component {
   static propTypes = {
      value: PropTypes.string,
      style: PropTypes.object,
      options: PropTypes.array.isRequired,
      onChange: PropTypes.func.isRequired
   };

   constructor(props) {
      super(props);
   }

   render() {
      const { value, options, onChange, style } = this.props;

      return (
         <select value={value} onChange={onChange} style={style}>
            <option value={null}>none</option>
            {options.map(option => {
               let value, label;

               // only worried about values that are specifically undefined
               if (typeof option.value !== undefined) value = option.value;
               if (typeof option.label !== undefined) label = option.label;

               return (
                  <option
                     key={option.value || option}
                     value={option.value || option}
                  >
                     {option.label || option}
                  </option>
               );
            })}
         </select>
      );
   }
}
