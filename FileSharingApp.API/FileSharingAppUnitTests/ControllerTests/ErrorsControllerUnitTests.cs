using FileSharingAppUnitTests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace FileSharingAppUnitTests.ControllerTests
{
    public class ErrorsControllerUnitTests : BaseUnitTest
    {
        [Fact]
        public void Error_end_point_should_return_a_problem_details_response()
        {
            //Arrange
            var applicationException = new ApplicationException("This is a mocked exception");
            var exceptionHandlerFeatureMock = ErrorsControllerGenerator.GenerateExceptionHandlerFeatureMock(applicationException);
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exceptionHandlerFeatureMock);

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
            var applicationException = new ApplicationException("This is a mocked exception");
            var exceptionHandlerFeatureMock = ErrorsControllerGenerator.GenerateExceptionHandlerFeatureMock(applicationException);
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exceptionHandlerFeatureMock);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(applicationException.StackTrace, problemDetails!.Detail);
        }

        [Fact]
        public void Problem_details_title_should_be_exception_message()
        {
            //Arrange
            var applicationException = new ApplicationException("This is a mocked exception");
            var exceptionHandlerFeatureMock = ErrorsControllerGenerator.GenerateExceptionHandlerFeatureMock(applicationException);
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exceptionHandlerFeatureMock);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(applicationException.Message, problemDetails!.Title);
        }

        [Fact]
        public void Problem_details_type_should_be_exception_name()
        {
            //Arrange
            var applicationException = new ApplicationException("This is a mocked exception");
            var exceptionHandlerFeatureMock = ErrorsControllerGenerator.GenerateExceptionHandlerFeatureMock(applicationException);
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exceptionHandlerFeatureMock);
            var exceptionType = exceptionHandlerFeatureMock.Object.Error.GetType();

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(exceptionType.Name, problemDetails!.Type);
        }

        [Fact]
        public void Problem_details_status_code_should_be_500_by_default()
        {
            //Arrange
            var applicationException = new ApplicationException("This is a mocked exception");
            var exceptionHandlerFeatureMock = ErrorsControllerGenerator.GenerateExceptionHandlerFeatureMock(applicationException);
            var sut = ErrorsControllerGenerator.GenerateErrorsController(exceptionHandlerFeatureMock);

            //Act
            var result = sut.Error();
            var objectResult = result as ObjectResult;
            var problemDetails = objectResult!.Value as ProblemDetails;

            //Assert
            Assert.Equal(500, problemDetails!.Status);
        }

    }
}
