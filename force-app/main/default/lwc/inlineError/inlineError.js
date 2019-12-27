import { LightningElement, api } from 'lwc';

import An_Error_Occurred from '@salesforce/label/c.An_Error_Occurred';

export default class InlineError extends LightningElement {
    @api errorMessages = [];

    labels = {
        An_Error_Occurred
    }
}
