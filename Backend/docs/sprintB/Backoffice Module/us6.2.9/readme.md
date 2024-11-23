# 1221288 - Gonçalo Carvalho

# As an Admin, I want to list/search patient profiles by different attributes, so that I can view the details, edit, and remove patient profiles.

# Acceptance Criteria:
- Admins can search patient profiles by various attributes, including name, email, date of birth,
or medical record number.
8
- The system displays search results in a list view with key patient information (name, email, date
of birth).
- Admins can select a profile from the list to view, edit, or delete the patient record.
The search results are paginated, and filters are available to refine the search results.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.9/assets/usecase.png)

## Planning

1. **Search and Filter Implementation**:
   - Develop a backend API to support search functionality across multiple attributes (e.g., name, email).
   - Add support for query parameters to enable filtering by date range, gender, or status.

2. **Frontend List View**:
   - Design and implement a list view to display search results with key patient information.
   - Include pagination controls to navigate large datasets.

3. **Profile Actions**:
   - Ensure clicking on a profile opens a detailed view with options to edit or delete.
   - Create separate components/pages for editing and deleting patient profiles.

---

## Client Clarifications

**N/A**

---

## Tests

### Search Functionality
1. Verify that patient profiles can be searched using:
   - Name.
   - Email.
   - Date of birth.
   - Medical record number.
2. Confirm that search results match the provided criteria.
3. Ensure the search is case-insensitive and handles partial matches (e.g., "John" matches "John Doe").

### List View
4. Verify that the list view displays key patient information (name, email, date of birth).
5. Test pagination to ensure results are divided correctly across pages.
6. Validate that filters refine search results as expected (e.g., age range or status).

### Profile Actions
7. Confirm that selecting a profile opens a detailed view.
8. Verify that editing a patient profile updates the information correctly.
9. Test that deleting a patient profile triggers a confirmation popup and logs the action.

### Edge Cases
10. Test behavior when no results are found for a search.
11. Verify system response to invalid inputs (e.g., special characters or incomplete email addresses).
12. Check for proper error handling if the backend API is unavailable or returns an error.