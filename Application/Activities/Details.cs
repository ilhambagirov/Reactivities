using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, Activity>
        {
            readonly DataContext db;
            public Handler(DataContext db)
            {
                this.db = db;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await db.Activities.FindAsync(request.Id);
            }
        }
    }
}