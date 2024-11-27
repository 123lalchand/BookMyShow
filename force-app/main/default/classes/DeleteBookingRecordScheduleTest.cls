@isTest
public class DeleteBookingRecordScheduleTest {
     @testSetup static void setup() {
          Movie__c createMovieRecord = TestDataFactory.createMovieRecord();
         insert createMovieRecord;
         
         Booking__c createBookingRecord = TestDataFactory.createBookingRecord(createMovieRecord.Id);
         createBookingRecord.Booking_Status__c ='Pending';
         insert createBookingRecord;
    }
	@isTest
    public static void doTest(){
    	list<Booking__c> bookingList=[Select Id from Booking__c where Booking_Status__c='Pending'];
           String jobId = System.schedule('DeleteBookingRecordScheduleJob1',
      		 '0 39 11* * ?', 
         new DeleteBookingRecordSchedule());
        
        
         CronTrigger ct = [SELECT Id, CronJobDetail.Id, CronJobDetail.Name,CronExpression,TimesTriggered, CronJobDetail.JobType 
    FROM CronTrigger where id =:jobId];    
      
        
        // Verify the expressions are the same
          System.assertEquals('0 0 1 * * ?', ct.CronExpression);
    
          // Verify the job has not run
          System.assertEquals(0, ct.TimesTriggered);
    
       Test.stopTest();
    

    }
}