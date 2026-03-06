const { sequelize } = require('./models');

const checkDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection à la base de données réussie !');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec succès.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\nCONSEIL : Le serveur PostgreSQL ne semble pas tourner.');
      console.log('Assurez-vous que Docker Desktop est lancé et exécutez :');
      console.log('docker compose up -d');
    }
    process.exit(1);
  }
};

checkDB();
