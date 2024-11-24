# 1221959 - Diogo Rodrigues

# As a Patient, I want to log in to the healthcare system, so that I can access my appointments, medical records, and other features securely.

# Acceptance Criteria:
-Patients log in via an external Identity and Access Management (IAM) provider (e.g., Google, Facebook, or hospital SSO).
-After successful authentication via the IAM, patients are redirected to the healthcare system with a valid session.
-Patients have access to their appointment history, medical records, and other features relevant to their profile.
-Sessions expire after a defined period of inactivity, requiring reauthentication.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.5/assets/usecase.png)

# Planning

1-Integrate IAM Provider: Configure authentication via Google, Facebook, or hospital SSO.
2-Redirect Post-Login: Implement redirection with a valid session token after IAM authentication.
3-Profile Features: Develop access to appointments, medical records, and patient-specific features.
4-Session Management: Set session expiration policies and reauthentication mechanisms.
5-Testing: Validate login flow, session security, and feature access.

# Client Clarifications

N/A

# Tests

1- Verify token creation after successful login.
2- Check redirection to the healthcare system post-login.
3- Validate access to appointments and medical records after authentication.
4- Test session expiration after inactivity.
5- Ensure reauthentication is required after session expiration.
6- Confirm login failure with invalid credentials.
7- Verify logout terminates the session.