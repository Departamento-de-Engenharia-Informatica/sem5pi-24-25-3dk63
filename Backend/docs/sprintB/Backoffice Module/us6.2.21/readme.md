# 1221265 - Hugo Medeiros

# 6.2.21 - Admin: List/Search Operation Types

## As an admin, I want to list/search operation types, so that I can see the details, edit, and remove operation types.

### Acceptance Criteria:
- Admins can search for operation types by name, description, or unique identifier.
- The admin can view a list of all operation types with key details (e.g., name, description, procedure duration, required resources).
- The admin can select an operation type from the list to view its full details.
- Admins can edit or remove operation types from the list based on their needs.
- The system should support pagination and filtering for large lists of operation types.
- When an operation type is removed, it is permanently deleted from the system, and a confirmation prompt is shown before removal.
- The admin can edit or remove operation types only if they have the appropriate permissions.
- Changes or removals are logged, including the admin's identity and timestamp of the action.

### Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.21/assets/usecase.png)

### Planning

1. **Search and List Functionality**: Implement a search feature to allow admins to find operation types based on various criteria (name, description, ID).
2. **View Details**: Develop a list interface where admins can click on operation types to view their full details.
3. **Edit and Remove Options**: Provide options for admins to edit or remove operation types directly from the list view.
4. **Pagination and Filtering**: Implement pagination and filtering to handle large lists of operation types efficiently.
5. **Confirmation Prompt for Removal**: Set up a confirmation step before removing an operation type to avoid accidental deletions.
6. **Permissions Management**: Ensure that only authorized admins can edit or remove operation types.
7. **Action Logging**: Log all actions related to editing and removing operation types, including the admin's identity and timestamp.
8. **Testing**: Test the search, listing, editing, removal, and action logging functionalities.

### Client Clarifications

N/A

### Tests

1. Verify that the admin can search for operation types by name, description, or ID.
2. Test the ability of the admin to view full details of an operation type from the list.
3. Ensure that the admin can edit operation types from the list.
4. Confirm that the admin can remove operation types from the list with a confirmation prompt.
5. Test pagination and filtering when viewing a large number of operation types.
6. Verify that the system logs edits and removals, including the admin's identity and timestamp.
7. Ensure that only authorized admins can edit or remove operation types.
