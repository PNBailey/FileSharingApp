using FileSharingApp.API.Controllers;
using FileSharingAppUnitTests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace FileSharingAppUnitTests.ControllerTests
{
    public class ErrorsControllerUnitTests : BaseUnitTest
    {
        [Fact]
        public void Error_end_point_should_return_a_problem_details_response()
        {
            //Arrange
            var exception = new ApplicationException("This is a mocked exception");
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exception);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;

            //Assert
            Assert.IsType<ProblemDetails>(objectResult?.Value);
        }

        [Fact]
        public void Problem_details_detail_should_be_the_exception_stack_trace()
        {
            //Arrange
            var exception = new ApplicationException("This is a mocked exception");
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exception);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(exception.StackTrace, problemDetails!.Detail);
        }

        [Fact]
        public void Problem_details_title_should_be_exception_message()
        {
            //Arrange
            var exception = new ApplicationException("This is a mocked exception");
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exception);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(exception.Message, problemDetails!.Title);
        }

        [Fact]
        public void Problem_details_type_should_be_exception_name()
        {
            //Arrange
            var exception = new ApplicationException("This is a mocked exception");
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exception); 

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(exception.GetType().Name, problemDetails!.Type);
        }

        [Fact]
        public void Problem_details_status_code_should_be_500_by_default()
        {
            //Arrange
            var exception = new ApplicationException("This is a mocked exception");
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exception);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(500, problemDetails!.Status);
        }
    }
}
