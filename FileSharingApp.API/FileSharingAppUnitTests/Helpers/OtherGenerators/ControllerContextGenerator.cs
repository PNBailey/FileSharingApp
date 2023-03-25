using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FileSharingAppUnitTests.Helpers
{
    internal static class ControllerContextGenerator
    {
        internal static ControllerContext GenerateControllerContext()
        {
            var mockClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1234")
            };
            var mockIdentity = new ClaimsIdentity(mockClaims, "TestClaimsIdentity");
            var mockPrincipal = new ClaimsPrincipal(mockIdentity);
            var controllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = mockPrincipal }
            };
            return controllerContext;
        }
    }
}
