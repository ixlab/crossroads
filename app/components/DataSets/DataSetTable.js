// external modules
import React, { Component } from "react";

// custom modules
import DataTable from "components/DataTable";

class DataSetTable extends Component {
   componentWillMount() {
      new Promise((resolve, reject) => {
         const { table_name: tableName } = this.props.location.query;
         const res = db.exec(`SELECT * FROM ${tableName}`)[0];

         console.log("done (pre-resolved)");
         resolve({
            data: res.values,
            cols: res.columns
         });
      })
         .then(data => {
            console.log("done (resolved)");
            this.setState({
               loading: false,
               data
            });
         })
         .catch(err => {
            console.error(err);
            this.setState({ loading: false });
         });
   }

   constructor(props) {
      super(props);

      this.state = {
         loading: true,
         data: null
      };
   }

   getDataTable() {
      if (this.state.data) {
         const { data, cols } = this.state.data;
         return (
            <div className="jumbotron-scrollable">
               <div className="jumbotron-content" style={{ maxWidth: "850px" }}>
                  <h2>
                     Data for{" "}
                     <span className="bold">
                        {this.props.location.query.table_name}
                     </span>
                  </h2>
                  <hr className="reg-spacer" />
                  <DataTable header={cols} rows={data} />
               </div>
            </div>
         );
      } else {
         return (
            <div className="jumbotron-content" style={{ maxWidth: "850px" }}>
               <h2>
                  Data for{" "}
                  <span className="bold">
                     {this.props.location.query.table_name}
                  </span>
               </h2>
               <hr className="reg-spacer" />
               <div className="block-error">
                  An error occurred while loading the table.
               </div>
            </div>
         );
      }
   }

   render() {
      return (
         <div className="jumbotron">
            {this.state.loading ? (
               <div className="jumbotron-content" style={{ maxWidth: "850px" }}>
                  <h2>
                     Data for{" "}
                     <span className="bold">
                        {this.props.location.query.table_name}
                     </span>
                  </h2>
                  <hr className="reg-spacer" />
                  <div className="loader loader-xl" />
               </div>
            ) : (
               this.getDataTable()
            )}
         </div>
      );
   }
}

export default DataSetTable;
