import React from "react";

import Button from "./Button.jsx";

const remote = require("electron").remote;

class NavBar extends React.Component {
  handleButtonClick = event => {
    const action = event.target.dataset.action,
      window = remote.getCurrentWindow();
    console.log(action, window);
    switch (action) {
      case "minimize":
        window.minimize();
        break;
      case "maximise":
        !window.isMaximized() ? window.maximize() : window.unmaximize();
        break;
      case "close":
        window.close();
        break;
      default:
        break;
    }
  };
  render() {
    return (
      <nav id="window-decoration" className="navbar navbar-light bg-light p-0">
        <a
          className="navbar-brand p-0 pl-2"
          href="https://github.com/Eightquake/dashboard"
        >
          Dashboard
        </a>
        <div
          id="window-buttons"
          className="btn-group"
          onClick={this.handleButtonClick}
        >
          <Button action="minimize">
            <i data-action="minimize" className="fas fa-window-minimize" />
          </Button>
          <Button action="maximize">
            <i data-action="maximize" className="fas fa-window-maximize" />
          </Button>
          <Button id="close" action="close">
            <i data-action="close" className="fas fa-window-close" />
          </Button>
        </div>
      </nav>
    );
  }
}

export default NavBar;
