import LoggerProvider, { ILogger } from './Logging/LoggerProvider';
import ON_DEATH from 'death';
import WebServer from './WebServer';
import App from './App';

process.title = 'piServer';

const logger: ILogger = LoggerProvider.createLogger('Index');

const webServer = new WebServer();
webServer.startWebServer();

const appServices = new App();
appServices.start();

ON_DEATH((signal, err) => {
    logger.info('Death.')

    if (err) {
        logger.error(`Error: ${err}`);
    }

    appServices.dispose();
});