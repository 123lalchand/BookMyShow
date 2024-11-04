import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getTheaterWithShows from '@salesforce/apex/TheaterAndShowsHandler.getTheaterWithShows';
import theaterLMS from "@salesforce/messageChannel/TheaterLMS__c";
import booleansLMS from "@salesforce/messageChannel/BooleansLMS__c";
import { subscribe, MessageContext } from 'lightning/messageService';
export default class DisplayShowTimesWithTheater extends LightningElement {

    @track theaters = [];
    allTheaters = [];
    error = false;
    @track city = '';
    isUpcomingShow = false;

    @wire(MessageContext)
    messageContext;


    @wire(CurrentPageReference)
    currentPageReference;

    get urlMovieId() {
        return this.currentPageReference?.state?.movieId;
    }


    get urlUpcomingShow() {
        return this.currentPageReference?.state?.upcoming;
    }

    connectedCallback() {
        if (this.urlUpcomingShow) {
            this.isUpcomingShow = true;
        } else {
            this.isUpcomingShow = false;
            this.getTheaterWithShowsMethod(this.urlMovieId, ' ', null);
            this.subscriptionCityMethod();
            this.subscriptionFilterMethod();
            this.subscriptionHidTheaterMethod();
        }
     

    }
    subscriptionFilterMethod() {
        this.subscription = subscribe(
            this.messageContext,
            theaterLMS,
            (message) => this.filterOnTheaters(message.Showformat, message.Language, message.Price)
        );
    }

    subscriptionCityMethod() {
        this.subscription = subscribe(
            this.messageContext,
            theaterLMS,
            (message) => this.getTheaterWithShowsMethod(this.urlMovieId, message.City, message.Date)

        );
    }

    subscriptionHidTheaterMethod() {
        this.subscription = subscribe(
            this.messageContext,
            booleansLMS,
            (message) => this.hidTheaterCard(message.isReviews)
        );
    }
    hidTheaterCard(isReviews){
        if(isReviews){
            this.isUpcomingShow = true;
        }else{
            this.isUpcomingShow = false;
        }
    }

    getTheaterWithShowsMethod(movieId, currentCity, showDate) {
        if (((this.city != currentCity && currentCity != '') || this.city == ' ') || showDate != null) {
            this.city = currentCity;

            getTheaterWithShows({ movieId: movieId, city: currentCity, showDate: showDate }).then((result) => {
                if (result) {
                    this.theaters = result;
                    this.theaters.forEach(theater => {
                        theater['Loction'] = theater.Location__c.street + ', ' + theater.Location__c.city + ', ' + theater.Location__c.state + ' ' + theater.Location__c.postalCode + ', ' + theater.Location__c.country;
                    });
                    this.allTheaters = this.theaters;
                    this.error = false;
                    if (this.theaters.length == 0) {
                        this.theaters = [];
                        this.error = true;
                    }
                    console.log('theaters', this.theaters);
                } else {
                    this.theaters = [];
                    this.error = true;
                }
            }).catch((err) => {
                console.log('theater error', err);
            });
        }
    }

    filterOnTheaters(showFormat, language, price) {
    console.log('showFormat', showFormat);
    console.log('language', language);
    console.log('price', price);

    // Ensure price is a number (convert if needed)
    const maxPrice = price ? parseFloat(price) : null;

    // Filter theaters based on show format, language, and price
    this.theaters = this.allTheaters.map(theater => {
        // Filter out showtimes that don't meet the conditions
        const filteredShowtimes = theater.Showtimes__r.filter(showtime => {
            const showPrice = parseFloat(showtime.Price__c);

            const showFormatMatches = !showFormat || showtime.Show_Format__c === showFormat;
            const languageMatches = !language || showtime.Language__c === language;
            const priceMatches = maxPrice === null || showPrice <= maxPrice; // Only include shows with price <= selected price

            return showFormatMatches && languageMatches && priceMatches;
        });

        // Return theater object with filtered showtimes
        return {
            ...theater,
            Showtimes__r: filteredShowtimes
        };
    }).filter(theater => theater.Showtimes__r.length > 0); // Only include theaters with matching showtimes

    console.log('filteredTheaters', this.theaters);
    this.error = this.theaters.length === 0;
}


}