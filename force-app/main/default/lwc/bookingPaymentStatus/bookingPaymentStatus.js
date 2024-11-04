import { LightningElement,api,wire} from 'lwc';
import Success from "@salesforce/resourceUrl/Success"; 
import Wrong from "@salesforce/resourceUrl/Wrong"; 
import {CurrentPageReference, NavigationMixin} from 'lightning/navigation';
import getPaymentLinkRecord from '@salesforce/apex/BookingTicketHandler.getPaymentLinkRecord';
import updateBookingRecord from '@salesforce/apex/BookingTicketHandler.updateBookingRecord';
export default class BookingPaymentStatus extends NavigationMixin(LightningElement) {
    successLogo = Success;
    wrongLogo = Wrong;
    isDone = true;
    @wire(CurrentPageReference)
    currentPageReference;
    
    get urlbookingRecordId() {
        return this.currentPageReference?.state?.bookingId;
    }
     get urlPaymentLinkId() {
        return this.currentPageReference?.state?.razorpay_payment_link_id;
    }
    get urlPaymentStatus() {
        return this.currentPageReference?.state?.razorpay_payment_link_status;
    }
    connectedCallback(){
        if(this.urlbookingRecordId !=undefined  && this.urlPaymentLinkId !=undefined){
            // console.log('calling conectedcallback');
             this.getPaymentLinkRecordMethod();
         }
    }

    getPaymentLinkRecordMethod(){
        getPaymentLinkRecord({paymentLinkId:this.urlPaymentLinkId})
        .then(data=>{   
            if(data!=''||data!=null){
            const paymentLinkRecord = JSON.parse(data);
                if(paymentLinkRecord.status=='paid' && paymentLinkRecord.payments[0].status =='captured'){
                    this.updateBookingRecordMethod(paymentLinkRecord);
                }else if(paymentLinkRecord.payments[0].status =='failed'){
                    this.isDone = false;
                }
            }
        }).catch(error=>{
            console.log(error);
        });
    }
    updateBookingRecordMethod(paymentLink){
            const paymentStatus =paymentLink.payments[0].status;
            const paymentMethod =paymentLink.payments[0].method;
            updateBookingRecord({moviebookingRecordId:this.urlbookingRecordId,paymentStatus:paymentStatus,paymentMethod:paymentMethod})
            .then(data=>{ 
                if(data.length>0){
                    
                console.log('data',data);
                
                    this.isDone = true;
                    this.showBookingCard=true;

                }else{
                    this.showBookingCard=false;
                }
            })
            .catch(error=>{
                this.showBookingCard=false;
                console.log('error',error);
            })
    }   

    goExploreMovies(){
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home' 
            }
        });
    }

    tryAgain(){
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'movie-ticket-booking' 
            }
        });
    }
}