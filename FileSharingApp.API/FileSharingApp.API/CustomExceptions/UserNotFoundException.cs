namespace FileSharingApp.API.CustomExceptions
{
    public class UserNotFoundException : Exception
    {
        public UserNotFoundException(string? message) : base(message)
        {
        }
    }
}
