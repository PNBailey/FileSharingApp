using CloudinaryDotNet;
using Microsoft.Extensions.Options;

namespace FileSharingApp.API.Helpers
{
    public static class CloudinaryConfigSetup
    {
        public static Cloudinary SetupCloudinary(IOptions<CloudinaryConfigOptions> config)
        {
            Account account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret);

            Cloudinary cloudinary = new Cloudinary(account);
            cloudinary.Api.Secure = true;
            return cloudinary;
        }
    }
}
