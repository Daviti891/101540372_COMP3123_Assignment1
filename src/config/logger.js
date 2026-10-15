const { createLogger, format, transports } = require('winston');

const list = [new transports.Console()];
if (!process.env.VERCEL) {
    list.push(
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/app.log' })
    );
}

module.exports = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: list
});