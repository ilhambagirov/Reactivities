using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            readonly DataContext db;
            private readonly IMapper mapper;

            public Handler(DataContext db, IMapper mapper)
            {
                this.db = db;
                this.mapper = mapper;
            }
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var response = await db.Activities
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(a => a.Id == request.Id);

                return Result<ActivityDto>.Success(response);
            }
        }
    }
}