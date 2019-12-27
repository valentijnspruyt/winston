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
    public static SObject doInitSObject(String customQuickActionHandler, Id originalSObjectId)
    {
        try{
            QuickActionHandler quickActionHandlerInstance = getQuickActionHandler(customQuickActionHandler);
            return quickActionHandlerInstance.initSObject(originalSObjectId);
        }
        catch(Exception exceptionInstance)
        {
            throw new AuraHandledException(exceptionInstance.getMessage());
        }
    }

    @AuraEnabled
    public static Id doSave(String customQuickActionHandler, Id originalSObjectId, SObject fieldsMap)
    {
        try{
            QuickActionHandler quickActionHandlerInstance = getQuickActionHandler(customQuickActionHandler);
            return quickActionHandlerInstance.doSave(originalSObjectId, fieldsMap);
        }
        catch(Exception exceptionInstance)
        {
            throw new AuraHandledException(exceptionInstance.getMessage());
        }
    }

    private static QuickActionHandler getQuickActionHandler(String customQuickActionHandler)
    {
        Type classType = Type.forName(customQuickActionHandler);
        return (QuickActionHandler)classType.newInstance();
    }
}
