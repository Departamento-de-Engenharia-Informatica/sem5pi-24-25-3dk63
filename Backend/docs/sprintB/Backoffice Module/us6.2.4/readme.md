# 1221288 - Gonçalo Carvalho

# As a (non-authenticated) Backoffice User, I want to log in to the system using my credentials, so that I can access the backoffice features according to my assigned role.

# Acceptance Criteria:
- Backoffice users log in using their username and password.
- Role-based access control ensures that users only have access to features appropriate to their
role (e.g., doctors can manage appointments, admins can manage users and settings).
- After five failed login attempts, the user account is temporarily locked, and a notification is
sent to the admin.
- Login sessions expire after a period of inactivity to ensure security.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.4/assets/usecase.png)

# Planning

1-Integrate IAM Provider: Configure authentication via Google, Facebook, or hospital SSO.
2-Redirect Post-Login: Implement redirection with a valid session token after IAM authentication.
3-Profile Features: Develop all fixtures for all roles.
4-Session Management: Set session expiration policies and reauthentication mechanisms.
5-Testing: Validate login flow, session security, and feature access.

# Client Clarifications

N/A

# Tests

1- Verify token creation after successful login.
2- Check redirection to the healthcare system post-login.
3- Validate access to their fixtures correctly.
4- Test session expiration after inactivity.
5- Ensure reauthentication is required after session expiration.
6- Confirm login failure with invalid credentials.
7- Verify logout terminates the session.