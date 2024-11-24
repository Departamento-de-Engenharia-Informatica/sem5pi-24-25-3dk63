# 1221265 - Hugo Medeiros

# 6.2.19 - Admin: Edit Existing Operation Types

## As an admin, I want to edit existing operation types, so that I can update or correct information about the procedure.

### Acceptance Criteria:
- Admins can search for and locate existing operation types using the operation type name or unique identifier.
- The admin can edit details of the operation type, including the procedure name, description, duration, and any associated resources or equipment.
- The system validates the updated information to ensure it is correct and complete.
- Once changes are made, the system updates the operation type, and all related data across the system is refreshed accordingly.
- The system logs the changes made to the operation type, including who made the edit and when.
- Admins can cancel the editing process at any time without saving the changes.
- The updated operation type information is reflected in the relevant sections of the system (e.g., scheduling, resource management).
- Admins can view a history of changes made to the operation type for tracking purposes.

### Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.19/assets/usecase.png)

### Planning

1. **Search Functionality**: Implement a search feature that allows admins to easily find operation types by name or ID.
2. **Editing Interface**: Develop an interface for admins to view and modify details of existing operation types.
3. **Data Validation**: Implement validation rules to ensure that all changes to operation types are accurate and complete.
4. **Update Operation Type**: Ensure that once changes are made, the operation type is updated across the system, including any associated data (e.g., scheduling, equipment requirements).
5. **Change Logging**: Log all changes made to operation types, tracking the admin’s identity and timestamp.
6. **Cancel Changes Option**: Provide an option for admins to cancel the editing process without saving changes.
7. **Testing**: Test the search, editing, validation, updating, and logging functionality to ensure the system works as expected.

### Client Clarifications

N/A

### Tests

1. Verify that the admin can successfully search for and locate an existing operation type.
2. Test the functionality of editing operation type details, including name, description, and associated resources.
3. Ensure the system validates the edited information correctly.
4. Confirm that changes made to the operation type are reflected across the system.
5. Verify that the system logs the changes, including the admin's identity and timestamp.
6. Test the ability to cancel edits without saving changes.
7. Ensure that the operation type history is accessible and displays correct change information.
