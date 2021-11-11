using MediatR;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            readonly DataContext db;
            public Handler(DataContext db)
            {
                this.db = db;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await db.Activities.FindAsync(request.Id);

                db.Remove(activity);
                await db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}