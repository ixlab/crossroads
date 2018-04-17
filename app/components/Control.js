// external modules
import React, { Component, PropTypes } from "react";
import UndoIcon from "react-icons/lib/md/arrow-back";
import RedoIcon from "react-icons/lib/md/arrow-forward";

/// @abstract an abstract class for creating Controls
class BaseControl extends Component {
   static propTypes = {
      className: PropTypes.string,
      icon: PropTypes.element,
      helpText: PropTypes.string,
      collapsed: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired
   };

   static defaultProps = {
      collapsed: false
   };

   constructor(props) {
      super(props);

      this.state = {
         collapsed: this.props.collapsed
      };
   }

   /// @abstract Determines whether or not the component can be collapsed
   isCollapseable() {
      return false;
   }

   /// @abstract Returns the modifier for the control
   getModifier() {
      return "";
   }

   toggleCollapsed() {
      this.setState({ collapsed: !this.state.collapsed });
   }

   render() {
      const mod = this.getModifier();
      const classNames = [`Control--${mod}`];
      const { icon: Icon } = this.props;
      if (this.props.className) classNames.push(this.props.name);

      return (
         <div className={classNames.join(" ")}>
            {!!Icon && !!this.props.helpText ? (
               <span className={`Control__Title--${mod} IconPopover`}>
                  {this.props.title}
                  {React.cloneElement(Icon, {
                     size: 18,
                     className: "Icon--interactive IconPopover__Icon"
                  })}
                  <p className="IconPopover__Popover">{this.props.helpText}</p>
               </span>
            ) : (
               <p className={`Control__Title--${mod}`}>{this.props.title}</p>
            )}
            {(this.props.undoAction || this.props.redoAction) && (
               <div className="Control__UndoRedo">
                  {this.props.undoAction && (
                     <div
                        className="Control__Undo"
                        onClick={this.props.undoAction}
                     >
                        <UndoIcon className="dark-icon" size={14} />
                     </div>
                  )}
                  {this.props.redoAction && (
                     <div
                        className="Control__Redo"
                        onClick={this.props.redoAction}
                     >
                        <RedoIcon className="dark-icon" size={14} />
                     </div>
                  )}
               </div>
            )}
            {this.isCollapseable() && (
               <div
                  className={`Control__Toggle Control__Toggle--${mod} Control__Toggle--${
                     this.state.collapsed ? "collapsed" : "expanded"
                  }`}
                  onClick={this.toggleCollapsed.bind(this)}
               >
                  {this.state.collapsed ? "+" : "-"}
               </div>
            )}
            <div
               className="Control__Content"
               style={{
                  display: this.state.collapsed ? "none" : "block"
               }}
            >
               {this.props.children}
            </div>
         </div>
      );
   }
}

class MainControl extends BaseControl {
   isCollapseable() {
      return true;
   }

   getModifier() {
      return "main";
   }
}

class SubControl extends BaseControl {
   isCollapseable() {
      return true;
   }

   getModifier() {
      return "sub";
   }
}

class SuperSubControl extends BaseControl {
   isCollapseable() {
      return false;
   }

   getModifier() {
      return "supersub";
   }
}

export default {
   Main: MainControl,
   Sub: SubControl,
   SuperSub: SuperSubControl
};
