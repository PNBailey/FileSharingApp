using Google.Apis.Auth.OAuth2;
using Google.Cloud.SecretManager.V1;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;

namespace FileSharingApp.API.Services
{
    public static class SecretService
    {
        public static AccessSecretVersionResponse GetSecret(AccessSecretVersionRequest request)
        {
            SecretManagerServiceClient secretManagerService = SecretManagerServiceClient.Create();
            AccessSecretVersionResponse response = secretManagerService.AccessSecretVersion(request);
            if(response == null)
            {
                throw new Exception("Secret not found");
            }
            return response;
        }
    }
}
