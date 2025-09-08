using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
    {
        public UpdateProfileRequestValidator()
        {
            RuleFor(x => x.DarkModePreference)
                .Must(x => x == null || x == "light" || x == "dark" || x == "system")
                .WithMessage("Dark mode preference must be 'light', 'dark', or 'system'");
        }
    }
}
