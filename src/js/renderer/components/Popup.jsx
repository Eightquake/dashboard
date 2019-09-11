import React from "react";

/* Object to "translate" the event name to a icon */
let icons = {
  danger: "fa-exclamation-triangle",
  warning: "fa-exclamation-circle",
  info: "fa-info-circle"
};

export default class Popup extends React.Component {
  render() {
    return (
      <li
        data-id={this.props.id}
        onClick={this.props.onClick}
        className={
          "problem-animation-run alert alert-dismissible alert-" + (this.props.code || "info")
        }
        role="alert"
      >
        <button type="button" className="close">
          <i className="fas fa-times" />
        </button>
        {this.props.code && (
          <i className={"popup-icon fas " + icons[this.props.code]} />
        )}
        {this.props.problem && (
          <React.Fragment>
            <h3 className="alert-heading">{this.props.problem}</h3>
            <hr />
          </React.Fragment>
        )}
        <p className="mb-xl-0">{this.props.string}</p>
      </li>
    );
  }
}
