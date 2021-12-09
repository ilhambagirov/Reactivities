using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext db;
        private readonly IHttpContextAccessor httpAccessor;

        public IsHostRequirementHandler(DataContext db, IHttpContextAccessor httpAccessor)
        {
            this.db = db;
            this.httpAccessor = httpAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userid = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userid == null) return Task.CompletedTask;

            var activityId = Guid.Parse(httpAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = db.ActivityAttendees
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.AppUserId == userid && x.ActivityId == activityId).Result;

            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;


        }
    }
}
