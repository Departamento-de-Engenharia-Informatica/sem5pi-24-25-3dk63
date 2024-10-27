using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Shared;
using DDDSample1.Users;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Domain.Users;
using DDDSample1.OperationsType;
using DDDSample1.Infrastructure.OperationsType;
using DDDSample1.Domain.OperationsType;
using Microsoft.AspNetCore.Authentication;
using Backend.Domain.SurgeryRoom;
using Backend.Infraestructure.SurgeryRoom;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Infrastructure.OperationRequests;
using DDDSample1.OperationRequests;
using DDDSample1.Domain.Appointments;
using DDDSample1.Infrastructure.Appointments;
using DDDSample1.Appointments;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Specialization;
using DDDSample1.Infrastructure.Staffs;
using DDDSample1.Infrastructure.Specializations;
using DDDSample1.Domain.Patients;
using DDDSample1.Patients;
using DDDSample1.Domain;
using DDDSample1.Infrastructure.Patients;
using Serilog;
using Backend.Domain.Shared;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Infrastructure.PendingChange;
using System.Text;
using Microsoft.AspNetCore.DataProtection;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Infrastructure.PendingChangeStaff;

namespace DDDSample1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {


            services.AddCors(options =>
              {
                  options.AddPolicy("AllowAll",
                      builder =>
                      {
                          builder.AllowAnyOrigin()
                                 .AllowAnyMethod()
                                 .AllowAnyHeader();
                      });
              });


            Log.Logger = new LoggerConfiguration()
          .MinimumLevel.Debug()
          .WriteTo.File("logs.txt", rollingInterval: RollingInterval.Day)
          .CreateLogger();


            services.AddDataProtection();

            services.AddDbContext<DDDSample1DbContext>(options =>
                options.UseMySql(Configuration.GetConnectionString("MySqlConnection"),
                    new MySqlServerVersion(new Version(8, 0, 0)))
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
            {
                options.ClientId = Configuration.GetValue<string>("GoogleKeys:ClientId");
                options.ClientSecret = Configuration.GetValue<string>("GoogleKeys:ClientSecret");

                options.Events.OnCreatingTicket = async context =>
                {
                    var email = context.Principal.FindFirstValue(ClaimTypes.Email);

                    var userService = context.HttpContext.RequestServices.GetRequiredService<UserService>();
                    var user = await userService.FindByEmailAsync(email);

                    if (user == null || user.Active == false)
                    {
                        Log.Information("Login falhou: email não encontrado.");

                        await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                        context.Fail("Este email não está registrado no sistema.");


                        // Encrypt the email using Data Protection
                        var dataProtectionProvider = context.HttpContext.RequestServices.GetRequiredService<IDataProtectionProvider>();
                        var protector = dataProtectionProvider.CreateProtector("CustomCookieProtector");
                        var encryptedEmail = protector.Protect(email);

                        // Create cookie
                        context.HttpContext.Response.Cookies.Append(".AspNetCore.Cookies", encryptedEmail, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            Expires = DateTimeOffset.UtcNow.AddMinutes(30)
                        });

                        context.Response.StatusCode = 302;
                        context.Response.Headers["Location"] = "/api/Registrations/self-register";
                        await context.Response.CompleteAsync();

                        return;
                    }else{

                        Log.Information("Login bem-sucedido: email encontrado.");
                    }

                    var identity = (ClaimsIdentity)context.Principal.Identity;
                    identity.AddClaim(new Claim("urn:google:access_token", context.AccessToken));
                    identity.AddClaim(new Claim("urn:google:expires_in", context.ExpiresIn.ToString()));
                    identity.AddClaim(new Claim(ClaimTypes.Role, user.Role.ToString()));
                };
            });
            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();

            services.AddHttpContextAccessor();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseRouting();

            app.UseCors("AllowAll"); 


            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            // Add AutoMapper configuration
            services.AddAutoMapper(typeof(UserMappingProfile));
            services.AddAutoMapper(typeof(SurgeryRoomMappingProfile));
            services.AddAutoMapper(typeof(PatientMappingProfile));
            services.AddAutoMapper(typeof(OperationTypeMappingProfile));
            services.AddAutoMapper(typeof(OperationRequestMappingProfile));

            // Unit of Work
            services.AddTransient<IUnitOfWork, UnitOfWork>();


            //Specialization services
            services.AddTransient<ISpecializationRepository, SpecializationRepository>();
            services.AddTransient<SpecializationService>();

            // User Services
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();

            // Operation Type Services
            services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
            services.AddTransient<OperationTypeService>();


            // Surgery Room Services
            services.AddTransient<ISurgeryRoomRepository, SurgeryRoomRepository>();
            services.AddTransient<SurgeryRoomService>();

            services.AddTransient<IOperationRequestRepository, OperationRequestRepository>();
            services.AddTransient<OperationRequestService>();

            services.AddTransient<IAppointmentRepository, AppointmentRepository>();
            services.AddTransient<AppointmentService>();

            // Staff services
            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<StaffService>();

            services.AddTransient<IPatientRepository, PatientRepository>();
            services.AddTransient<PatientService>();

            services.AddTransient<RegistrationService>();

            services.AddTransient<EmailService>();


            // Temporary table to save pending changes
            services.AddTransient<IPendingChangesRepository, PendingChangesRepository>();
            services.AddHostedService<PatientDeletionService>();

            services.AddTransient<IPendingChangesStaffRepository, PendingChangesStaffRepository>();

            services.AddTransient<AuditService>(provider =>
            {
                var logger = Log.ForContext<AuditService>();
                return new AuditService(logger);
            });
        }


    }
}
