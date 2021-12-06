using API.Dtos;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService ts;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService ts)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.ts = ts;
        }
        [HttpPost]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();

        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email Taken");
                return ValidationProblem();
            }

            if (await userManager.Users.AnyAsync(u => u.NormalizedUserName == registerDto.UserName.ToUpper()))
            {
                ModelState.AddModelError("username", "Username Taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DsiplayName = registerDto.DisplayName,
                UserName = registerDto.UserName,
                Email = registerDto.Email
            };

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
               return CreateUserObject(user);
            }
            ModelState.AddModelError("General", "Problem While Processing!");
            return ValidationProblem();

        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrenUser()
        {
            var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);

        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DsiplayName,
                Token = ts.CreateToken(user),
                Image = null,
                UserName = user.UserName
            };
        }
    }
}
