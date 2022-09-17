using System.IdentityModel.Tokens.Jwt;

namespace FileSharingApp.API.Models.DTOs
{
    /// <summary>
    /// A Dto for the <see cref="AppUser"/> Entity
    /// </summary>
    public class UserDto
    {
        /// <summary>
        /// Gets or Sets the Id of the <see cref="AppUser"/>.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or Sets the UserName of the <see cref="AppUser"/>.
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or Sets the Name of the <see cref="AppUser"/>.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or Sets the <see cref="JwtSecurityToken"/>.
        /// </summary>
        public JwtSecurityToken? Token { get; set; }
    }
}
