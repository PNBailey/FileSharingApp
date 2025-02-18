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

        public async Task<string> CreateJWTToken(AppUser user)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(await GetUserClaims(user)),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = CreateSigningCredentials(),
                Audience = _configuration["JWT:ValidAudience"],
                Issuer = _configuration["JWT:ValidIssuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
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
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role))); 

            return authClaims;
        }
    }
}
