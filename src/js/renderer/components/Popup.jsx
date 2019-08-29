import React from 'react';

export default class Popup extends React.Component {
    render() {
        return (
            <li
            data-id={this.props.id}
            onClick={this.props.onClick}
            className={"problem-animation-run alert alert-" + (this.props.code || "info")}
            role="alert"
          >
            <button type="button" className="close">
              <i className="fas fa-times" />
            </button>
            {this.props.string}
          </li>
        );
    }
}