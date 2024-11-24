# 1221265 - Hugo Medeiros

# 6.2.16 - Doctor: Remove an Operation Requisition

## As a doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary.

### Acceptance Criteria:
- Doctors can search for and locate existing operation requisitions using patient ID, requisition number, or other identifying information.
- The doctor can select a requisition and choose to remove or cancel it.
- The system asks for confirmation before removing the requisition to avoid accidental deletions.
- Once removed, the requisition is no longer visible in the system and the relevant stakeholders (e.g., patient, medical staff) are notified about the cancellation.
- The removal action is logged in the system, including who removed the requisition and the timestamp of the action.
- The doctor can view a history of removed requisitions and restore them if needed (if applicable).
  
### Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.16/assets/usecase.png)

### Planning

1. **Search Functionality**: Implement a search feature to allow doctors to easily find operation requisitions by patient ID or requisition number.
2. **Requisition Removal Interface**: Develop an interface for doctors to select and remove a requisition from the system.
3. **Confirmation Step**: Implement a confirmation step to verify that the doctor intends to remove the requisition, preventing accidental deletions.
4. **Notification System**: Set up notifications to inform relevant stakeholders (patients, medical staff, etc.) about the requisition removal.
5. **Logging of Action**: Ensure the system logs the action of requisition removal, tracking the doctor’s identity and timestamp.
6. **Requisition History and Restoration**: Provide functionality to track removed requisitions and restore them if necessary.
7. **Testing**: Test the requisition removal process, including searching, removing, confirming, logging actions, and sending notifications.

### Client Clarifications

N/A

### Tests

1. Verify that the doctor can successfully search for and locate an existing operation requisition.
2. Test the functionality for the doctor to remove the requisition after selecting it.
3. Ensure that the system asks for confirmation before permanently removing a requisition.
4. Verify that stakeholders (e.g., patient, medical staff) receive notifications after a requisition is removed.
5. Test that the action of requisition removal is logged correctly, with the doctor’s identity and timestamp.
6. Check that removed requisitions can be restored (if applicable).



