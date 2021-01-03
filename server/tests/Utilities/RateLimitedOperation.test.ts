import RateLimitedOperation from '../../src/Utilities/RateLimitedOperation';
import { sleep } from '../../src/Utilities/TimingHelper';

let rateLimitedOperation: RateLimitedOperation<Promise<number>>;
const dummyRateLimit = 100;
let mockOperation: jest.Mock;

describe('Tests for RateLimitedOperation.', () => {
    beforeEach(() => {
        mockOperation = jest.fn();
        rateLimitedOperation = new RateLimitedOperation<Promise<number>>(mockOperation, dummyRateLimit);
    });

    test('Executing operation executes underlying operation.', async () => {
        mockOperation.mockImplementation(_ => dummyOperationResult);
        const rateLimitedOperation = new RateLimitedOperation<number>(mockOperation.getMockImplementation(), dummyRateLimit);
        const dummyOperationResult: number = 10;

        const result = rateLimitedOperation.execute();

        expect(mockOperation).toBeCalledTimes(1);
        expect(result).toEqual(dummyOperationResult);
    });

    test('Executing operation, before timeout is reached, returns the same result.', async () => {
        let dummyFirstPromiseResolver;
        let dummySecondPromiseResolver;

        mockOperation.mockImplementation(() => {
            return new Promise(res => {
                dummyFirstPromiseResolver = res
            })
        });

        const firstPromise = rateLimitedOperation.execute();

        mockOperation.mockImplementation(() => {
            return new Promise(res => {
                dummySecondPromiseResolver = res
            })
        });

        const secondPromise = rateLimitedOperation.execute();

        expect(mockOperation).toBeCalledTimes(1);

        expect(firstPromise === secondPromise);

        expect(dummySecondPromiseResolver).toBe(undefined);
        dummyFirstPromiseResolver(1);

        expect(await firstPromise).toBe(1);
        expect(await secondPromise).toEqual(1);
    });

    test('Executing operation, after timeout is reached, returns new result.', async () => {

        const rateLimit = 10;
        rateLimitedOperation = new RateLimitedOperation(mockOperation, rateLimit);

        let dummyFirstPromiseResolver;
        let dummySecondPromiseResolver;

        mockOperation.mockImplementation(() => {
            return new Promise(res => {
                dummyFirstPromiseResolver = res
            })
        });

        const firstPromise = rateLimitedOperation.execute();

        await sleep(rateLimit * 2);

        mockOperation.mockImplementation(() => {
            return new Promise(res => {
                dummySecondPromiseResolver = res
            })
        });

        const secondPromise = rateLimitedOperation.execute();

        expect(mockOperation).toBeCalledTimes(2);

        expect(firstPromise !== secondPromise);

        dummyFirstPromiseResolver(1);
        dummySecondPromiseResolver(2);

        expect(await firstPromise).toBe(1);
        expect(await secondPromise).toEqual(2);
    });
});