import winston from 'winston';
import ContextAwareLogger from '../../src/Logging/ContextAwareLogger';
import { IMock, Mock, Times, It } from 'typemoq'

var contextAwareLogger: ContextAwareLogger;
var mockedInternalLogger: IMock<winston.Logger>;
const dummyContext: string = "dummy context";

describe('Tests for ContextAwareLogger.', () => {
    beforeEach(() => {
        mockedInternalLogger = Mock.ofType<winston.Logger>();
        contextAwareLogger = new ContextAwareLogger(mockedInternalLogger.object, dummyContext);
    });

    test('Logging at error level prepends log message with context.', async () => {
        const message = "my message";

        contextAwareLogger.error(message);

        mockedInternalLogger.verify(m => m.error(It.is(m => m.includes(dummyContext) && m.includes(message)), It.isAny()), Times.once());
    });

    test('Logging at info level prepends log message with context.', async () => {
        const message = "my message";

        contextAwareLogger.info(message);

        mockedInternalLogger.verify(m => m.info(It.is(m => m.includes(dummyContext) && m.includes(message)), It.isAny()), Times.once());
    });
});