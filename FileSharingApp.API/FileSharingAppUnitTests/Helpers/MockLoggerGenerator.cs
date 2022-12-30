using Moq;
using NLog;

namespace FileSharingAppUnitTests.Helpers
{
    public static class MockLoggerGenerator
    {
        public static Mock<Logger> GenerateMockLogger() => new Mock<Logger>();
    }
}
