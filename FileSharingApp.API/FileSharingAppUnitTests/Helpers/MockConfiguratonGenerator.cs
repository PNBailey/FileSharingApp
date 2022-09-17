﻿using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers
{
    public class MockConfiguratonGenerator
    {
        public static IConfigurationRoot GenerateMockConfiguration()
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
