namespace FileSharingApp.API.CustomExceptions
{
    public class FileUploadException : Exception
    {
        public FileUploadException(string? message) : base(message)
        {
        }
    }
}
