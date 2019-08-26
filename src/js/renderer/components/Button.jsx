import React from "react";

class Button extends React.Component {
  render() {
    return (
      <button
        type="button"
        id={this.props.id}
        data-action={this.props.action}
        className={"btn btn-sm " + (this.props.className || "btn-secondary")}
        style={({ fontSize: "12px" }, this.props.style)}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
