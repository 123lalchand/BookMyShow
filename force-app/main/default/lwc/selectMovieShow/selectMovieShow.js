import { LightningElement, api } from 'lwc';

export default class SelectMovieShow extends LightningElement {
    // Store the original shows data in a private property
    _shows;

    @api
    set shows(value) {
        this._shows = value;
    }

    get shows() {
        return this._shows ? this._shows.map(show => {
            const datetime = new Date(show.Show_Time__c);
            return {
                ...show,
                Show_Time__c: datetime.toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        }) : [];
    }
}