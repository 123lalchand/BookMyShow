@isTest
public class DeleteNotShowMovieBatchTest {
    @testSetup static void setup() {
         Movie__c createMovieRecord = TestDataFactory.createMovieRecord();
         insert createMovieRecord;
         Movie__c createMovieRecord1 = TestDataFactory.createMovieRecord();
         insert createMovieRecord1; 
         Booking__c createBookingRecord = TestDataFactory.createBookingRecord(createMovieRecord1.Id);
         insert createBookingRecord;
        
    }
    	@isTest
    public static void doTest(){
		test.startTest();
        	Database.executeBatch(new DeleteNotShowMovieBatch());
        test.stopTest();
    }

}