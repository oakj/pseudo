using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class CreateCollectionRequestValidator : AbstractValidator<CreateCollectionRequest>
    {
        public CreateCollectionRequestValidator()
        {
            RuleFor(x => x.CollectionName)
                .NotEmpty().WithMessage("Collection name is required")
                .MaximumLength(50).WithMessage("Collection name cannot exceed 50 characters");
        }
    }
}
