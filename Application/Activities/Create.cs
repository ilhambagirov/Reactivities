using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
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
                db.Activities.Add(request.Activity);
                await db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}