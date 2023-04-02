using Microsoft.AspNetCore.Diagnostics;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class MockExceptionHandlerFeatureGenerator
    {
        public static Mock<IExceptionHandlerFeature> GenerateExceptionHandlerFeatureMock(Exception exception)
        {
            var exceptionHandlerFeatureMock = new Mock<IExceptionHandlerFeature>();

            Exception thrownException;
            try
            {
                throw exception;
            }
            catch (Exception ex)
            {
                thrownException = ex;
            }
            exceptionHandlerFeatureMock.Setup(ehf => ehf.Error).Returns(thrownException);
            return exceptionHandlerFeatureMock;
        }
    }
}