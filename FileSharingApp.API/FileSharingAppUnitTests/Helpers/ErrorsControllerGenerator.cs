using FileSharingApp.API.Controllers;
using FileSharingApp.API.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Moq;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class ErrorsControllerGenerator
    {
        public static ErrorsController GenerateErrorsController(Exception exception)
        {
            Mock<IExceptionHandlerFeature> exceptionHandlerFeatureMock = MockExceptionHandlerFeatureGenerator.GenerateExceptionHandlerFeatureMock(exception);
            Mock<IFeatureCollection>? featureCollectionMock = GenerateFeatureCollectionMock(exceptionHandlerFeatureMock);
            Mock<HttpContext> httpContextMock = GenerateHttpContextMock(featureCollectionMock);
            Mock<IHttpContextAccessor> httpContextAccessorMock = GenerateHttpContextAccessorMock(httpContextMock);
            ErrorService errorService = ErrorServiceGenerator.GenerateErrorService();

            return new ErrorsController(httpContextAccessorMock.Object, errorService);
        }

        private static Mock<IFeatureCollection> GenerateFeatureCollectionMock(Mock<IExceptionHandlerFeature> exceptionHandlerFeatureMock)
        {
            var featureCollectionMock = new Mock<IFeatureCollection>();
            featureCollectionMock.Setup(fc => fc.Get<IExceptionHandlerFeature>()).Returns(exceptionHandlerFeatureMock.Object);
            return featureCollectionMock;
        }

        private static Mock<HttpContext> GenerateHttpContextMock(Mock<IFeatureCollection> featureCollectionMock)
        {
            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(c => c.Features).Returns(featureCollectionMock.Object);
            return httpContextMock;
        }

        private static Mock<IHttpContextAccessor> GenerateHttpContextAccessorMock(Mock<HttpContext> httpContextMock)
        {
            var httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            httpContextAccessorMock.Setup(ca => ca.HttpContext).Returns(httpContextMock.Object);
            return httpContextAccessorMock;
        }
    }
}
