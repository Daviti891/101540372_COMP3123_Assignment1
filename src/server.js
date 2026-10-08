require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./config/logger');

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => logger.info('Server started'));
    })
    .catch((err) => {
        logger.error('DB connection failed: ' + err.message);
        process.exit(1);
    });