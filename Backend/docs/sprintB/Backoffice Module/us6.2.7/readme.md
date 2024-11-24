# 1221265 - Hugo Medeiros

# 6.2.7 - Admin: Edit an Existing Patient Profile

## As an admin, I want to edit an existing patient profile, so that I can update their information when needed.

### Acceptance Criteria:
- Admins can search for an existing patient profile using the patient ID or other identifying information.
- The admin can edit personal details such as name, contact information, medical history, and assigned doctor or department.
- The system validates any changes made to the profile to ensure the data is correct and complete.
- Once changes are made, the updated information is saved, and the patient receives a notification email about the update.
- Admins can track the history of changes made to the patient profile (e.g., who made the change and when).
- The system should allow the admin to undo or revert certain changes if necessary.

### Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.7/assets/usecase.png)

### Planning

1. **Search Functionality**: Implement a search feature to allow admins to easily locate patient profiles by patient ID or other identifiers.
2. **Edit Interface**: Develop an interface where admins can modify personal and medical information of a patient.
3. **Data Validation**: Apply validation rules to ensure that all changes made to the profile are correct and complete.
4. **Change Notification**: Set up a notification system to send the patient an email when their profile is updated.
5. **Change History Tracking**: Implement a system to track changes made to patient profiles, including who made the changes and when.
6. **Undo Changes**: Provide functionality to undo or revert specific changes made to the patient profile.
7. **Testing**: Test the profile editing process, including search, data validation, change notifications, and history tracking.

### Client Clarifications

N/A

### Tests

1. Verify that the admin can successfully search and locate an existing patient profile.
2. Test the ability of the admin to edit and update the patient's personal and medical information.
3. Ensure the system validates the changes made to the patient profile.
4. Verify that the patient receives a notification email after their profile is updated.
5. Test the functionality to track changes made to the patient profile, including change history.
6. Confirm that the admin can undo or revert specific changes to the patient profile if necessary.


