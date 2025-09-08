using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class UpdateStreakRequestValidator : AbstractValidator<UpdateStreakRequest>
    {
        public UpdateStreakRequestValidator()
        {
            RuleFor(x => x.StreakDays)
                .NotNull().WithMessage("Streak days are required");
                
            RuleForEach(x => x.StreakDays)
                .InclusiveBetween(0, 6).WithMessage("Streak days must be between 0 and 6 (Sunday to Saturday)");
                
            RuleFor(x => x.StreakDays)
                .Must(days => days.Distinct().Count() == days.Count)
                .WithMessage("Streak days must be unique");
        }
    }
}
