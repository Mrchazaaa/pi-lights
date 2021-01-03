export default function getMockInstances<TValue>(mockedValue: TValue | jest.Mock<TValue>): jest.Mocked<TValue>[] {
    return ((mockedValue as unknown) as jest.Mock).mock.instances as jest.Mocked<TValue>[];
}

// function getMockInstances<TValue>(mockedValue: jest.Mock<TValue>): jest.Mocked<TValue>[] {
//     return mockedValue.mock.instances as jest.Mocked<TValue>[];
// }