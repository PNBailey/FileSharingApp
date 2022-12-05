namespace FileSharingApp.API.CustomExceptions
{
    public class PasswordIncorrectException : Exception
    {
        public PasswordIncorrectException(string? message) : base(message)
        {
        }
    }
}
