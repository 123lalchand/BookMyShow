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
            console.log('this.flowInputVariables>>>',this.flowInputVariables);
            
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

    getAllRandomMovieReviewsMethod(){
        getAllRandomMovieReviews({movieId:this.urlMovieId}).then((result) => {
            if(result.length>0){
                this.allReviews=result;
                this.allReviews.forEach(review=>{
                    if(review.User__c==this.userId){
                      this.isalredyRated=true;
                        this.myReview = review;
                    }else{
                        this.movieReviews.push(review);
                    }
                });
                console.log('this.allReviews>>>',this.allReviews);
            }
        }).catch((err) => {
            console.log('error',err);
        });
    }

    
    hideThisCard(isReviews){
        if(isReviews){
            this.isReviews = true;
            this.getAllRandomMovieReviewsMethod();
        }else{
            this.isReviews = false;
        }
    }
    
    handleFlowStatusChange(event) {
        
		console.log("flow status", event.detail.status);
		if (event.detail.locationName === "SuccessMessage") {
            this.isalredyRated=true;
		}
	}
}