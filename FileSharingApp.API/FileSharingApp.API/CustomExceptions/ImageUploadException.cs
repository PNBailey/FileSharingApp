namespace FileSharingApp.API.CustomExceptions
{
    public class ImageUploadException : Exception
    {
        public ImageUploadException(string? message) : base(message)
        {
        }
    }
}
