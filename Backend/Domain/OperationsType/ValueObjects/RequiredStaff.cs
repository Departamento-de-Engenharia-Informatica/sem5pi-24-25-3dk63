using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationsType
{
    // Classe que representa uma especialização e a quantidade de funcionários necessários
    public class RequiredStaff : IValueObject
    {
        public int RequiredNumber { get; private set; }

        public RequiredStaff(int requiredNumber)
        {
            if (requiredNumber <= 0)
            {
                throw new BusinessRuleValidationException("Number of required staff must be bigger than 0.");
            }

            this.RequiredNumber = requiredNumber;
        }

        public override string ToString()
        {
            return this.RequiredNumber.ToString();
        }

    }
}
