namespace FileSharingApp.API.Models.DTOs
{
    /// <summary>
    /// A Dto to register a <see cref="AppUser"/>.
    /// </summary>
    public class RegisterDto
    {
        /// <summary>
        /// Gets or Sets the UserName of the <see cref="AppUser"/>.
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or Sets the <see cref="AppUser"/>s Password.
        /// </summary>
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Gets or Sets the <see cref="AppUser"/>s Email.
        /// </summary>
        public string Email { get; set; } = string.Empty;
    }
}
