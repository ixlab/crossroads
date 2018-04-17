// external modules
import React, { Component, PropTypes } from "react";
import LeftArrow from "react-icons/lib/fa/angle-left";
import RightArrow from "react-icons/lib/fa/angle-right";

// custom modules
import Row from "./Row.js";
import Cell from "./Cell.js";

/**
 * Presents a table of data in a uniform format
 * @param {array} header - an array of strings for the cell headers
 * @param {array} rows - an array of arrays or an array of object
 * @param {array} rowKeyMap - an array of keys to parse a row object
 * @param {number} perPage - number of rows to show per page
 */
class DataTable extends Component {
   constructor(props) {
      super(props);

      const perPage = this.props.perPage || 50;
      this.state = {
         perPage,
         page: 0,
         totalPages: Math.ceil(this.props.rows.length / perPage)
      };
   }

   handleRows() {
      const { rowKeyMap } = this.props;
      const { page, perPage } = this.state;
      const rows = this.props.rows.slice(
         page * perPage,
         page * perPage + perPage
      );

      if (rows.length && Array.isArray(rows[0]))
         return rows.map((data, i) => (
            <Row key={i}>
               {data.map((datum, j) => <Cell key={j} content={datum} />)}
            </Row>
         ));
      else if (rowKeyMap)
         return rows.map((obj, i) => (
            <Row key={i}>
               {rowKeyMap.map((key, j) => <Cell key={j} content={obj[key]} />)}
            </Row>
         ));
      else
         throw new Error(`
				In DataTable.js: props.rows must be an
				array of arrays unless props.rowKeyMap
				is given
			`);
   }

   previousPage() {
      this.setState({ page: this.state.page - 1 });
   }

   nextPage() {
      this.setState({ page: this.state.page + 1 });
   }

   render() {
      return (
         <div className="data-table-wrapper">
            <table className="data-table">
               <thead>
                  <Row header>
                     {this.props.header.map((col, i) => (
                        <Cell key={i} content={col} />
                     ))}
                  </Row>
               </thead>
               <tbody>{this.handleRows()}</tbody>
            </table>
            <footer className="data-table-footer">
               <button
                  type="button"
                  disabled={!this.state.page}
                  onClick={this.previousPage.bind(this)}
               >
                  <LeftArrow className="dark-icon" size={15} />
               </button>
               <button
                  type="button"
                  disabled={this.state.page === this.state.totalPages - 1}
                  onClick={this.nextPage.bind(this)}
               >
                  <RightArrow className="dark-icon" size={15} />
               </button>
            </footer>
         </div>
      );
   }
}

DataTable.propTypes = {
   header: PropTypes.arrayOf(PropTypes.string).isRequired,
   rows: PropTypes.arrayOf(PropTypes.any).isRequired,
   rowKeyMap: PropTypes.arrayOf(PropTypes.string),
   perPage: PropTypes.number
};

export default DataTable;
