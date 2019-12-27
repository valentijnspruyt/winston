public class FieldSetField
{
    @AuraEnabled
    public Boolean dbRequired;
    @AuraEnabled
    public String apiName;
    @AuraEnabled
    public String label;
    @AuraEnabled
    public Boolean required;
    @AuraEnabled
    public String type;

    public FieldSetField(Schema.FieldSetMember fieldSetMember)
    {
        this.dbRequired = fieldSetMember.dbRequired;
        this.apiName = fieldSetMember.fieldPath;
        this.label = fieldSetMember.label;
        this.required = fieldSetMember.required;
        this.type = String.valueOf(fieldSetMember.getType());
    }
}
