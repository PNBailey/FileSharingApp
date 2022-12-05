using System.IdentityModel.Tokens.Jwt;

namespace FileSharingApp.API.Models.DTOs
{
    /// <summary>
    /// A Dto for the <see cref="AppUser"/> Entity
    /// </summary>
    public class UserDto
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public JwtSecurityToken? Token { get; set; }
    }
}
