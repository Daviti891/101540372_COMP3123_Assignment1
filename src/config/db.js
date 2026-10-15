const mongoose = require('mongoose');

let connecting;

module.exports = () => {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (!connecting) {
        connecting = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
            connecting = null;
            throw err;
        });
    }
    return connecting;
};