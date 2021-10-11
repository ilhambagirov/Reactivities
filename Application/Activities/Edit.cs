using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            readonly DataContext db;
            readonly IMapper mapper;
            public Handler(DataContext db, IMapper mapper)
            {
                this.db = db;
                this.mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await db.Activities.FindAsync(request.Activity.Id);
                mapper.Map(request.Activity, activity);
                await db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}