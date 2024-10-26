using System;
using System.Text.RegularExpressions;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class MedicalRecordNumber : EntityId
    {
        private readonly string _value;

        // Constructor
        public MedicalRecordNumber(string value) : base(value)
        {
            if (string.IsNullOrWhiteSpace(value) || !IsValidFormat(value))
            {
                throw new ArgumentException("Invalid Medical Record Number format.");
            }
            _value = value;
        }

        private bool IsValidFormat(string value)
        {
            // Verifica se o formato corresponde a YYYYMMnnnnnn (12 dígitos)
            return Regex.IsMatch(value, @"^\d{12}$"); 
        }

        protected override object createFromString(string text)
        {
            if (!IsValidFormat(text))
            {
                throw new ArgumentException("Invalid medical record number format.");
            }
            return text;
        }

        public override string AsString()
        {
            return _value; // Retorna o valor do campo privado
        }

        public static string GenerateNewRecordNumber(DateTime registrationDate, int sequentialNumber)
        {
            string year = registrationDate.ToString("yyyy");
            string month = registrationDate.ToString("MM");
            string seqNum = sequentialNumber.ToString("D6");
            return year + month + seqNum;
        }

        public override string ToString()
        {
            return _value; // Usar _value em vez de Value
        }

        public static bool operator ==(MedicalRecordNumber left, MedicalRecordNumber right)
        {
            // Verifica se ambos são nulos
            if (ReferenceEquals(left, right))
                return true;

            // Verifica se um dos dois é nulo
            if (left is null || right is null)
                return false;

            // Compara os valores
            return left._value == right._value; // Usar _value aqui
        }

        public static bool operator !=(MedicalRecordNumber left, MedicalRecordNumber right)
        {
            return !(left == right);
        }

        public override bool Equals(object obj)
        {
            if (obj is MedicalRecordNumber other)
            {
                return this == other;
            }
            return false;
        }

        public override int GetHashCode()
        {
            return _value.GetHashCode(); // Usar _value em vez de Value
        }
    }
}
