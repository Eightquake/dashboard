function handler(detailArg, gridElementArg) {
  gridElementArg.innerHTML = detailArg.html;
}



module.exports = {
  type: "module",
  init: handler
}
