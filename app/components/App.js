// external modules
import React, { Component } from "react";

class App extends Component {
   render() {
      return <div className="application-container">{this.props.children}</div>;
   }
}

export default App;
