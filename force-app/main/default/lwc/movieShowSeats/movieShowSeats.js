import { LightningElement, track,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import getTheaterWithMovieInfo from '@salesforce/apex/TheaterAndShowsHandler.getTheaterWithMovieInfo';
import getAlredyBookedTickets from '@salesforce/apex/TheaterAndShowsHandler.getAlreadyBookedTickets';
export default class MovieSeatSelection extends NavigationMixin(LightningElement) {
    @track seats = [];
    @track selectedSeats = [];
    @track  bookedSeats = [];
    @track show = {};
    rows = 10;
    seatsPerRow = 17;
   @track ticketPrice = 0;
    showBookingCard=false;
    @track totalSelectedSeats=0;
    
    @wire(CurrentPageReference)
    currentPageReference;

    get urlShowId() {
        return this.currentPageReference?.state?.showId;
    }


    connectedCallback() {
        this.getTheaterWithMovieInfoMethod(this.urlShowId);
        this.getAlredyBookedTicketsMethod(this.urlShowId);
        this.initializeSeats();
        this.showBookingCard=false;
    }
    getAlredyBookedTicketsMethod(showId){
        getAlredyBookedTickets({showId:showId}).then((result) => {
            if(result){
                if(result.length>0){
                    result.forEach(bookingRecord => {
                        bookingRecord.Seat_Numbers__c.split(',').forEach(element => {
                            this.bookedSeats.push(element.replace(' ',''));
                        });
                    });
                    this.updateSeatClasses();
                    console.log(' this.bookedSeats>>>', this.bookedSeats);
                }else{
                    this.bookedSeats = [];
                }
               
            }}).catch(error => {
            this.error = error;
        });
    }

    // if (!this.bookedSeats.includes(seatId)) {
    //     this.bookedSeats = [...this.selectedSeats, seatId];
    // } else {
    //     this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatId);
    // }
    getTheaterWithMovieInfoMethod(showId){
        getTheaterWithMovieInfo({showId:showId}).then((result) => {
            if(result){
                this.show = result;
                this.ticketPrice =this.show.Price__c;
            }}).catch(error => {
            this.error = error;
        });
    }
    initializeSeats() {
        for (let i = 0; i < this.rows; i++) {
            const rowLabel = String.fromCharCode(65 + i);
            const rowSeats = [];
            for (let j = 1; j <= this.seatsPerRow; j++) {
                const seatId = `${rowLabel}${j}`;
                rowSeats.push({
                    id: seatId,
                    row: rowLabel,
                    number: j,
                    status: 'available',
                    cssClass: 'seat',
                    isdisabled:false
                });
            }
            this.seats.push({ rowLabel, rowSeats });
        }
        // if(bookedSeats.length>0){
        //     var buttons = this.template.querySelectorAll('button[data-status="available"]');
        //     console.log('buttons>>>>>',buttons);
        //     buttons.forEach(button => {
        //         button.setAttribute('disabled',"true");
        //     });
        // }
    }

    get totalPrice() {
        return this.selectedSeats.length * this.ticketPrice;
    }

    get selectedSeatsFormatted() {
        return this.selectedSeats.join(', ');
    }

    updateSeatClasses() {
        this.seats = this.seats.map(row => {
            const rowSeats = row.rowSeats.map(seat => {
                let cssClass = 'seat';
                let status = 'available';
                let dis = false;
                if (this.bookedSeats.includes(seat.id)) {
                    status = 'booked';
                    dis = true;
                } 
                cssClass += this.bookedSeats.includes(seat.id) ? ' booked' : '';
                cssClass += this.selectedSeats.includes(seat.id) ? ' selected' : '';
                return { ...seat, cssClass,status,isdisabled:dis };
            });
            return { ...row, rowSeats };
        });
    }

    handleSeatClick(event) {
      
        const seatId = event.target.dataset.seatId;
        if (!this.selectedSeats.includes(seatId)) {
            this.selectedSeats = [...this.selectedSeats, seatId];
        } else {
            this.selectedSeats = this.selectedSeats.filter(seat => seat !== seatId);
        }
        this.updateSeatClasses();
        this.totalSelectedSeats = this.selectedSeats.length;
        if(this.totalSelectedSeats!=0){
            this.showBookingBtn =true;
        }else{
            this.showBookingBtn =false;
        }
    }

    bookTickets() {
        this.show = { ...this.show, selectedSeatsFormatted: this.selectedSeatsFormatted,ticketPrice : this.ticketPrice,totalSelectedSeats:this.totalSelectedSeats,totalPrice:this.totalPrice};
        this.showBookingCard = true;
    }

    handleCloseClick(event) {
        this.showBookingCard = event.detail;
    }

}