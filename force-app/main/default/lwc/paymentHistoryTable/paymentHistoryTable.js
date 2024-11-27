import { LightningElement,wire } from 'lwc';
import getBookingRecords from '@salesforce/apex/BookingTicketHandler.getBookingRecords';
import { refreshApex } from '@salesforce/apex';
    const columns =[
    {label: 'Booking Number', fieldName: 'Name', type: 'text'},
    {label: 'Movie Name', fieldName: 'MovieTitle', type: 'text'},
    {label: 'Theater Name', fieldName: 'TheaterName', type: 'text'},
    {
        label: 'Booking Date', 
        fieldName: 'Booking_Date__c', 
        type: 'date', 
        typeAttributes: { 
            day: '2-digit', // Day in two-digit format
            month: 'short', // Short month (e.g., Oct)
            year: '2-digit', // Two-digit year format
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true // Use 12-hour format with AM/PM
        }},
    {label: 'Seats', fieldName: 'Seat_Numbers__c', type: 'text'},
    {label: 'Movie Price', fieldName: 'Per_Ticket_Price__c', type: 'currency'},
    {label: 'Totol Price', fieldName: 'Total_Price__c', type: 'currency'},
    {label: 'Payment Method', fieldName: 'Payment_Method__c', type: 'text'},
    {label: 'Payment Status', fieldName: 'Payment_Status__c', type: 'text'},
    ]
export default class PaymentHistoryTable extends LightningElement {
    columns = columns;
    data =[];

    totalRecords=[];
    currentPage=1;
    totalRecordSize =0;
    totalPages=1;
    recordSize=10;

    @wire(getBookingRecords)
    bookingRecords({error,data}) {
        if(data) {
            this.totalRecords = data.map(record => ({
                ...record,
                MovieTitle: record.Movie__r?.Name,
                TheaterName: record.Theater__r?.Name
            }));

            this.totalRecordSize = this.totalRecords.length;
           this.totalPages =   Math.ceil(this.totalRecordSize / this.recordSize);
           this.paginationHelper();
            console.log('data',this.data);
        }
        else if(error) {
            console.log(error);
        }
    }


    handleNext(){
        if(this.currentPage < this.totalPages){
           this.currentPage = this.currentPage + 1;
           this.paginationHelper();
       }
      
   }

   handlePrevious(){
       if(this.currentPage > 1){
           this.currentPage = this.currentPage - 1;
           this.paginationHelper();
       }
   }

     paginationHelper(){
      if(this.currentPage>0 && this.currentPage<=this.totalPages){
       
        this.data=[];
        for(var i=(this.currentPage-1)*this.recordSize;i<(this.currentPage*this.recordSize);i++){
            if(i==this.totalRecordSize){
                break;
            }
            this.data.push(this.totalRecords[i]);
        } 
            this.template.querySelectorAll('button').forEach(button => {
                if(this.currentPage===1 && button.getAttribute('name')=='previous'){
                    button.setAttribute('disabled','true');
                }else if(this.currentPage==this.totalPages  && button.getAttribute('name')=='next'){
                    button.setAttribute('disabled','true');
                }
                 
                if(this.currentPage!=1 || this.currentPage!=this.totalPages){
                    button.getAttribute('name')=='previous' && this.currentPage!=1 ? button.removeAttribute('disabled') :'';
                    button.getAttribute('name')=='next' && this.currentPage!=this.totalPages ? button.removeAttribute('disabled') :'';
                }
            });
        
        console.log('data>>>>',this.data);
      }
    }
}