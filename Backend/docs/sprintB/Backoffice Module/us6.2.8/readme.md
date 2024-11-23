# 1221288 - Gonçalo Carvalho

# As an Admin, I want to delete a patient profile, so that I can remove patients who are no longer under care

# Acceptance Criteria:
- Admins can search for a patient profile and mark it for deletion.
- Before deletion, the system prompts the admin to confirm the action.
- Once deleted, all patient data is permanently removed from the system within a predefined
time frame.
- The system logs the deletion for audit and GDPR compliance purposes.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.8/assets/usecase.png)

## Planning

1. **Search and Select**:
   - Implement a search feature for patient profiles with filters.
   - Allow admins to select a profile for deletion.

2. **Confirmation Popup**:
   - Develop a modal or popup component prompting the admin for confirmation.
   - Include a warning about the consequences of deletion (e.g., "This action cannot be undone.").

3. **Deletion Logic**:
   - Update backend to handle deletion requests securely.
   - Ensure data is marked for deletion in accordance with GDPR guidelines (e.g., grace period).

4. **Logging and Compliance**:
   - Add logging functionality to record all deletion events.
   - Include metadata such as admin ID, timestamp, and patient ID.

---

## Client Clarifications

**N/A**

---

## Tests

### Authentication
1. Verify that only authenticated admins can access the delete functionality.
2. Ensure unauthorized users receive an appropriate error message when attempting to delete a profile.

### Deletion Workflow
3. Confirm that the search feature works and displays the correct patient profiles.
4. Validate that selecting a profile and confirming deletion removes the data from the system.
5. Test that canceling the deletion does not affect patient data.

### Logging and GDPR Compliance
6. Ensure that a log entry is created for each deletion event, including relevant metadata.
7. Confirm that deleted data is marked for removal and not immediately purged from the system (grace period).

### Edge Cases
8. Test the behavior when trying to delete a profile that does not exist.
9. Verify that the system handles database errors gracefully during the deletion process.