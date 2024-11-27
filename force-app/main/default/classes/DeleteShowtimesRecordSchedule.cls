global class DeleteShowtimesRecordSchedule implements Schedulable{
      global void execute(SchedulableContext sc) {
    	 List<Showtime__c> showList =[Select Id,Show_Time__c from Showtime__c where Show_Time__c < THIS_WEEK];
          if(showList.size()>0){
              delete showList;
          }
   }
}