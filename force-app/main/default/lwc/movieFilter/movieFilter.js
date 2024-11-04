import { LightningElement,wire } from 'lwc';
import { publish,MessageContext } from 'lightning/messageService';
import moviesFilterLMS from "@salesforce/messageChannel/MoviesFilter__c";

export default class MovieFilter extends LightningElement {
    languageValue = 'All';
    genresValue='';
    selectedGenresValue=[];

    @wire(MessageContext)
    messageContext;
    
    get languageOptions() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Hindi', value: 'Hindi' },
            { label: 'Telugu', value: 'Telugu' },
            { label: 'English', value: 'English' },
            { label: 'Kannada', value: 'Kannada' },
            { label: 'Tamil', value: 'Tamil' },
            { label: 'Malayalam', value: 'Malayalam' },
            { label: 'Chinese', value: 'Chinese' },
        ];
    }

    get genresOptions() {
        return [
            { label: 'Drama', value: 'Drama' },
            { label: 'Action', value: 'Action' },
            { label: 'Comedy', value: 'Comedy' },
            { label: 'Romance', value: 'Romance' },
            { label: 'Horror', value: 'Horror' },
            { label: 'Thriller', value: 'Thriller' },
            { label: 'Period', value: 'Period' },
        ];
    }

    handleChange(event){
        if(event.target.name=='language'){
            this.languageValue = event.target.value;
        }
        else if(event.target.name=='genres'){
            this.genresValue = event.target.value.join(';');
            console.log('genresValue', this.genresValue);
        }
        const messagePayload = {
            upcomingShow:false,
            City:null,
            Language: this.languageValue,
            Genres: this.genresValue
        };
        publish(this.messageContext, moviesFilterLMS, messagePayload);
    }
}