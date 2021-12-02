using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }
          public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            readonly DataContext db;
            readonly IMapper mapper;
            public Handler(DataContext db, IMapper mapper)
            {
                this.db = db;
                this.mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await db.Activities.FindAsync(request.Activity.Id);
                mapper.Map(request.Activity, activity);
                var result =await db.SaveChangesAsync(cancellationToken)>0;
                if (!result) return Result<Unit>.Failure("Failed to update the activity");


                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}