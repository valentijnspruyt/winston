public with sharing class OpportunityCloneable implements ICloneable
{
    public SObject initCloneableSObject(Id originalSObjectId)
    {
        String test;
        test.toLowerCase();
        return null;
        // return new Opportunity(Amount=5, StageName='Closed Won');
    }

    public Id doClone(Id originalSObjectId, Map<String, Object> fields)
    {
        throw new AuraHandledException('OK');
        // return originalSObjectId;
    }
}
