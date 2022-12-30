using FileSharingApp.API.CustomExceptions;
using FileSharingAppUnitTests.Helpers;
using FluentValidation;
using Xunit;

namespace FileSharingAppUnitTests.ServiceTests
{
    public class ErrorServiceUnitTests
    {
        [Fact]
        public void GetStatusCode_should_return_404_not_found_status_code_when_exception_is_of_type_UserNotFoundException()
        {
            //Arrange
            var exception = new UserNotFoundException("Test exception");
            var errorService = ErrorServiceGenerator.GenerateErrorService();

            //Act
            var statusCode = errorService.GetStatusCode(exception);

            //Assert
            Assert.Equal(404, (int)statusCode);
        }
        
        [Fact]
        public void GetStatusCode_should_return_403_unauthorizd_status_code_when_exception_is_of_type_PasswordIncorrectException()
        {
            //Arrange
            var exception = new PasswordIncorrectException("Test exception");
            var errorService = ErrorServiceGenerator.GenerateErrorService();

            //Act
            var statusCode = errorService.GetStatusCode(exception);

            //Assert
            Assert.Equal(401, (int)statusCode);
        }
        
        [Fact]
        public void GetStatusCode_should_return_403_forbidden_status_code_when_exception_is_of_type_ValidationException()
        {
            //Arrange
            var exception = new ValidationException("Test exception");
            var errorService = ErrorServiceGenerator.GenerateErrorService();
   
            //Act
            var statusCode = errorService.GetStatusCode(exception);

            //Assert
            Assert.Equal(403, (int)statusCode);
        }
        
        [Fact]
        public void GetStatusCode_should_return_500_internal_error_status_code_when_exception_is_of_type_AggregateException_and_any_of_the_inner_exceptions_are_not_UserManagerCreateUserExceptions()
        {
            //Arrange

            var innerExceptionList = new List<PasswordIncorrectException>();
            innerExceptionList.Add(new PasswordIncorrectException("Exception test 1"));
            innerExceptionList.Add(new PasswordIncorrectException("Exception test 2"));
            var exception =  new AggregateException(innerExceptionList);
            var errorService = ErrorServiceGenerator.GenerateErrorService();

            //Act
            var statusCode = errorService.GetStatusCode(exception);

            //Assert
            Assert.Equal(500, (int)statusCode);
        }

        [Fact]
        public void GetStatusCode_should_return_422_umprocessable_entity_error_status_code_when_exception_is_of_type_AggregateException_and_all_of_the_inner_exceptions_are_UserManagerCreateUserExceptions()
        {
            //Arrange
            var innerExceptionList = new List<UserManagerCreateUserException>();
            innerExceptionList.Add(new UserManagerCreateUserException("Exception test 1"));
            innerExceptionList.Add(new UserManagerCreateUserException("Exception test 2"));
            var exception = new AggregateException(innerExceptionList);
            var errorService = ErrorServiceGenerator.GenerateErrorService();

            //Act
            var statusCode = errorService.GetStatusCode(exception);

            //Assert
            Assert.Equal(422, (int)statusCode);
        }
    }
}
