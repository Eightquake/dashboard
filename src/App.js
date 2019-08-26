import React from "react";
import "./App.css";

import NavBar from "./js/renderer/components/NavBar.jsx";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
      </React.Fragment>
    );
  }
}

export default App;
