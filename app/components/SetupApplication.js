// external modules
import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// custom modules
import { sqlUtils } from "utils";

class SetupApplication extends Component {
   static contextTypes = { router: PropTypes.object };

   componentWillMount() {
      axios
         .get("/api/data-upload/retrieve-sqlite")
         .then(res => {
            const { query: { next = "/" } = {} } = this.props.location;

            if (res.status === 204) {
               sqlUtils
                  .initializeDB()
                  .then(res => {
                     this.context.router.push(next);
                  })
                  .catch(err => {
                     console.error(err);
                     this.context.router.push("/uh-oh");
                  });
            } else {
               window.db = new SQL.Database(new Uint8Array(res.data.db.data));
               this.context.router.push(next);
            }
         })
         .catch(err => {
            console.error(err);
            this.context.router.push("/uh-oh");
         });
   }

   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div className="jumbotron">
            <div className="jumbotron-content">
               <div className="loader loader-xl" />
               <h3 className="text-center">Setting Up Application...</h3>
            </div>
         </div>
      );
   }
}

export default SetupApplication;
