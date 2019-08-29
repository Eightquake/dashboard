import React from "react";
import "./App.css";

/* Disabled for now as I am not using a frameless window */
// import NavBar from "./js/renderer/components/NavBar.jsx";

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
