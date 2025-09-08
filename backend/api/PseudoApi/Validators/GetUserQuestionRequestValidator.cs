using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class GetUserQuestionRequestValidator : AbstractValidator<GetUserQuestionRequest>
    {
        public GetUserQuestionRequestValidator()
        {
            RuleFor(x => x.QuestionId)
                .NotEmpty().WithMessage("Question ID is required");
        }
    }
}
