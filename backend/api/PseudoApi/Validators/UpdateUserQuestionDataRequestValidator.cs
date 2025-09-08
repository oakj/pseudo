using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class UpdateUserQuestionDataRequestValidator : AbstractValidator<UpdateUserQuestionDataRequest>
    {
        public UpdateUserQuestionDataRequestValidator()
        {
            RuleFor(x => x.UserQuestionId)
                .NotEmpty().WithMessage("User Question ID is required");
                
            RuleFor(x => x.Data)
                .NotNull().WithMessage("User Question Data is required");
                
            RuleFor(x => x.Data.UserId)
                .NotEmpty().WithMessage("User ID is required");
                
            RuleFor(x => x.Data.QuestionId)
                .NotEmpty().WithMessage("Question ID is required");
        }
    }
}
