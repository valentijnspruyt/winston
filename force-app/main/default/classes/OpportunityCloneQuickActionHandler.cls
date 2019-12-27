public with sharing class OpportunityCloneQuickActionHandler implements QuickActionHandler
{
    public SObject initSObject(Id originalSObjectId)
    {
        return new Opportunity(Amount=5, StageName='Closed Won', isPrivate=true);
    }

    public Id doSave(Id originalSObjectId, SObject fields)
    {
        return originalSObjectId;
    }
}
