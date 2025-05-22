const fs = require('fs-extra');
const path = require('path');
const config = require('./config.json');
const { exec } = require('child_process');
const cron = require('node-cron');

async function createBackup() {
  try {
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.join(config.backupDestination, `backup-${date}`);

    // Création d'un dossier de sauvegarde s'il n'existe pas
    await fs.ensureDir(backupFolder);

    // Je sais plus, mais c'est pour copier les chemins vers le dossier de sauvegarde
    for (const src of config.pathsToBackup) {
      const baseName = path.basename(src);
      const dest = path.join(backupFolder, baseName);
      await fs.copy(src, dest);
      console.log(`Sauvergade compléter: ${src} -> ${dest}`);
    }

    return backupFolder;
  } catch (error) {
    console.error('Echec de la sauvegarde:', error);
    throw error;
  }
}

async function uploadBackup(backupFolder) {
  const remoteUser = 'user';
  const remoteHost = '192.168.1.10';
  const remotePath = '/home/user/sauvegardes';

  const command = `scp -r ${backupFolder} ${remoteUser}@${remoteHost}:${remotePath}`;

  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Echec de l'upload: ${stderr}`);
        reject(err);
      } else {
        console.log(`Upload vers le Cloud avec succès: ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

async function performBackup() {
  try {
    const backupFolder = await createBackup();
    await uploadBackup(backupFolder);
  } catch (error) {
    console.error('Echec de la sauvegarde:', error);
  }
}

// Tous les jours à 2h du matin ? Je crois
cron.schedule('0 2 * * *', performBackup);
