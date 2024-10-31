using System;
using DDDSample1.Domain.Staff;
using Xunit;

namespace Domain.Tests
{
    public class LicenseNumberTests
    {
        [Fact]
        public void Constructor_ShouldSetNumberCorrectly()
        {
            var validLicense = "AB123-CD";

            var licenseNumber = new LicenseNumber(validLicense);

            Assert.Equal(validLicense, licenseNumber.AsString());
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenLicenseNumberIsEmpty()
        {
            var invalidLicense = "";

            var ex = Assert.Throws<ArgumentException>(() => new LicenseNumber(invalidLicense));
            Assert.Equal("Invalid license number format.", ex.Message);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenLicenseNumberIsInvalid()
        {
            var invalidLicense = "AB123!CD";

            var ex = Assert.Throws<ArgumentException>(() => new LicenseNumber(invalidLicense));
            Assert.Equal("Invalid license number format.", ex.Message);
        }

        [Fact]
        public void IsValid_ShouldReturnTrue_ForValidLicenseNumber()
        {
            var validLicense = "AB123-CD";

            var result = LicenseNumber.IsValid(validLicense);

            Assert.True(result);
        }

        [Fact]
        public void IsValid_ShouldReturnFalse_ForInvalidLicenseNumber()
        {
            var invalidLicense = "AB123!CD";

            var result = LicenseNumber.IsValid(invalidLicense);

            Assert.False(result);
        }

        [Fact]
        public void AsString_ShouldReturnCorrectValue()
        {
            var validLicense = "AB123-CD";
            var licenseNumber = new LicenseNumber(validLicense);

            var result = licenseNumber.AsString();

            Assert.Equal(validLicense, result);
        }
    }
}
