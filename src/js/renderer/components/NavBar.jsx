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
      <div id="window-decoration">
        <div
          id="button-group"
          className="btn-group rounded"
          onClick={this.handleButtonClick}
        >
          <Button action="minimize">
            <i
              data-action="minimize"
              className="fas fa-window-minimize"
            />
          </Button>
          <Button action="maximize">
            <i
              data-action="maximize"
              className="fas fa-window-maximize"
            />
          </Button>
          <Button id="close" action="close">
            <i
              data-action="close"
              className="fas fa-window-close"
            />
          </Button>
        </div>
      </div>
    );
  }
}

export default NavBar;
