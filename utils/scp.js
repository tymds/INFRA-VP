const { exec } = require('child_process');
const config = require('../config/config.json');

async function executeScpCommand(source, destination) {
  const command = `scp -r ${source} ${destination}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject({ error: err, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = executeScpCommand;