public interface QuickActionHandler
{
    SObject initSObject(Id originalSObjectId);
    Id doSave(Id originalSObjectId, SObject fields);
}
