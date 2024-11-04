import { LightningElement,wire } from 'lwc';
import getMovieDetails from '@salesforce/apex/MovieHandler.getMovieDetails';
import { CurrentPageReference } from 'lightning/navigation';
import booleansLMS from "@salesforce/messageChannel/BooleansLMS__c";
import { publish,MessageContext } from 'lightning/messageService';

export default class MovieDetails extends LightningElement {
  
    movie={};
    isReviews = false ; 

    @wire(MessageContext)
    messageContext;

    @wire(CurrentPageReference)
    currentPageReference;

    get urlMovieId() {
        return this.currentPageReference?.state?.movieId;
    }

    get urlUpcoming() {
        return this.currentPageReference?.state?.upcoming;
    }


    connectedCallback() {
        this.getMovieDetailsMethod(this.urlMovieId);
    }
    getMovieDetailsMethod(movieId){
        getMovieDetails({movieId:movieId}).then((result) => {
            if(result){
                this.movie = result;
                this.movie.MovieTrailerLink__c = this.movie.MovieTrailerLink__c.replaceAll('watch?v=', 'embed/')+'?autoplay=1&mute=1';
                console.log('movie details',result);
            }
        }).catch((err) => {
            console.log('error',err);
        });
    }
    showModal = false;

    handleWatchTrailer() {
        this.showModal = true;
    }

    handleCloseModal() {
        this.showModal = false; 
    }

    stopPropagation(event) {
        event.stopPropagation(); // Prevent clicks inside modal from closing it
    }

    handleShow(event){
        var nowShowingBtn = this.template.querySelector('.nowShowingbtn');
        var reviewsBtn = this.template.querySelector('.reviewsBtn');
        
           if(event.target.name==='nowShowing'){
                nowShowingBtn.classList.add("activebtn");
                reviewsBtn.classList.remove("activebtn");
                nowShowingBtn.classList.remove("btn");
                reviewsBtn.classList.add("btn");
                this.isReviews = false;
           }else if(event.target.name==='reviews'){
              
                reviewsBtn.classList.add("activebtn"); 
                reviewsBtn.classList.remove("btn"); 
                nowShowingBtn.classList.remove("activebtn");
                nowShowingBtn.classList.add("btn");
                this.isReviews = true;
            }
            const messagePayload = {
                isReviews:this.isReviews
            };
            publish(this.messageContext, booleansLMS, messagePayload);
    }
}