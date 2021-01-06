/* istanbul ignore file */

export function getMockInstances<TValue>(mockedValue: TValue | jest.Mock<TValue>): jest.Mocked<TValue>[] {
    return ((mockedValue as unknown) as jest.Mock).mock.instances as jest.Mocked<TValue>[];
}

export function getLastMockInstance<TValue>(mockedValue: jest.Mock<TValue>): jest.Mocked<TValue> {
    const instances = getMockInstances(mockedValue);
    return instances[instances.length - 1];
}