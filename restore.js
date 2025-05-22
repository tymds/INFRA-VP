const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

/***
  Restaure une sauvegarde depuis le serveur distant
  @param {string} backupName - Nom du dossier de sauvegarde à restaurer
  @returns {Promise<void>}
 */
async function restore(backupName) {
  const remoteUser = 'user';
  const remoteHost = '192.168.1.10';
  const remotePath = `/home/user/sauvegardes/${backupName}`;
  const localRestorePath = '/home/user/restored';

  try {
    // chekc que le répertoire de restauration existe
    await fs.ensureDir(localRestorePath);

    // buildup commande SCP 
    const command = `scp -r ${remoteUser}@${remoteHost}:${remotePath} ${localRestorePath}`;

    // start restauration
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error('Échec de la restauration:', stderr);
          reject(err);
        } else {
          console.log('Restauration terminée avec succès');
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    console.error('Échec de la restauration:', error);
    throw error;
  }
}

module.exports = restore;
