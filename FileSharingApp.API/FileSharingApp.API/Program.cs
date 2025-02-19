using API.Helpers;
using FileSharingApp.API.DAL;
using FileSharingApp.API.DAL.Interfaces;
using FileSharingApp.API.Data;
using FileSharingApp.API.Helpers;
using FileSharingApp.API.Models;
using FileSharingApp.API.Services;
using FileSharingApp.API.Services.Interfaces;
using Google.Cloud.SecretManager.V1;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NLog;
using NLog.Web;
using System.Text;
using System.Text.Json.Serialization;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

// Add services to the container

try
{
    builder.Services.AddHttpContextAccessor();

    builder.Services.Configure<CloudinaryConfigOptions>(
        configuration.GetSection(CloudinaryConfigOptions.CloudinaryConfig));

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
            builder =>
            {
                builder.WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
    });

    //Set GCP creds
    var credentialPath = configuration["GCP:ApplicationCredentials"];
    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

    // Replace JWT Secret
    AccessSecretVersionRequest request = new()
    {
        SecretVersionName = SecretVersionName.FromProjectSecretSecretVersion(configuration.GetValue<string>("GCP:ProjectId"), configuration.GetValue<string>("SecretManager:JWTSecretName"), "latest")
    };
    var secretResponse = SecretService.GetSecret(request);
    var jwtSecret = secretResponse.Payload.Data.ToStringUtf8();
    builder.Configuration["JWT:Secret"] = jwtSecret;

    // Adding Authentication
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })

    // Adding Jwt Bearer
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = configuration["JWT:ValidAudience"],
            ValidIssuer = configuration["JWT:ValidIssuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"])),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

    builder.Services.AddDbContext<DataContext>(opt =>
    {
        opt.UseSqlServer(builder.Configuration.GetConnectionString("FileSharingApp"));
    });

    builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
    builder.Services.AddScoped<JWTTokenGenerator>();

    builder.Services.AddIdentityCore<AppUser>(opt =>
    {
        opt.Password.RequireNonAlphanumeric = false;
        opt.SignIn.RequireConfirmedAccount = false;
    })
        .AddRoles<AppRole>()
        .AddRoleManager<RoleManager<AppRole>>()
        .AddSignInManager<SignInManager<AppUser>>()
        .AddRoleValidator<RoleValidator<AppRole>>()
        .AddEntityFrameworkStores<DataContext>();

    builder.Services.Configure<IdentityOptions>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 0;
        options.Password.RequiredUniqueChars = 0;

        // Lockout settings.
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.AllowedForNewUsers = true;

        // User settings.
        options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
        options.User.RequireUniqueEmail = true;
    });

    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Adding services
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IErrorService, ErrorService>();
    builder.Services.AddScoped<IFileService, FileService>();
    builder.Services.AddScoped<IValidationService, ValidationService>();
    builder.Services.AddScoped<IFolderService, FolderService>();
    

    // Adding Repositories
    builder.Services.AddScoped<IFileRepository, FileRepository>();
    builder.Services.AddScoped<IFolderRepository, FolderRepository>();

    // NLog: Setup NLog for Dependency injection
    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    var app = builder.Build();
    app.UseExceptionHandler("/error");

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    app.UseAuthentication();
    app.UseCors(MyAllowSpecificOrigins);
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}
catch (Exception ex)
{
    // NLog: catch setup errors
    logger.Error(ex, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit
    NLog.LogManager.Shutdown();
}
