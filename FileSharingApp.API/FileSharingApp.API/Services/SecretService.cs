using Google.Cloud.SecretManager.V1;

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
