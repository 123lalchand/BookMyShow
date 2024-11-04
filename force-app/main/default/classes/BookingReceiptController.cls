public class BookingReceiptController {
    public Booking__c receipt {get; set;}
    public String formattedShowTime {get; set;}
    public Decimal totalAmount {get; set;}
    public Decimal bookingCharges {get; set;}
    public Decimal taxCharges {get; set;}
    public Decimal totalTaxCharges {get; set;}
    public BookingReceiptController() {
        Id bookingId = ApexPages.currentPage().getParameters().get('bookingId');
        
        this.receipt = [SELECT Movie__r.Name,Showtime__r.Screen__r.Screen_Label__c,Theater__r.Location__Street__s,Theater__r.Location__City__s, Showtime__r.Language__c,Booking_Date__c, Theater__r.Name, Number_of_Tickets__c, Per_Ticket_Price__c,Total_Price__c,Fees__c, Booking_Status__c,Seat_Numbers__c 
                   FROM Booking__c WHERE Id = :bookingId LIMIT 1];
        this.formattedShowTime = formatShowTime(receipt.Booking_Date__c);
        this.bookingCharges = 30.86;
        this.taxCharges = 4.68;
        this.totalTaxCharges= this.bookingCharges+this.taxCharges;
    }

    // Format the showtime for the receipt
    public String formatShowTime(DateTime showTime) {
        return showTime.format('EEE, MMM d, yyyy h:mm a');
    }

}