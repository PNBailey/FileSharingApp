using Microsoft.Extensions.Configuration;

namespace FileSharingAppUnitTests.Helpers
{
    public class ConfiguratonGenerator
    {
        public static IConfigurationRoot GenerateConfiguration()
        {
            var myConfig = new Dictionary<string, string>
            {
                { "JWT:Secret", "JWTAuthenticationHIGHsecuredPasswordVVVp1OH7Xcba" }
            };

            var config = new ConfigurationBuilder()
                   .AddInMemoryCollection(myConfig)
                   .Build();

            return config;
        }
    }
}
