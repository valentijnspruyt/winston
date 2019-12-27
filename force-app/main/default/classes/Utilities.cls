public with sharing class Utilities
{
    @AuraEnabled(cacheable = true)
    public static List<FieldSetField> getFieldSetFieldsByFieldSetName(String objectApiName, String fieldSetName)
    {
        try
        {
            List<Schema.FieldSetMember> fieldSetMembers = ((SObject)Type.forName(objectApiName).newInstance()).getSObjectType().getDescribe().FieldSets.getMap().get(fieldSetName).getFields();
            List<FieldSetField> fields = new List<FieldSetField>();

            for (Schema.FieldSetMember fieldSetMember : fieldSetMembers)
            {
                FieldSetField fieldSetField = new FieldSetField(fieldSetMember);
                fields.add(fieldSetField);
            }

            return fields;
        }
        catch(Exception exceptionInstance)
        {
            throw new AuraHandledException(exceptionInstance.getStackTraceString());
        }
    }

    @AuraEnabled
    public static SObject executeInitCloneableSObject(String cloneableClassName, Id originalSObjectId)
    {
        try{
            ICloneable cloneableInstance = getCloneableInstance(cloneableClassName);
            return cloneableInstance.initCloneableSObject(originalSObjectId);
        }
        catch(Exception exceptionInstance)
        {
            throw new AuraHandledException(exceptionInstance.getMessage());
        }
    }

    @AuraEnabled
    public static Id executeClone(String cloneableClassName, Id originalSObjectId, Map<String,Object> fieldsMap)
    {
        try{
            ICloneable cloneableInstance = getCloneableInstance(cloneableClassName);
            return cloneableInstance.doClone(originalSObjectId, fieldsMap);
        }
        catch(Exception exceptionInstance)
        {
            throw new AuraHandledException(exceptionInstance.getMessage());
        }
    }

    private static ICloneable getCloneableInstance(String cloneableClassName)
    {
        Type classType = Type.forName(cloneableClassName);
        return (ICloneable)classType.newInstance();
    }
}
