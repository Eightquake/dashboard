let fs = require('fs');

let settings = {
  "basedir": __dirname
}
fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
  if(err) {
    throw err;
  }
  else {
    console.log("Added %s in settings.json as the base directory for the project.", __dirname);
  }
});
