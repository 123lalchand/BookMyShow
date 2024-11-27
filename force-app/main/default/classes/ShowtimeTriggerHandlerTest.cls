@isTest
public class ShowtimeTriggerHandlerTest {
    @testSetup static void setup() {     
          Movie__c createMovieRecord = TestDataFactory.createMovieRecord();
         insert createMovieRecord;
         Theater__c createTheaterRecord = TestDataFactory.createTheaterRecord();
         insert createTheaterRecord;
        Screen__c createScreenRecord = TestDataFactory.createScreenRecord(createTheaterRecord.Id);
         insert createScreenRecord; 
         Showtime__c createShowtimeRecord = TestDataFactory.createShowtimeRecord(createMovieRecord.Id,createTheaterRecord.Id);
         insert createShowtimeRecord;
        
    }
    @isTest
    public static void updateScreenTest(){
        List<Showtime__c> shows = [select Id,Screen__c,Show_Format__c from Showtime__c];
		test.startTest();
        	ShowtimeTriggerHandler.updateScreen(shows);
        test.stopTest();
    }
    
	
}