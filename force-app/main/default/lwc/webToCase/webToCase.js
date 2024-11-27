import { LightningElement, track } from 'lwc';

export default class WebToCaseForm extends LightningElement {
    @track selectedType = '';
    @track selectedReason = '';
    @track reasonsOptions = [];

    typeOptions = [
        { label: '--None--', value: '' },
        { label: 'Payment Issues', value: 'Payment Issues' },
        { label: 'Booking Issues', value: 'Booking Issues' },
        { label: 'Account and Login', value: 'Account and Login' },
        { label: 'Technical Issues', value: 'Technical Issues' },
        { label: 'Notifications and Alerts', value: 'Notifications and Alerts' },
        { label: 'Other', value: 'Other' }
    ];

    reasonsMap = {
        'Payment Issues': [
            { label: 'Failed Transaction', value: 'Failed Transaction' },
            { label: 'Double Charge', value: 'Double Charge' },
            { label: 'Incorrect Payment Amount', value: 'Incorrect Payment Amount' }
        ],
        'Booking Issues': [
            { label: 'Unable to Book Ticket', value: 'Unable to Book Ticket' },
            { label: 'Incorrect Show Timings', value: 'Incorrect Show Timings' },
            { label: 'Seat Selection Problem', value: 'Seat Selection Problem' },
            { label: 'Cancelled Booking', value: 'Cancelled Booking' }
        ],
        'Account and Login': [
            { label: 'Forgot Password', value: 'Forgot Password' },
            { label: 'Unable to Login', value: 'Unable to Login' },
            { label: 'Account Locked', value: 'Account Locked' },
            { label: 'Profile Update Issues', value: 'Profile Update Issues' }
        ],
        'Technical Issues': [
            { label: 'Website/App Not Loading', value: 'Website/App Not Loading' },
            { label: 'Errors on Payment Page', value: 'Errors on Payment Page' },
            { label: 'Error in Seat Availability', value: 'Error in Seat Availability' },
            { label: 'Slow Performance', value: 'Slow Performance' }
        ],
        'Notifications and Alerts': [
            { label: 'Didn’t Receive Booking Confirmation', value: 'Didn’t Receive Booking Confirmation' },
            { label: 'Missing or Late Notification for Show', value: 'Missing or Late Notification for Show' },
            { label: 'Incorrect Reminders', value: 'Incorrect Reminders' }
        ],
        'Other': [
            { label: 'General Inquiry', value: 'General Inquiry' },
            { label: 'Feedback/Suggestion', value: 'Feedback/Suggestion' },
            { label: 'Complaint Regarding Service/Staff', value: 'Complaint Regarding Service/Staff' }
        ]
    };

    handleTypeChange(event) {
        this.selectedType = event.target.value;
        this.reasonsOptions = this.reasonsMap[this.selectedType] || [{ label: '--None--', value: '' }];
    }

    handleReasonChange(event) {
        this.selectedReason = event.target.value;
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = {};
        this.template.querySelectorAll('lightning-input, lightning-combobox, lightning-textarea').forEach(input => {
            fields[input.name] = input.value;
        });

        // Code to handle form submission logic, such as sending data to an API or Salesforce endpoint
        console.log('Form submitted:', fields);
        alert('Form submitted successfully');
    }
}
