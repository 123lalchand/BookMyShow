global class DeleteBookingRecordSchedule implements Schedulable{
      global void execute(SchedulableContext sc) {
    	 List<Booking__c> bookingList =[Select Id,Total_Price__c, Per_Ticket_Price__c,Number_of_Tickets__c , Fees__c,Booking_Status__c from Booking__c where Booking_Status__c='Pending'];
        	
          if(bookingList.size()>0){
              delete bookingList;
          }
   }
}