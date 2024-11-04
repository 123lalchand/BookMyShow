import { LightningElement,wire} from 'lwc';
import { publish,MessageContext,subscribe } from 'lightning/messageService';
import theaterLMS from "@salesforce/messageChannel/TheaterLMS__c";
import booleansLMS from "@salesforce/messageChannel/BooleansLMS__c";
import { CurrentPageReference } from 'lightning/navigation';

export default class Filterbar extends LightningElement {
    languageText = 'Language';
    formatText = 'Format';
    priceText = 'price';
    languageValue = '';
    formatValue = '';
    priceValue = 0;
    showLanguageCombobox = false;
    showFormatCombobox = false;
    showPriceCombobox = false;
    isReviews = false;
    
    @wire(MessageContext)
    messageContext;

    @wire(CurrentPageReference)
    currentPageReference;
    
    get urlUpcomingShow() {
        return this.currentPageReference?.state?.upcoming;
    }

    connectedCallback(){
        if(this.urlUpcomingShow){
            this.isReviews = true;
        }else{
            const date = new Date();
            this.month = date.toLocaleString('default', { month: 'short' });
            this.isReviews = false;
            this.subscriptionrMethod();
        }
    }

    subscriptionrMethod() {
        this.subscription = subscribe(
            this.messageContext,
            booleansLMS,
            (message) => this.hideThisCard(message.isReviews)
        );
    }
    
    hideThisCard(isReviews){
        if(isReviews){
            this.isReviews = true;
        }else{
            this.isReviews = false;
        }
    }
    get languageOptions() {
        return [
            { label: 'Hindi', value: 'Hindi' },
            { label: 'Telugu', value: 'Telugu' },
            { label: 'English', value: 'English' },
            { label: 'Kannada', value: 'Kannada' },
            { label: 'Tamil', value: 'Tamil' },
            { label: 'Malayalam', value: 'Malayalam' },
            { label: 'Chinese', value: 'Chinese' },
        ];
    }
    get formatOptions() {
        return [
            { label: '2D', value: '2D' },
            { label: '3D', value: '3D' },
            { label: '4D', value: '4D' },
            { label: 'IMAX', value: 'IMAX' },
        ];
    }
    get priceOptions() {
        return [
            { label: '100', value: '100' },
            { label: '200', value: '200' },
        ];
    }
    handleClose(){
        this.showLanguageCombobox = false;
        this.showFormatCombobox = false;
        this.showPriceCombobox = false;
    }
    handleLanguageBtn() {
        this.showLanguageCombobox = !this.showLanguageCombobox;
        this.showFormatCombobox = false;
        this.showPriceCombobox = false;
    }
    handleFormatBtn() {
        this.showLanguageCombobox = false;
        this.showFormatCombobox = !this.showFormatCombobox;
        this.showPriceCombobox = false;

    }

    handlePriceBtn() {
        this.showLanguageCombobox = false;
        this.showFormatCombobox = false;
        this.showPriceCombobox = !this.showPriceCombobox;

    }
    handleChange(event){
        console.log('method>>',event.target.name);
        if(event.target.name=='language'){
            this.languageValue = event.detail.value;
            this.languageText =  this.languageValue;
        }
        else if(event.target.name=='format'){
            this.formatValue = event.detail.value;
            this.formatText =  this.formatValue;
        }
        else if(event.target.name=='price'){
            this.priceValue = event.detail.value;
            this.priceText =  this.priceValue;
        }
        const messageTheaterPayload = {
            City: '',
            Date:null,
            Showformat: this.formatValue==null?'':this.formatValue,
            Language: this.languageValue==null?'':this.languageValue,
            Price: this.priceValue==null?'':this.priceValue,
        };
        publish(this.messageContext, theaterLMS, messageTheaterPayload);
    }
}