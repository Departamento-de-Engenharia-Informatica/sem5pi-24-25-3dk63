# 1221265 - Hugo Medeiros

# 6.2.6 - Admin: Create a New Patient Profile

## As an admin, I want to create a new patient profile, so that I can register their personal details and medical history.

### Acceptance Criteria:
- Admins can create a new patient profile by entering personal information such as full name, date of birth, gender, contact details, and medical history (optional).
- The admin can assign a unique patient ID to the profile.
- The system validates the provided data to ensure completeness and correctness.
- Once the profile is created, the patient receives a confirmation email with their profile details.
- The admin can edit and update the patient profile as needed after creation.
- The admin can assign the patient to specific doctors or departments as part of the registration process.

### Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.6/assets/usecase.png)

### Planning

1. **Admin Interface Development**: Build an interface for admins to input and manage new patient profiles.
2. **Data Validation**: Implement validation rules to ensure required fields are filled and the data is valid.
3. **Unique Patient ID Assignment**: Develop a system to automatically assign a unique patient ID upon profile creation.
4. **Confirmation Email**: Set up a system to send a confirmation email to the patient with their profile details after registration.
5. **Profile Editing and Management**: Allow admins to edit and update patient profiles after initial creation.
6. **Testing**: Test the admin interface, data validation, patient profile creation, and confirmation email functionality.

### Client Clarifications

N/A

### Tests

1. Verify that the admin can successfully create a new patient profile with all required details.
2. Test the validation of patient data during profile creation.
3. Ensure a unique patient ID is generated for each new profile.
4. Verify that the patient receives a confirmation email after their profile is created.
5. Test the ability of the admin to edit and update patient profiles after creation.
6. Confirm that the system assigns the correct doctor or department during profile creation.

