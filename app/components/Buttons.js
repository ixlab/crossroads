import React, { Component } from "react";
import PropTypes from "prop-types";

export class CompanionButton extends Component {
   static propTypes = {
      onClick: PropTypes.func,
      onCompanionSelect: PropTypes.func.isRequired,
      buttonText: PropTypes.string,
      companionIcon: PropTypes.element,
      disabled: PropTypes.bool.isRequired,
      companionOptions: PropTypes.arrayOf(
         PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired
         })
      ).isRequired
   };

   static defaultProps = {
      disabled: false,
      companionOptions: [],
      onCompanionSelect: () => {}
   };

   constructor(props) {
      super(props);
      this.state = {
         menuActive: false
      };
   }

   toggleCompanionMenu() {
      this.setState({ menuActive: !this.state.menuActive });
   }

   companionSelected(opt) {
      this.props.onCompanionSelect(opt);
      this.setState({ menuActive: false });
   }

   render() {
      return (
         <div className="btn-wrapper margin-right--md">
            <button
               type="button"
               className="btn has-companion no-margin-right"
               disabled={this.props.disabled}
               onClick={this.props.onClick}
            >
               {this.props.buttonText}
            </button>
            <button
               type="button"
               className="btn--companion"
               disabled={this.props.disabled}
               onClick={this.toggleCompanionMenu.bind(this)}
            >
               {!this.props.disabled && this.props.companionIcon}
            </button>
            {this.state.menuActive && (
               <div className="companion-menu">
                  {this.props.companionOptions.map(opt => (
                     <div
                        key={opt.value}
                        className="companion-menu__item"
                        onClick={() => this.companionSelected(opt)}
                     >
                        {opt.label}
                     </div>
                  ))}
               </div>
            )}
         </div>
      );
   }
}
