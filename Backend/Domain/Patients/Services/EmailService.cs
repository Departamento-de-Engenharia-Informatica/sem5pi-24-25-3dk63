using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain
{
    public class EmailService
    {
        public async Task SendConfirmationEmailAsync(string email, string token)
        {
            // Compose the email content
            var confirmationLink = $"https://localhost:5001/api/Registrations/confirm-email?token={token}";
            var subject = "Confirm your registration";
            var body = $"Please click on the following link to confirm your registration: <a href=\"{confirmationLink}\">Confirm Registration</a>";

            // Code to send the email (using SMTP or other email service)
            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPatientNotificationEmailAsync(PatientUpdateDTO dto)
        {
            var subject = "Patient Profile Updated";
            var body = $"Your profile has been updated with changes to sensitive data. Please review the changes below: \n\n";

            body += $"Updated Attributes:\n";

            PropertyInfo[] properties = typeof(PatientUpdateDTO).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                if (property != null)
                {
                    var newValue = property.GetValue(dto, null);
                    if (newValue != null)
                    {
                        body += $"- {property.Name}: {newValue}\n";
                    }
                }
            }

            await SendEmailAsync(dto.Email.ToString(), subject, body);
        }

public async Task SendStaffNotificationEmailAsync(List<string> changedProperties, StaffUpdateDTO dto)
{
    var subject = "Staff Profile Updated";
    var body = "<p>Your profile has been updated with changes to sensitive data. Please review the changes below:</p>";
    
    body += "<p>Updated Attributes:</p><ul>";

    // Adicionar cada mudança formatada da lista 'changedProperties'
    foreach (string change in changedProperties)
    {
        body += $"<li>{change}</li>";
    }

    body += "</ul>";

    // Envia o e-mail
    await SendEmailAsync(dto.Email.ToString(), subject, body);
}



        public async Task SendUpdateEmail(string email, string token)
        {
            var confirmationLink = $"https://localhost:5001/api/Patients/confirm-update?token={token}";
            var subject = "Confirm your profile update";
            var body = $"Please click on the following link to confirm your profile update: <a href=\"{confirmationLink}\">Confirm Update</a>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendUpdateStaffEmail(string email, string token)
        {
            var confirmationLink = $"https://localhost:5001/api/Staff/confirm-update?token={token}";
            var subject = "Confirm your profile update";
            var body = $"Please click on the following link to confirm your profile update: <a href=\"{confirmationLink}\">Confirm Update</a>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendDeletionConfirmationEmail(string email, string token)
        {
            var confirmationLink = $"https://localhost:5001/api/Patients/confirm-account-deletion?token={token}";
            var subject = "Confirm your account deletion";
            var body = $"Please click on the following link to confirm your account deletion: <a href=\"{confirmationLink}\">Confirm Deletion</a>";

            await SendEmailAsync(email, subject, body);
        }


        private async Task SendEmailAsync(string email, string subject, string body)
        {
            try
            {
                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.Credentials = new NetworkCredential("lapr3dkg69sup@gmail.com", "jqpq httt gxex cnvh");
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("lapr3dkg69sup@gmail.com"),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true // Set to true if the body contains HTML content
                    };
                    mailMessage.To.Add(email);

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the email sending process
                Console.WriteLine($"Failed to send email: {ex.Message}");
                throw;
            }
        }

    }
}
