import { LightningElement, track } from 'lwc';

export default class MovieSeatSelection extends LightningElement {
    @track seats = [];
    @track selectedSeats = [];
    rows = 5; // Number of rows
    seatsPerRow = 8; // Number of seats per row
    ticketPrice = 10;

    connectedCallback() {
        this.initializeSeats();
    }

    // Initialize the seats with row and seat numbers
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
                    cssClass: 'seat'
                });
            }
            this.seats.push({ rowLabel, rowSeats });
        }
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
                cssClass += seat.status === 'booked' ? ' booked' : '';
                cssClass += this.selectedSeats.includes(seat.id) ? ' selected' : '';
                return { ...seat, cssClass };
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
    }

    bookTickets() {
        alert(`Tickets booked for seats: ${this.selectedSeats.join(', ')}`);
    }
}