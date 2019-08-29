import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";

import App from "./App";

/* Import side effects of src/js/renderer/index.js, as no variables is needed here */
import registerAddComponentToGrid from "./js/renderer";

/* CSS items. First bootstrap, then Font Awesome icons, then my own CSS */
import "bootstrap/dist/css/bootstrap.css";
import "./resources/renderer/fa-all.min.css";
import "./resources/renderer/maintheme.css";

let componentList = [];
function addComponentToGrid(gridObject) {
  componentList.push(gridObject);
  ReactDOM.render(
    <App components={componentList} />,
    document.getElementById("root")
  );
}
registerAddComponentToGrid(addComponentToGrid);

ReactDOM.render(
  <App components={componentList} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
