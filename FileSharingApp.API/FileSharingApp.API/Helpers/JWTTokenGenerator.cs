using FileSharingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FileSharingApp.API.Helpers
{
    public class JWTTokenGenerator
    {
        private readonly UserManager<AppUser?> _userManager;
        private readonly IConfiguration _configuration;

        public JWTTokenGenerator(
            UserManager<AppUser?> userManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<JwtSecurityToken> CreateJWTToken(AppUser user)
        {
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: await GetUserClaims(user),
                signingCredentials: CreateSigningCredentials()
            );

            return token;
        }

        private SigningCredentials CreateSigningCredentials()
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var signingCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256);

            return signingCredentials;
        }

        private async Task<List<Claim>> GetUserClaims(AppUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

            if (userRoles.Any())
            {
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
            }
          
            return authClaims;
        }
    }
}
