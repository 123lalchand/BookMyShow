import { LightningElement,wire,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getLogdinUserId from '@salesforce/apex/MovieHandler.getLogdinUserId';
import getAllRandomMovieReviews from '@salesforce/apex/MovieHandler.getAllRandomMovieReviews';
import { MessageContext,subscribe } from 'lightning/messageService';
import booleansLMS from "@salesforce/messageChannel/BooleansLMS__c";

export default class MovieReviews extends LightningElement {

    @track userId;
    @track movieId;
    allReviews = [];
    @track movieReviews = [];
    @track myReview = {};
    @track  isalredyRated = false;
     isReviews = false;

    @track flowInputVariables = [];
    
    @wire(MessageContext)
    messageContext;
    
    @wire(CurrentPageReference)
    currentPageReference;
    
    get urlMovieId() {
        return  this.currentPageReference?.state?.movieId;
    }

    @wire(getLogdinUserId)
    currentUser({error,data}){
        if(data){
            this.userId=data.Id;
            this.flowInputVariables.push( {
                name: "movieId",
                type: "String",
                value:this.urlMovieId,
            });
            this.flowInputVariables.push({
                name: "userId",
                type: "String",
                value: this.userId,
            });
            
        }else if(error){
            console.log('error',error);
        }

    }

    // @wire(getAllRandomMovieReviews,{movieId:this.urlMovieId})
    // movieReviews({error,data}){
    //     if(data){
    //         console.log('data',data);
    //         this.allReviews=data;
    //         this.allReviews.forEach(review=>{
    //             if(review.User__c==this.userId){
    //               this.isalredyRated=true;
    //                 this.myReview = review;
    //             }else{
    //                 this.movieReviews.push(review);
    //             }
    //         });
    //     }else if(error){
    //         console.log('error',error);
    //     }

    // }



    connectedCallback(){
        this.subscriptionMethod();
    }
   

    subscriptionMethod() {
        this.subscription = subscribe(
            this.messageContext,
            booleansLMS,
            (message) => this.hideThisCard(message.isReviews)
        );
    }

    hideThisCard(isReview) {
            console.log('isReviews', isReview);
            
            // Prevent redundant calls
            if (this.isReviews === isReview) {
                console.log('No state change, skipping update.');
                return;
            }
            
            this.isReviews = isReview;
            
            if (this.isReviews) {
                console.log('Fetching reviews...');
                this.getAllRandomMovieReviewsMethod();
            }
        }

getAllRandomMovieReviewsMethod() {
    console.log('Fetching reviews for movieId:', this.urlMovieId, 'userId:', this.userId);

    // Clear existing data to avoid duplication
    this.movieReviews = [];
    this.isalredyRated = false;

    getAllRandomMovieReviews({ movieId: this.urlMovieId })
        .then((result) => {
            if (result.length > 0) {
                this.allReviews = result;
                this.allReviews.forEach(review => {
                    if (review.User__c === this.userId) {
                        this.myReview = review;
                        this.isalredyRated = true;
                    } else {
                        this.movieReviews.push(review);
                    }
                });
                console.log('Fetched reviews:', this.allReviews);
            } else {
                console.log('No reviews found:', result);
            }
        })
        .catch((err) => {
            console.error('Error fetching reviews:', err);
        });
}

    handleFlowStatusChange(event) {
        
		console.log("flow status", event.detail.status);
		if (event.detail.locationName === "SuccessMessage") {
            this.getAllRandomMovieReviewsMethod();
            this.isalredyRated=true;
        }
	}
}