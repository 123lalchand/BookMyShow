import { LightningElement,track,wire} from 'lwc';
import { publish,MessageContext } from 'lightning/messageService';
import moviesFilterLMS from "@salesforce/messageChannel/MoviesFilter__c";
import theaterLMS from "@salesforce/messageChannel/TheaterLMS__c";
import getCityOfLogdinUser from '@salesforce/apex/SearchLoctionCtr.getCityOfLogdinUser'
import updateCityOnContact from '@salesforce/apex/SearchLoctionCtr.updateCityOnContact'
import { CurrentPageReference } from 'lightning/navigation';
export default class SelectCity extends LightningElement {
    isOpen=false;
    @track city='Select City';

    @wire(MessageContext)
    messageContext;
    
    @wire(CurrentPageReference)
    currentPageReference;

    get urlCity() {
        return this.currentPageReference?.state?.city;
    }

  
    connectedCallback(){
        this.getCityOfLogdinUserMethod();
    }
    
    getCityOfLogdinUserMethod(){
        getCityOfLogdinUser()
        .then(result=>{
            if(result!=null){
                this.city=result;     
                this.callCityForMovieLMS();       
            }else{
                this.isOpen=true;
            }
    }).catch(error=>{
        console.log('error',error);
    })
    }
    handleCityBtn(){
        this.isOpen=true;
    }
     handleCloseBtn(){
        this.isOpen=false;
    }

    // connectedCallback(){
    //     this.city=this.urlCity;
    // }

    updateCity(event){
        console.log('city___',event.detail.message);
        //this.city=event.detail.message;
            updateCityOnContact({city:event.detail.message})
            .then(result=>{
                if(result!=null){
                    this.city=result;
                    console.log('updated city>>>>',this.city);

                }else{
                    this.city=event.detail.message;
                }
                this.callCityForMovieLMS();
                this.callCityForTheaterLMS();
        }).catch(error=>{
            console.log('error',error);
        })
         console.log('this.city>>>>',this.city);
        
        this.isOpen=false;
    }
    callCityForMovieLMS(){
        const messageMoviesPayload = {
            upcomingShow:false,
            City: this.city,
            Language: '',
            Genres: ''
        };

        publish(this.messageContext, moviesFilterLMS, messageMoviesPayload);
     
    }
    callCityForTheaterLMS(){
        const messageTheaterPayload = {
            City: this.city,
            Date:null,
            Showformat: '',
            Language: '',
            Price: null
        };
        publish(this.messageContext, theaterLMS, messageTheaterPayload);
    }
    // updateCityOnContactMethod(city){
    //     console.log('city>>>>>>___',city);
          
    // }
}