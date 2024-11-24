using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Domain.Specialization;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain
{
    public class EmailService
    {
        SpecializationService _specializationService;

        public EmailService(SpecializationService specializationService)
        {
            _specializationService = specializationService;
        }
        public async Task SendConfirmationEmailAsync(User user, string email, string token)
        {
            var confirmationLink = $"http://localhost:5173/patient/confirm-email?token={token}";
            var subject = "Confirm Your Registration | Clinitech";
            
            var body = $@"
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);'>
                        <div style='text-align: center;'>
                            <img src='../Backend/assets/image.png' alt='Clinitech Logo' style='max-width: 150px;' />
                        </div>
                        <h2 style='text-align: center; color: #333;'>Confirm Your Registration</h2>
                        <p style='font-size: 16px; color: #333;'>Dear {user.Name},</p>
                        <p style='font-size: 16px; color: #333;'>We received your registration request at Clinitech. To confirm your account, please click the link below:</p>
                        <p style='text-align: center;'>
                            <a href='{confirmationLink}' style='font-size: 16px; color: #ffffff; text-decoration: none; background-color: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;'>Confirm Registration</a>
                        </p>
                        <p style='font-size: 16px; color: #333;'>If you didn’t request this, please ignore this email or contact Clinitech support immediately.</p>
                        <p style='font-size: 16px; color: #333;'>Thank you for joining Clinitech!</p>
                        <p style='font-size: 16px; color: #333;'>Best regards,</p>
                        <p style='font-size: 16px; color: #333;'>The Clinitech Team</p>
                    </div>
                </body>
            </html>";

            await SendEmailAsync(email, subject, body);
        }

        // public async Task SendPatientNotificationEmailAsync(PatientUpdateDTO dto, User user)
        // {
        //     var subject = "Patient Profile Updated";
        //     var body = "<p>Your profile has been updated with changes to sensitive data. Please review the changes below:</p>";
        //     body += "<p>Updated Attributes:</p><ul>";

        //     PropertyInfo[] properties = typeof(PatientUpdateDTO).GetProperties();
        //     foreach (PropertyInfo property in properties)
        //     {
        //         if (property != null)
        //         {
        //             var newValue = property.GetValue(dto, null);
        //             if (newValue != null)
        //             {
        //                 body += $"<li><strong>{property.Name}:</strong> {newValue}</li>";
        //             }
        //         }
        //     }
        //     body += "</ul>";

        //     await SendEmailAsync(dto.personalEmail.ToString(), subject, body);
        // }

        public async Task SendPatientNotificationEmailAsync(PatientUpdateDTO dto, User userStaff)
        {
            var subject = "Your Profile Has Been Updated | Clinitech";
            var logo = "../Backend/assets/image.png";
            var body = $@"
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);'>
                        <div style='text-align: center;'>
                            <img src='{logo}' alt='Clinitech Logo' style='max-width: 150px;' />
                        </div>
                        <h2 style='text-align: center; color: #333;'>Profile Update Notification</h2>
                        <p style='font-size: 16px; color: #333;'>Dear {userStaff.Name},</p>
                        <p style='font-size: 16px; color: #333;'>Your profile at Clinitech has been updated with the following changes:</p>
                        
                        <h3 style='font-size: 18px; color: #333;'>Updated Information:</h3>
                        <ul style='font-size: 16px; color: #333; list-style-type: none; padding: 0;'>";

            PropertyInfo[] properties = typeof(PatientUpdateDTO).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                if (property != null)
                {
                    var newValue = property.GetValue(dto, null);
                    if (newValue != null)
                    {
                        body += $@"
                            <li style='margin-bottom: 10px;'>
                                <strong style='color: #000;'>{property.Name}:</strong> 
                                <span style='color: #007bff;'>{newValue}</span>
                            </li>";
                    }
                }
            }

            body += @"
                        </ul>
                        <p style='font-size: 16px; color: #333;'>If you did not request these changes, please contact Clinitech support immediately.</p>
                        <p style='font-size: 16px; color: #333;'>Thank you for being a part of Clinitech!</p>
                        <p style='font-size: 16px; color: #333;'>Best regards,</p>
                        <p style='font-size: 16px; color: #333;'>The Clinitech Team</p>
                    </div>
                </body>
            </html>";

            // Send the email
            await SendEmailAsync(dto.personalEmail.ToString(), subject, body);
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

        public async Task SendUpdateEmail(string email, string token, string changedFields)
        {
            var confirmationLink = $"http://localhost:5173/patient/confirm-update?token={token}";
            var subject = "Confirm Your Profile Update | Clinitech";
            var logo = "../Backend/assets/image.png";

            var body = $@"
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);'>
                        <div style='text-align: center;'>
                            <img src='{logo}' alt='Clinitech Logo' style='max-width: 150px;' />
                        </div>
                        <h2 style='text-align: center; color: #333;'>Confirm Your Profile Update</h2>
                        <p style='font-size: 16px; color: #333;'>Dear User,</p>
                        <p style='font-size: 16px; color: #333;'>The following information in your profile has been updated:</p>
                        <ul style='list-style: none; padding: 0; margin: 20px 0;'>
                            {changedFields}
                        </ul>
                        <p style='font-size: 16px; color: #333;'>To confirm the changes, please click on the link below:</p>
                        <p style='text-align: center;'>
                            <a href='{confirmationLink}' style='font-size: 16px; color: #ffffff; text-decoration: none; background-color: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;'>Confirm Update</a>
                        </p>
                        <p style='font-size: 16px; color: #333;'>If you did not request these changes, please contact Clinitech support immediately.</p>
                        <p style='font-size: 16px; color: #333;'>Thank you for being a part of Clinitech!</p>
                        <p style='font-size: 16px; color: #333;'>Best regards,</p>
                        <p style='font-size: 16px; color: #333;'>The Clinitech Team</p>
                    </div>
                </body>
            </html>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendDeletionConfirmationEmail(string email, string token)
        {
            var confirmationLink = $"http://localhost:5173/patient/confirm-account-deletion?token={token}";
            var subject = "Confirm Your Account Deletion | Clinitech";
            var logo = "../Backend/assets/image.png";
            var body = $@"
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);'>
                        <div style='text-align: center;'>
                            <img src='{logo}' alt='Clinitech Logo' style='max-width: 150px;' />
                        </div>
                        <h2 style='text-align: center; color: #333;'>Confirm Your Account Deletion</h2>
                        <p style='font-size: 16px; color: #333;'>Dear User,</p>
                        <p style='font-size: 16px; color: #333;'>We have received a request to delete your Clinitech account. If you made this request, please confirm it by clicking the link below:</p>
                        <p style='text-align: center;'>
                            <a href='{confirmationLink}' style='font-size: 16px; color: #ffffff; text-decoration: none; background-color: #dc3545; padding: 10px 20px; border-radius: 5px; display: inline-block;'>Confirm Deletion</a>
                        </p>
                        <p style='font-size: 16px; color: #333;'>If you did not request this deletion, please contact Clinitech support immediately.</p>
                        <p style='font-size: 16px; color: #333;'>Thank you for being a part of Clinitech!</p>
                        <p style='font-size: 16px; color: #333;'>Best regards,</p>
                        <p style='font-size: 16px; color: #333;'>The Clinitech Team</p>
                    </div>
                </body>
            </html>";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendUpdateStaffEmail(string email, string token, PendingChangesStaffDTO updateDto, StaffDTO staff, UserDTO userStaff, bool emailChanged, bool phoneChanged, bool specializationChanged)
        {
            var confirmationLink = $"http://localhost:5173/confirm-update/{token}";
            var subject = "Confirm Your Profile Update | Clinitech";
            var logo = "../Backend/assets/image.png";
            var body = $@"
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);'>
                        <div style='text-align: center;'>
                            <img src= '{logo}' alt='Clinitech Logo' style='max-width: 150px;' />
                        </div>
                        <h2 style='text-align: center; color: #333;'>Confirm Your Profile Update</h2>
                        <p style='font-size: 16px; color: #333;'>Dear {userStaff.Name},</p>
                        <p style='font-size: 16px; color: #333;'>We received a request to update your profile at Clinitech. Please review the changes below and click the link to confirm them:</p>
                        
                        <p style='font-size: 16px; color: #333;'>To confirm the updates, please click on the link below:</p>
                        <p style='font-size: 16px; color: #007bff;'>
                            <a href='{confirmationLink}' style='text-decoration: none; color: #007bff;'>Confirm Update</a>
                        </p>

                        <h3 style='font-size: 18px; color: #333;'>Updated Information:</h3>";

            // Verificando e exibindo as mudanças de forma clara e destacada
            if (emailChanged)
            {
                body += $"<p style='font-size: 16px; color: #333;'><strong>Email:</strong> <span style='color: #000;'>{userStaff.Email}</span> <span style='color: #007bff;'>--> {updateDto.Email}</span></p>";
            }

            if (phoneChanged)
            {
                body += $"<p style='font-size: 16px; color: #333;'><strong>Phone:</strong> <span style='color: #000;'>{userStaff.phoneNumber}</span> <span style='color: #007bff;'>--> {updateDto.PhoneNumber}</span></p>";
            }

            if (specializationChanged)
            {
                var specialization = await _specializationService.GetBySpecializationIdAsync(new SpecializationId(staff.SpecializationId));
                body += $"<p style='font-size: 16px; color: #333;'><strong>Specialization:</strong> <span style='color: #000;'>{specialization.Description}</span> <span style='color: #007bff;'>--> {updateDto.Specialization}</span></p>";
            }


            body += @"
                        <p style='font-size: 16px; color: #333;'>If you did not request these changes, please contact Clinitech support immediately.</p>
                        <p style='font-size: 16px; color: #333;'>Thank you for being a part of Clinitech!</p>
                        <p style='font-size: 16px; color: #333;'>Best regards,</p>
                        <p style='font-size: 16px; color: #333;'>The Clinitech Team</p>
                    </div>
                </body>
            </html>";

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
