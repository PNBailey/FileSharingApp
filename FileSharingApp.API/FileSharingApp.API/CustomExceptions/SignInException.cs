namespace FileSharingApp.API.CustomExceptions
{
    public class SignInException : Exception
    {
        public SignInException(string? message) : base(message)
        {
        }
    }
}