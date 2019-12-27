public interface ICloneable
{
    SObject initCloneableSObject(Id originalSObjectId);
    Id doClone(Id originalSObjectId, Map<String, Object> fields);
}
