using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PseudoApi.Middleware;
using PseudoApi.Services;
using PseudoApi.Validators;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/pseudo-api-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddHttpContextAccessor();

// Register Supabase services
builder.Services.AddScoped<SupabaseService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<StorageService>();

// Register validators
builder.Services.AddValidatorsFromAssemblyContaining<EmptyRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Supabase:JwtSecret"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Supabase:Url"] + "/auth/v1",
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>())
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Pseudo API", Version = "v1" });
    
    // Configure Swagger to use JWT Authentication
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Register managers (dependency injection)
builder.Services.AddScoped<PseudoApi.Managers.Auth.AuthManager>();
builder.Services.AddScoped<PseudoApi.Managers.Profile.ProfileManager>();
builder.Services.AddScoped<PseudoApi.Managers.Question.QuestionManager>();
builder.Services.AddScoped<PseudoApi.Managers.Collection.CollectionManager>();
builder.Services.AddScoped<PseudoApi.Managers.UserQuestion.UserQuestionManager>();
builder.Services.AddScoped<PseudoApi.Managers.Streak.StreakManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use custom exception middleware
app.UseMiddleware<ExceptionMiddleware>();

// Use CORS
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Use user context middleware
app.UseMiddleware<UserContextMiddleware>();

// Configure health checks
app.MapHealthChecks("/health");

app.MapControllers();

app.Run();
