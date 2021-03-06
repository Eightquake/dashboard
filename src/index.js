import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";

import App from "./App";
import PopupList from "./js/renderer/components/PopupList.jsx";

/* Import side effects of src/js/renderer/index.js, as no variables is needed here */
import {
  registerAddComponentToGrid,
  forwardAddPopupToList
} from "./js/renderer";

/* CSS items. First bootstrap, then Font Awesome icons, then my own CSS */
import "bootstrap/dist/css/bootstrap.css";
import "../public/resources/css/fa-all.min.css";
import "../public/resources/css/maintheme.css";

let componentList = [];
function addComponentToGrid(gridObject) {
  componentList.push(gridObject);
  ReactDOM.render(
    <App components={componentList} />,
    document.getElementById("root")
  );
}
registerAddComponentToGrid(addComponentToGrid);

let popupList = [];
function addPopupToList(popupObject) {
  popupList.push(popupObject);
  ReactDOM.render(
    <PopupList popups={popupList} />,
    document.getElementsByClassName("popup-list")[0]
  );
}
forwardAddPopupToList(addPopupToList);
export function removePopupFromList(id) {
  popupList.splice(id, 1);
}

ReactDOM.render(
  <App components={componentList} />,
  document.getElementById("root")
);
ReactDOM.render(
  <PopupList popups={popupList} />,
  document.getElementsByClassName("popup-list")[0]
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
