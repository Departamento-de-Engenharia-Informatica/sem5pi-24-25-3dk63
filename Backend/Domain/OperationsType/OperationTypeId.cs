using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;


namespace DDDSample1.Domain.OperationsType
{
    public class OperationTypeId : EntityId
    {
        
        [JsonConstructor]
        public OperationTypeId(Guid value) : base(value){}

        public OperationTypeId(String value) : base(value)
        {

        }

        override
        protected Object createFromString(String text){
            return new Guid(text);
        }

        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }


        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}