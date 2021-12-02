using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator mediator;

        protected IMediator Mediator => mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> response)
        {
            if (response == null)  return NotFound();
            if (response.IsSuccess && response.Value != null)
                return Ok(response.Value);
            if (response.IsSuccess && response.Value == null)
                return NotFound();

            return BadRequest(response.Error);
        }

    }
}