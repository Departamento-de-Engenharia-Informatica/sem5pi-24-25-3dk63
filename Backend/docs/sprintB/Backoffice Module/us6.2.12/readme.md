# 1221959 - Diogo Rodrigues

# As an Admin, I want to deactivate a staff profile, so that I can remove them from the hospital’s active roster without losing their historical data.

# Acceptance Criteria:
-Admins can search for and select a staff profile to deactivate.
-Deactivating a staff profile removes them from the active roster, but their historical data (e.g., appointments) remains accessible.
-The system confirms deactivation and records the action for audit purposes.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.12/assets/usecase.png)

# Planning

1- Search Staff Profiles: Implement a search functionality for locating staff profiles.
2- Deactivate Profile: Add an option to deactivate staff profiles, ensuring only authorized users can perform this action.
3- Historical Data Retention: Ensure deactivated profiles are removed from the active roster but retain access to historical data (e.g., appointments).
4- Confirmation and Audit Logging: Implement a confirmation step for deactivation and log the action for auditing.
5- Testing: Validate deactivation, data retention, and audit log functionality.

# Client Clarifications

N/A

# Tests

1- Verify that staff profiles can be searched and selected for deactivation.
2- Confirm that deactivating a profile removes it from the active roster.
3- Validate that historical data (e.g., appointments) remains accessible post-deactivation.
4- Ensure the system logs deactivation actions for auditing purposes.
5- Test the confirmation step to prevent accidental deactivation.
6- Verify unauthorized users cannot deactivate staff profiles.
7- Check for proper error handling if the deactivation process fails.