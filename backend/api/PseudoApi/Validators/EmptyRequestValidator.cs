using FluentValidation;
using PseudoApi.Models.Request;

namespace PseudoApi.Validators
{
    public class EmptyRequestValidator : AbstractValidator<EmptyRequest>
    {
        public EmptyRequestValidator()
        {
            // No validation rules needed
        }
    }
}
