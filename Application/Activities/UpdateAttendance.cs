using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class UpdateAttendance
    {

        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext db;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext db, IUserAccessor userAccessor)
            {
                this.db = db;
                this.userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await db.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                var user = await db.Users
                    .FirstOrDefaultAsync(s => s.UserName == userAccessor.GetUsername());

                if (user == null) return null;

                var hostUserName = activity.Attendees
                    .FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(c => c.AppUser.UserName == user.UserName);

                if (attendance != null && hostUserName == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }
                if (attendance != null && hostUserName != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }
                if (attendance == null)
                {
                    attendance = new Domain.ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                }
                var result = await db.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem while updating");
            }
        }
    }
}
