# 1221959 - Diogo Rodrigues

# As an Admin, I want to remove obsolete or no longer performed operation types, so that the system stays current with hospital practices.

# Acceptance Criteria:
-Admins can search for and mark operation types as inactive (rather than deleting them) to preserve historical records.
-Inactive operation types are no longer available for future scheduling but remain in historical data.
-A confirmation prompt is shown before deactivating an operation type.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.20/assets/usecase.png)

# Planing

1- Search and Selection: Implement a search feature for admins to locate operation types.
2- Mark as Inactive: Add functionality to mark an operation type as inactive, ensuring historical data is retained.
3- Confirmation Prompt: Include a modal or dialog box to confirm the action before marking an operation type as inactive.
4- Data Integrity: Ensure inactive operation types are excluded from future scheduling but remain accessible in historical records.
5- Logging: Log all deactivation actions for audit purposes.
6- Testing: Validate all steps to ensure smooth functionality.

# Client Clarifications 

N/A

# Tests 

1- Search Functionality
2- Deactivate Operation Type
3- Confirmation Prompt
4- Audit Logging
5- Error Handling
6- Visual Feedback