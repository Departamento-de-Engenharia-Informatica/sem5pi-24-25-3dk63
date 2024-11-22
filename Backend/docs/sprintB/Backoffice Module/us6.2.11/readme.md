# 1221959 - Diogo Rodrigues

# As an Admin, I want to edit a staff’s profile, so that I can update their information

# Acceptance Criteria:
-Admins can search for and select a staff profile to edit.
-Editable fields include contact information, availability slots, and specialization.
-The system logs all profile changes, and any changes to contact information trigger aconfirmation email to the staff member.
-The edited data is updated in real-time across the system.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.11/assets/usecase.png)

# Planing

1- Search Staff Profiles: Implement a search functionality to locate staff profiles.
2- Edit Profile: Enable editing of contact information, availability slots, and specialization.
3- Change Logging: Implement logging of all profile changes.
4- Email Confirmation: Send confirmation emails for contact information updates.
5- Real-Time Updates: Ensure data changes reflect across the system in real-time.
6- Testing: Validate each feature, including logging, email, and real-time updates.

# Client Clarifications 

N/A

# Tests 

1- Verify the search functionality displays correct staff profiles.
2- Confirm the ability to edit contact information, availability, and specialization fields.
3- Validate that updates to contact information trigger confirmation emails.
4- Check logs to ensure all profile changes are recorded.
5- Verify real-time synchronization of edited data across the system.
6- Test with invalid or incomplete inputs and ensure proper error handling.
7- Ensure edits made by unauthorized users are blocked.
