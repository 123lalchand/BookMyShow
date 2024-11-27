@isTest
public class TheaterAndShowsHandlerTest {
    @testSetup static void setup() {     
          Movie__c createMovieRecord = TestDataFactory.createMovieRecord();
         insert createMovieRecord;
         Theater__c createTheaterRecord = TestDataFactory.createTheaterRecord();
         insert createTheaterRecord; 
         Showtime__c createShowtimeRecord = TestDataFactory.createShowtimeRecord(createMovieRecord.Id,createTheaterRecord.Id);
         insert createShowtimeRecord;
        Booking__c createBookingRecord = TestDataFactory.createBookingRecord(createMovieRecord.Id);
        createBookingRecord.Booking_Status__c ='Booked';
        createBookingRecord.Showtime__c = createShowtimeRecord.Id;
         insert createBookingRecord;
        
    }
    @isTest
    public static void getTheaterWithShowsTest(){
        String movieId = [SELECT Id FROM Movie__c limit 1].Id;
		test.startTest();
        	TheaterAndShowsHandler.getTheaterWithShows(movieId,'Ajmer',null);
        test.stopTest();
    }
    
    
    @isTest
    public static void getAlreadyBookedTicketsTest(){
        String showId = [SELECT Id FROM Showtime__c limit 1].Id;
		test.startTest();
        	TheaterAndShowsHandler.getAlreadyBookedTickets(showId);
        test.stopTest();
    }
    
    	@isTest
    public static void getTheaterWithMovieInfoTest(){
        String showId = [SELECT Id FROM Showtime__c limit 1].Id;
		test.startTest();
        	TheaterAndShowsHandler.getTheaterWithMovieInfo(showId);
        test.stopTest();
    }
	
}