# 1221265 - Hugo Medeiros

# 6.2.1 - Patient: Register for the Healthcare Application

## As a patient, I want to register for the healthcare application, so that I can create a user profile and book appointments online.

### Acceptance Criteria:
- Patients can register in the application by providing personal information such as full name, date of birth, gender, contact details, and medical history (optional).
- The system validates the registration data and sends a confirmation email to the patient.
- After registration, the patient can log into the application using the provided credentials (username and password).
- The patient's profile is automatically created after registration confirmation, and the patient can complete their personal information later.
- The patient can book appointments online directly through the system after registration.

### Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.1/assets/usecase.png)

### Planning

1. **Registration System Integration**: Develop the functionality for patient registration in the system, with data validation.
2. **Authentication and Profile Creation**: Implement the authentication flow with validation of username and password.
3. **Data Validation**: Add checks for required and optional data to ensure the patient's profile is correctly created.
4. **Confirmation Email**: Implement an email confirmation mechanism after registration for the patient.
5. **Appointment Booking Feature**: Allow the patient to book appointments online after their profile is created.
6. **Testing**: Validate the registration flow, profile creation, and appointment booking functionality.

### Client Clarifications

N/A

### Tests

1. Verify that registration is successfully completed after entering patient information.
2. Test the validation of required and optional data during registration.
3. Confirm that a confirmation email is sent after patient registration.
4. Validate the creation of the patient's profile after registration confirmation.
5. Test the patient login flow after registration.
6. Verify the appointment booking feature after registration.
7. Test access to the patient profile and appointment schedule after login.
