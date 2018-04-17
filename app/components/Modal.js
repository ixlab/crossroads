// external modules
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

// custom modules
import ScrollHandler from "utils/scroll-handler";

/**
 * Abstract Modal Class
 */
class Modal extends Component {
   static propTypes = {
      modalId: PropTypes.string.isRequired,
      dismissable: PropTypes.bool.isRequired,
      dismiss: PropTypes.func
   };

   static defaultProps = {
      dismissable: true
   };

   constructor(props) {
      super(props);

      this.documentLevelWrapperId = `${
         props.modalId
      }-document-body-level-wrapper`;
      this.sh = new ScrollHandler(); // this is used to disable/enable scrolling as the modal comes and goes

      this.prepareForModal = this.prepareForModal.bind(this);
      this.handleContentClick = this.handleContentClick.bind(this);
      this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
   }

   prepareForModal() {
      // prevent the content behind the modal from scrolling;
      this.sh.disableScroll();

      // generate the document level wrapper
      const documentLevelWrapper = document.createElement("div");
      documentLevelWrapper.id = this.documentLevelWrapperId;
      document.body.appendChild(documentLevelWrapper);

      return documentLevelWrapper;
   }

   centerModal(documentLevelWrapper) {
      /**
			FIXME: this is erroneous because the children of the
			modal have rendered yet, so the height will be
			less here than in actuality assuming there is some
			child content
		*/
      const modal = documentLevelWrapper.querySelector(
         ".Modal__Outer > .Modal__Inner"
      );
      const diff = window.innerHeight - modal.getBoundingClientRect().height;

      if (diff > 0) modal.style.marginTop = diff / 2 + "px";
   }

   handleContentClick(event) {
      event.stopPropagation();
   }

   handleBackgroundClick(event) {
      event.stopPropagation();

      if (!this.props.dismissable) return;

      this.removeModal();
   }

   removeModal() {
      // call the dismiss callback if available
      if (this.props.dismiss) this.props.dismiss();

      // remove the modal (if it exists)
      const modal = document.getElementById(this.props.modalId);
      if (modal) modal.remove();

      // allow the content behind the modal to scroll
      this.sh.enableScroll();

      // remove the now unneeded document level container element
      document.getElementById(this.documentLevelWrapperId).remove();
   }

   render() {
      return <noscript />;
   }
}

/**
 * NOTE: has no redux connectivity
 */
class ModalComponent extends Modal {
   componentWillUnmount() {
      this.removeModal();
   }

   componentDidUpdate() {
      const modal = document.getElementById(this.props.modalId);
      if (modal) modal.remove();

      const documentLevelWrapper = this.prepareForModal();

      ReactDOM.render(
         <div
            id={this.props.modalId}
            className="Modal__Outer"
            onClick={this.handleBackgroundClick}
         >
            <div onClick={this.handleContentClick} className="Modal__Inner">
               {this.props.children}
            </div>
         </div>,
         documentLevelWrapper
      );

      this.centerModal(documentLevelWrapper);
   }
}

export default {
   Component: ModalComponent
};
