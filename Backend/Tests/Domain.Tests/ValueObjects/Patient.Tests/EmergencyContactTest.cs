using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Xunit;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class EmergencyContactTest
    {
        [Fact]
        public void GivenValidEmergencyContact_WhenConstructed_ThenEmergencyContactShouldBeCreated()
        {
            // Arrange
            var contact = "John Doe, +123456789";

            // Act
            var emergencyContact = new EmergencyContact(contact);

            // Assert
            Assert.Equal(contact, emergencyContact.emergencyContact);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void GivenInvalidEmergencyContact_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(string invalidContact)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new EmergencyContact(invalidContact));
            Assert.Equal("Emergency Contact can't be null or empty.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnEmergencyContact()
        {
            // Arrange
            var contact = "Jane Doe, +987654321";
            var emergencyContact = new EmergencyContact(contact);

            // Act
            var result = emergencyContact.ToString();

            // Assert
            Assert.Equal(contact, result);
        }

        [Theory]
        [InlineData("John Doe, +123456789")]
        [InlineData("Jane Smith, +987654321")]
        public void GivenTwoIdenticalEmergencyContacts_WhenCompared_ThenTheyShouldBeEqual(string contact)
        {
            // Arrange
            var contact1 = new EmergencyContact(contact);
            var contact2 = new EmergencyContact(contact);

            // Act & Assert
            Assert.Equal(contact1, contact2);
        }

        [Theory]
        [InlineData("John Doe, +123456789", "Jane Doe, +987654321")]
        [InlineData("Alice, +111111111", "Bob, +222222222")]
        public void GivenTwoDifferentEmergencyContacts_WhenCompared_ThenTheyShouldNotBeEqual(string contact1, string contact2)
        {
            // Arrange
            var emergencyContact1 = new EmergencyContact(contact1);
            var emergencyContact2 = new EmergencyContact(contact2);

            // Act & Assert
            Assert.NotEqual(emergencyContact1, emergencyContact2);
        }
    }
}
