using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileSharingApp.API.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers
{
    public class MockedCloudinary : Cloudinary
    {
        public Mock<HttpMessageHandler> HandlerMock;
        public string HttpRequestContent = null!;

        public MockedCloudinary(string responseStr = "{}", HttpResponseHeaders httpResponseHeaders = null!) : base("cloudinary://a:b@test_cloud")
        {
            HandlerMock = new Mock<HttpMessageHandler>();

            var httpResponseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(responseStr)
            };

            if (httpResponseHeaders != null)
            {
                foreach (var httpResponseHeader in httpResponseHeaders)
                {
                    httpResponseMessage.Headers.Add(httpResponseHeader.Key, httpResponseHeader.Value);
                }
            }

            HandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponseMessage);
            Api.Client = new HttpClient(HandlerMock.Object);
        }
    }
}
