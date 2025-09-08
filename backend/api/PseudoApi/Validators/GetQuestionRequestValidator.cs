using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class GetQuestionRequestValidator : AbstractValidator<GetQuestionRequest>
    {
        public GetQuestionRequestValidator()
        {
            RuleFor(x => x.QuestionId)
                .NotEmpty().WithMessage("Question ID is required");
        }
    }
}
