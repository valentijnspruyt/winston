import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import { buildExceptionMessages } from 'c/utilities';

import Clone from '@salesforce/label/c.Clone';

import getFieldSetFieldsByFieldSetName from '@salesforce/apex/Utilities.getFieldSetFieldsByFieldSetName';
import executeClone from '@salesforce/apex/Utilities.executeClone';
import executeInitCloneableSObject from '@salesforce/apex/Utilities.executeInitCloneableSObject';

export default class ObjectClone extends NavigationMixin(LightningElement) {

    labels = {
        Clone
    }

    @api recordId;
    @api objectApiName;
    @api recordTypeId;
    @api cloneableClassName;
    @api numberOfColumns;
    @api fieldsToFetchFieldSet;

    @track fieldSetFields = [];
    @track fieldNamesToFetch = [];
    @track errorMessages = [];
    @track initializedSObject;

    @wire(getFieldSetFieldsByFieldSetName, {objectApiName: '$objectApiName', fieldSetName: '$fieldsToFetchFieldSet'})
    wiredFieldsToFetchFieldSet({data, error}){
        if(data)
        {
            this.fieldSetFields = data;
            this.fieldNamesToFetch = this.fieldSetFields.map(fieldSetField => { return `${this.objectApiName}.${fieldSetField.apiName}`});
        }
        if(error)
        {
            this.handleException(error);
        }
    }

    @wire(getRecord, {recordId: '$recordId', fields: '$fieldNamesToFetch'})
    wiredObject;

    get fields()
    {
        let fields = [];
        if(this.wiredObject && this.wiredObject.data && this.fieldSetFields && this.fieldSetFields.length)
        {
            fields = this.fieldSetFields.map(field => {
                let value = getFieldValue(this.wiredObject.data, `${this.objectApiName}.${field.apiName}`);
                return {
                    apiName: field.apiName,
                    value : value,
                    required : field.required
                };
            });

        }
        return fields;
    }

    get initializedSObjectfields()
    {
        let fields = [];
        if(this.initializedSObject)
        {
            fields = this.fieldSetFields.map(field => {
                let value = this.initializedSObject[field.apiName];
                return {
                    apiName: field.apiName,
                    value : value,
                    required : field.required
                };
            });
        }
        return fields;
    }

    get columnSize()
    {
        return Math.round(12/this.numberOfColumns);
    }

    get hasErrorMessages()
    {
        return this.errorMessages.length > 0;
    }

    async connectedCallback()
    {
        try{
            this.initializedSObject = await executeInitCloneableSObject({
                originalSObjectId:this.recordId,
                cloneableClassName: this.cloneableClassName
            });
        }
        catch(exception)
        {
            this.handleException(exception);
        }
    }

    navigateToRecordPage(recordId, actionName='view')
    {
        let attributes = {
            recordId,
            actionName
        };

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes
        });
    }

    async doCloneAndRedirect(params)
    {
        let clonedObjectId = await executeClone(params);
        this.navigateToRecordPage(clonedObjectId);
    }

    async handleSubmit(event)
    {
        try{
            event.preventDefault();
            const fields = event.detail.fields;
            await this.doCloneAndRedirect({
                cloneableClassName: this.cloneableClassName,
                originalSObjectId: this.recordId,
                fieldsMap: fields,
            });
        }
        catch(exception)
        {
            this.handleException(exception);
        }
    }

    handleException(exception)
    {
        console.log(exception);
        this.errorMessages = buildExceptionMessages(exception);
    }
}
