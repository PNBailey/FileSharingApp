namespace FileSharingApp.API.Helpers
{
    public class CloudinaryConfigOptions
    {
        public const string CloudinaryConfig = "CloudinaryConfig";

        public string CloudName { get; set; } = String.Empty;

        public string ApiKey { get; set; } = String.Empty;

        public string ApiSecret { get; set; } = String.Empty;
    }
}
