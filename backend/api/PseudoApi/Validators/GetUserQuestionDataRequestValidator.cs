using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class GetUserQuestionDataRequestValidator : AbstractValidator<GetUserQuestionDataRequest>
    {
        public GetUserQuestionDataRequestValidator()
        {
            RuleFor(x => x.UserQuestionId)
                .NotEmpty().WithMessage("User Question ID is required");
        }
    }
}
