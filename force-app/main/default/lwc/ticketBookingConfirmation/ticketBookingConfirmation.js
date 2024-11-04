import { LightningElement, api, track } from 'lwc';

export default class TicketBookingConfirmation extends LightningElement {
    @api selectedSeats = [];
    @api movieName = 'BookNowShow';
    @api totalPrice = 0;

    confirmBooking() {
        // Implement payment logic here
        alert(`Booking confirmed for movie ${this.movieName}, seats: ${this.selectedSeats.join(', ')}`);
    }
}