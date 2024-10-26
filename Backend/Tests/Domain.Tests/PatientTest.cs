namespace Domain.Tests;

using System;
using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.Shared;
using Xunit;

public class PatientTest
{
    [Theory]
    [InlineData("2000-01-01", "Male", "John Doe", 1)]
    [InlineData("1995-05-15", "Female", "Jane Smith", 2)]
    [InlineData("2010-10-20", "Other", "Alex Johnson", 3)]
    [InlineData("1980-03-12", "Male", "Michael Brown", 4)]
    [InlineData("1992-11-30", "Female", "Emily White", 5)]
    [InlineData("2003-07-25", "Non-binary", "Taylor Green", 6)]
    public void WhenPassingCorrectData_PatientIsInstantiated(string dob, string gender, string emergencyContactName, int sequentialNumber)
    {
        var dateOfBirth = new DateOfBirth(DateTime.Parse(dob));
        var genderObj = new Gender(gender);
        var emergencyContact = new EmergencyContact(emergencyContactName);

        var patient = new Patient(dateOfBirth, genderObj, emergencyContact, sequentialNumber);

        Assert.NotNull(patient);
        Assert.False(patient.Active);
        Assert.Equal(dateOfBirth, patient.dateOfBirth);
        Assert.Equal(gender, patient.gender.gender);
        Assert.Equal(emergencyContact, patient.emergencyContact);
        Assert.Equal(sequentialNumber, patient.sequentialNumber);
    }

    [Theory]
    [InlineData("2022-03-05", "Male", "Emergency Contact", "Medical history details", 1)]
    [InlineData("2005-06-12", "Female", "Guardian Name", "Previous condition info", 2)]
    [InlineData("2018-01-01", "Other", "Contact Name", "Chronic illness details", 3)]
    [InlineData("1985-09-22", "Non-binary", "Parent Name", "Surgery history", 4)]
    [InlineData("1990-12-05", "Female", "Partner Name", "Allergy details", 5)]
    public void WhenPassingMedicalHistory_PatientIsInstantiatedWithHistory(string dob, string gender, string emergencyContactName, string medicalHistory, int sequentialNumber)
    {
        var dateOfBirth = new DateOfBirth(DateTime.Parse(dob));
        var genderObj = new Gender(gender);
        var emergencyContact = new EmergencyContact(emergencyContactName);
        var medicalHistoryObj = new MedicalHistory(medicalHistory);

        var patient = new Patient(dateOfBirth, genderObj, emergencyContact, medicalHistoryObj, sequentialNumber);

        Assert.NotNull(patient);
        Assert.Equal(medicalHistoryObj, patient.medicalHistory);
    }

    [Theory]
    [InlineData("2000-01-01", "Male", "Guardian", "Medical history 1", 1)]
    [InlineData("1995-05-15", "Female", "Guardian", "Medical history 2", 2)]
    [InlineData("2000-12-01", "Other", "Guardian", "Medical history 3", 3)]
    [InlineData("1980-04-12", "Non-binary", "Guardian", "Medical history 4", 4)]
    public void WhenAddingAppointments_AppointmentHistoryIsUpdated(string dob, string gender, string emergencyContactName, string medicalHistory, int sequentialNumber)
    {
        var dateOfBirth = new DateOfBirth(DateTime.Parse(dob));
        var genderObj = new Gender(gender);
        var emergencyContact = new EmergencyContact(emergencyContactName);
        var medicalHistoryObj = new MedicalHistory(medicalHistory);

        var patient = new Patient(dateOfBirth, genderObj, emergencyContact, medicalHistoryObj, sequentialNumber);

        var appointment1 = new AppointmentHistory(DateTime.UtcNow, "Doctor 1");
        var appointment2 = new AppointmentHistory(DateTime.UtcNow.AddMonths(-3), "Doctor 2");

        patient.AddAppointment(appointment1);
        patient.AddAppointment(appointment2);

        Assert.Equal(2, patient.appointmentHistoryList.Count);
        Assert.Contains(appointment1, patient.appointmentHistoryList);
        Assert.Contains(appointment2, patient.appointmentHistoryList);
    }

    [Theory]
    [InlineData("2020-12-12", "Female", "Emergency Contact", "Allergy details", 7, "Updated medical history 1")]
    [InlineData("1990-07-07", "Male", "Primary Contact", "Initial condition info", 8, "Condition improved 2")]
    [InlineData("2005-05-05", "Non-binary", "Friend Name", "Previous condition", 9, "Improved condition 3")]
    [InlineData("1995-10-20", "Female", "Parent Name", "Health issues", 10, "New diagnosis 4")]
    public void WhenChangingMedicalHistory_MedicalHistoryIsUpdated(string dob, string gender, string emergencyContactName, string initialMedicalHistory, int sequentialNumber, string newMedicalHistory)
    {
        var dateOfBirth = new DateOfBirth(DateTime.Parse(dob));
        var genderObj = new Gender(gender);
        var emergencyContact = new EmergencyContact(emergencyContactName);
        var initialMedicalHistoryObj = new MedicalHistory(initialMedicalHistory);

        var patient = new Patient(dateOfBirth, genderObj, emergencyContact, initialMedicalHistoryObj, sequentialNumber);

        patient.ChangeMedicalHistory(newMedicalHistory);

        Assert.Equal(newMedicalHistory, patient.medicalHistory.medicalHistory);
    }

    [Theory]
    [InlineData("2000-01-01", "Female", "Jane Doe", 10)]
    [InlineData("1992-03-04", "Male", "John Smith", 11)]
    [InlineData("1988-12-12", "Non-binary", "Alex Brown", 12)]
    [InlineData("2001-05-05", "Female", "Emily Johnson", 13)]
    public void WhenMarkingForDeletion_MarkedForDeletionDateIsSet(string dob, string gender, string emergencyContactName, int sequentialNumber)
    {
        var dateOfBirth = new DateOfBirth(DateTime.Parse(dob));
        var genderObj = new Gender(gender);
        var emergencyContact = new EmergencyContact(emergencyContactName);

        var patient = new Patient(dateOfBirth, genderObj, emergencyContact, sequentialNumber);

        patient.MarkForDeletion();

        Assert.NotNull(patient.MarkedForDeletionDate);
        Assert.True(patient.MarkedForDeletionDate > DateTime.UtcNow);
    }
}
