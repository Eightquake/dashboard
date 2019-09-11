import React from "react";

/* Disabled for now as I am not using a frameless window */
// import NavBar from "./js/renderer/components/NavBar.jsx";

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="grid">
          <div className="grid-sizer" />
          <div className="gutter-sizer" />
          {this.props.components.map((object, index) => (
            <div className="grid-item" key={index}>
              <object.Component detail={object.detail} />
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
