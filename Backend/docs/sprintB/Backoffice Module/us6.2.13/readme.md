# 1221288 - Gonçalo Carvalho

# As an Admin, I want to list/search staff profiles, so that I can see the details, edit, and remove staff profiles.

# Acceptance Criteria:
- Admins can search staff profiles by attributes such as name, email, or specialization.
- The system displays search results in a list view with key staff information (name, email,
specialization).
- Admins can select a profile from the list to view, edit, or deactivate.
The search results are paginated, and filters are available for refining the search results.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.13/assets/usecase.png)

## Planning

1. **Search and Filter Implementation**:
   - Develop a backend API to support search functionality across attributes (e.g., name, email, specialization).
   - Add support for query parameters to enable filtering by department, role, or status.

2. **Frontend List View**:
   - Design and implement a list view to display search results with key staff information.
   - Include pagination controls to navigate large datasets.

3. **Profile Actions**:
   - Ensure clicking on a profile opens a detailed view with options to edit or deactivate.
   - Create separate components/pages for editing and deactivating staff profiles.

4. **Testing and Validation**:
   - Write unit tests for API endpoints and UI components.
   - Implement integration tests to validate the end-to-end flow.

---

## Client Clarifications

**N/A**

---

## Tests

### Search Functionality
1. Verify that staff profiles can be searched using:
   - Name.
   - Email.
   - Specialization.
2. Confirm that search results match the provided criteria.
3. Ensure the search is case-insensitive and supports partial matches (e.g., "Smith" matches "John Smith").

### List View
4. Verify that the list view displays key staff information (name, email, specialization).
5. Test pagination to ensure results are divided correctly across pages.
6. Validate that filters refine search results as expected (e.g., by role, department, or status).

### Profile Actions
7. Confirm that selecting a profile opens a detailed view.
8. Verify that editing a staff profile updates the information correctly.
9. Test that deactivating a staff profile triggers a confirmation popup and logs the action.

### Edge Cases
10. Test behavior when no results are found for a search.
11. Verify system response to invalid inputs (e.g., special characters or incomplete email addresses).
12. Check for proper error handling if the backend API is unavailable or returns an error.