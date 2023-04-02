using System.Security.Claims;

namespace FileSharingApp.API.ExtensionMethods
{
    public static class ClaimPrincipleExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
            {
                throw new ArgumentNullException(nameof(user));
            } 
            else
            {
                return int.Parse(userIdClaim.Value);
            }
        }
    }
}
