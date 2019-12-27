const getObjectLabels = (wiredRecordInfoObject) => {
    let labelsObject = {
        ObjectLabel: {}
    };
    if (wiredRecordInfoObject && wiredRecordInfoObject.data) {
        labelsObject.ObjectLabel = {
            'single': wiredRecordInfoObject.data.label,
            'plural': wiredRecordInfoObject.data.labelPlural
        }
        Object.keys(wiredRecordInfoObject.data.fields).forEach(fieldKey => {
            labelsObject[fieldKey] = wiredRecordInfoObject.data.fields[fieldKey].label;
        });
    }
    return labelsObject;
}

const buildExceptionMessages = (exception) => {
        let messages = [];
        if(typeof exception == 'string')
        {
            messages.push(exception);s
        }
        else if(exception.body)
        {
            if(exception.body.output)
            {
                let errors = exception.body.output.errors || [];
                errors.forEach(error => {
                    messages.push(error.message);
                })

                let fieldErrors = exception.body.output.fieldErrors || {};
                Object.keys(fieldErrors).forEach(field => {
                    fieldErrors[field].forEach(fieldError => {
                        messages.push(fieldError.message);
                    })
                })
            }
            //If there are no messages added, add the default message
            if(messages.length === 0 && exception.body.message)
            {
                messages.push(exception.body.message);
            }
        }

        if(messages.length === 0)
        {
            messages = [this.labels.Unknown_Error];
        }
        return messages;
    }

export
{
    getObjectLabels,
    buildExceptionMessages
}
