using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class GetCollectionRequestValidator : AbstractValidator<GetCollectionRequest>
    {
        public GetCollectionRequestValidator()
        {
            RuleFor(x => x.CollectionId)
                .NotEmpty().WithMessage("Collection ID is required");
        }
    }
}
