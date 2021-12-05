using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser :IdentityUser
    {
        public string DsiplayName { get; set; }
        public string Bio { get; set; }
    }
}
