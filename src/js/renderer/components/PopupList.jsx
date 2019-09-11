import React from "react";

import { removePopupFromList } from "../../../index.js";

import Popup from "./Popup.jsx";

export default class PopupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popups: this.props.popups
    };
  }
  handlePopupClick = event => {
    if (event.target.tagName === "I") {
      let id = event.currentTarget.dataset.id;
      let newState = this.state.popups.concat();
      newState.splice(id, 1);
      this.setState({ popups: newState });
      removePopupFromList(id);
    }
  };
  render() {
    return (
      <ul className="popup-list">
        {this.state.popups.map((element, index) => (
          <Popup
            key={index}
            id={index}
            code={element.code}
            problem={element.problem}
            string={element.string}
            onClick={this.handlePopupClick}
          />
        ))}
      </ul>
    );
  }
}
