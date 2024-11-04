import { LightningElement,api,track,wire} from 'lwc';
import createPaymentLink from '@salesforce/apex/BookingTicketHandler.createPaymentLink';
import createBookingRecord from '@salesforce/apex/BookingTicketHandler.createBookingRecord';
import { NavigationMixin} from 'lightning/navigation';

export default class BookMovieTickets extends NavigationMixin(LightningElement) {
    _showRecord;
    taxCharges=4.68;
    bookingCharges=30.86;

    // @wire(CurrentPageReference)
    // currentPageReference;
    
    
    get totalTax (){
        return (this.bookingCharges + this.taxCharges)*this.showrecord.totalSelectedSeats;
    }
    get totalAmount(){
        return this.totalTax + this.showrecord.totalPrice;
    }
    @api
    set showrecord(value) {
        this._showRecord = value;
    }

    get showrecord() {
        return this._showRecord ; 
    }
    
    get showTime(){
        const date = new Date(this.showrecord.Show_Time__c);

        const formattedDate = date.toLocaleDateString('en-US', {weekday: 'short',day: 'numeric',month: 'short'
        }) + ', ' + date.toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',hour12: true});
        return formattedDate;
    }
    
    createPaymentLinkMethod(ticketBookingRecordId){

        createPaymentLink({amount:this.totalAmount*100,bookingRecordId:ticketBookingRecordId})
        .then(data=>{   
            if(data!='' || data!=null){
            const paymentLinkRecord = JSON.parse(data);
            console.log('paymantlink data',paymentLinkRecord);
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: paymentLinkRecord.short_url
                }
            });
        }
        })
        .catch(error=>{
            console.log(error);
        });
        
    }
    doPayment(){
        const showRecordStr =JSON.stringify(this.showrecord); 
        createBookingRecord({showRecord:showRecordStr,totalFees:this.totalTax})
        .then(data=>{ 
            console.log('data>>>>>',data)
            if(data!=null){
                this.createPaymentLinkMethod(data.Id);
            }else{
                this[NavigationMixin.Navigate]({
                    type: 'standard__namedPage',
                    attributes: {
                        pageName: 'login' 
                    }
                });
            }
        })
        .catch(error=>{
            this.isFooterBtns=false;
            console.log(error);
        });
    }
    cancelBtn(){
        this.dispatchEvent(new CustomEvent('cancel',{
            detail:false
        }));
    }

}