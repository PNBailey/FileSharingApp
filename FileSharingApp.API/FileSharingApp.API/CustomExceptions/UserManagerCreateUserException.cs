namespace FileSharingApp.API.CustomExceptions
{
    public class UserManagerCreateUserException : Exception
    {
        public UserManagerCreateUserException(string? message) : base(message)
        {
        }
    }
}
