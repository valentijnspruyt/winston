import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import { buildExceptionMessages } from 'c/utilities';

import Clone from '@salesforce/label/c.Clone';
import Cancel from '@salesforce/label/c.Cancel';

import getFieldSetFieldsByFieldSetName from '@salesforce/apex/Utilities.getFieldSetFieldsByFieldSetName';
import doSave from '@salesforce/apex/Utilities.doSave';
import doInitSObject from '@salesforce/apex/Utilities.doInitSObject';

const MAX_NUMBER_OF_COLUMNS = 2;

export default class ObjectClone extends NavigationMixin(LightningElement) {

    labels = {
        Clone,
        Cancel
    }

    @api recordId;
    @api objectApiName;
    @api recordTypeId;
    @api customQuickActionHandler;
    @api numberOfColumns;
    @api displayedFieldsFieldSet;

    @track errorMessages = [];
    @track initializedSObject;

    @wire(getFieldSetFieldsByFieldSetName, {objectApiName: '$objectApiName', fieldSetName: '$displayedFieldsFieldSet'})
    wiredDisplayedFieldsFieldSetFields;

    get initializedSObjectfields()
    {
        let fields = [];
        if(this.initializedSObject && this.wiredDisplayedFieldsFieldSetFields && this.wiredDisplayedFieldsFieldSetFields.data)
        {
            fields = this.wiredDisplayedFieldsFieldSetFields.data.map(field => {
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
        if(this.numberOfColumns > MAX_NUMBER_OF_COLUMNS)
        {
            this.numberOfColumns = MAX_NUMBER_OF_COLUMNS;
        }
        return Math.round(12/this.numberOfColumns);
    }

    get hasErrorMessages()
    {
        return this.errorMessages.length > 0;
    }

    async connectedCallback()
    {
        try{
            this.initializedSObject = await doInitSObject({
                originalSObjectId:this.recordId,
                customQuickActionHandler: this.customQuickActionHandler
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
        let clonedObjectId = await doSave(params);
        this.navigateToRecordPage(clonedObjectId);
        //TODO: notifytoast?
    }

    async handleSubmit(event)
    {
        try{
            event.preventDefault();
            const fields = event.detail.fields;
            await this.doCloneAndRedirect({
                customQuickActionHandler: this.customQuickActionHandler,
                originalSObjectId: this.recordId,
                fieldsMap: {...this.initializedSObject, ...fields, ...{sobjectType: this.objectApiName}}
            });
        }
        catch(exception)
        {
            this.handleException(exception);
        }
    }

    handleException(exception)
    {
        this.errorMessages = buildExceptionMessages(exception);
    }
}
