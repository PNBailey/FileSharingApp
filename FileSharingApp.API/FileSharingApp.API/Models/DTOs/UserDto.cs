using System.IdentityModel.Tokens.Jwt;

namespace FileSharingApp.API.Models.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Bio { get; set; }

        public string? Token { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public string Email { get; set; } = string.Empty;

        public string SecurityStamp { get; set; } = string.Empty;

    }
}
