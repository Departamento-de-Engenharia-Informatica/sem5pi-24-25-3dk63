using Backend.Domain.Shared;
using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure;
using DDDSample1.Users;


public class PatientDeletionService : IHostedService, IDisposable
{
    private readonly ILogger<PatientDeletionService> _logger;
    private readonly IServiceProvider _serviceProvider;


    private Timer _timer;

    public PatientDeletionService(ILogger<PatientDeletionService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Patient deletion service started.");

        _timer = new Timer(CheckForPatientDeletion, null, TimeSpan.Zero, TimeSpan.FromMinutes(10));

        return Task.CompletedTask;
    }

    private async void CheckForPatientDeletion(object? state)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var patientRepository = scope.ServiceProvider.GetRequiredService<IPatientRepository>();
            var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
            var auditService = scope.ServiceProvider.GetRequiredService<AuditService>();

            var usersForDeletion = await userRepository.GetUsersMarkedForDeletionAsync();

            foreach (var user in usersForDeletion)
            {
                if (user.MarkedForDeletionDate <= DateTime.UtcNow)
                {
                    await DeleteUserDataAsync(user);

                    auditService.LogDeletionCompleted(user);
                }
            }
        }
    }

    private async Task DeleteUserDataAsync(User user)
    {

        var patientRepository = _serviceProvider.GetRequiredService<IPatientRepository>();
        var userRepository = _serviceProvider.GetRequiredService<IUserRepository>();
        var auditService = _serviceProvider.GetRequiredService<AuditService>();
        var _unitOfWork = _serviceProvider.GetRequiredService<IUnitOfWork>();

        var patient = await patientRepository.FindByUserIdAsync(user.Id);
        if (patient != null)
        {
            await patientRepository.DeletePatientAsync(patient.UserId);
        }

        await userRepository.DeleteUserAsync(user);
        await _unitOfWork.CommitAsync();

        auditService.LogDeletionCompleted(user);

    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Patient deletion service stopped.");
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
