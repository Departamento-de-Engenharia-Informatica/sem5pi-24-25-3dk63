# 1221959 - Diogo Rodrigues

# As an Admin, I want to add new types of operations, so that I can reflect on the available medical procedures in the system.

# Acceptance Criteria:
-Admins can add new operation types with attributes like:
        Operation Name
        Required Staff by Specialization
        Estimated Duration
-The system validates that the operation name is unique.
-The system logs the creation of new operation types and makes them available for scheduling
immediately.


# Use Case

![UseCaseDiagram](/Backend/docs/sprintB/Backoffice%20Module/us6.2.18/assets/usecase.png)

# Planning

1- Create Input Form: Develop a form for admins to input new operation type details, including:
        Operation Name
        Required Staff by Specialization
        Estimated Duration
2- Validation: Implement a check to ensure operation names are unique and required fields are completed.
3- Logging: Log the creation of new operation types for auditing purposes.
4- Immediate Availability: Make new operation types immediately accessible for scheduling after validation.
5- Testing: Validate the form functionality, data persistence, and scheduling availability.

# Client Clarifications

*Question US5.1.21 - Edit Operation Type

In a previous answer you stated that "The type of operation is associated with a given specialty".
In another answer you said "a team of 1 doctor with specialization X and one nurse with specialization Y" (regarding the required staff for a said type of operation).
From the specifications document and the additional document with the 10 most common types of operations, we have two specializations: orthopedics and cardiology.
My question is: If the operation type already has a specialization associated, how can we have staff with different specializations?
What do you understand by specialization? Is it cardiology/orthopedics? Or anaesthesist/circulating/...

*Answer

The operation is mainly associated with one specialization, but for a specific operation it might require a team with multiple specializations.
cardiology, orthopedics, anaesthesist are specializations that either doctors or nurses can have.
the circulating technician is a different type of medical professional. for now the system doesn't need to support technicians

# Tests

1- Verify that admins can access and use the form to input new operation types.
2- Ensure operation names are validated for uniqueness during creation.
3- Test if required staff by specialization is correctly saved and associated with the operation type.
4- Confirm that estimated duration fields are properly stored and formatted.
5- Validate the immediate availability of new operation types for scheduling.
6- Test that operation type creation is logged for auditing purposes.
7- Check error handling for:
8- Duplicate operation names.
9- Missing required fields.
10- Invalid input formats (e.g., negative durations or staff counts).
11- Confirm the user receives feedback (e.g., success or error messages) after submitting the form.
12- Test permissions to ensure only admins can create operation types.
13- Verify historical records of newly created operation types in the log system.
