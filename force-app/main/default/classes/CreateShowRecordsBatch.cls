global class CreateShowRecordsBatch implements Database.Batchable<SObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator('SELECT Id, Name FROM Theater__c');
    }

    global void execute(Database.BatchableContext BC, List<Theater__c> theaterList) {
        List<Showtime__c> showRecords = new List<Showtime__c>();
        Time startTime = Time.newInstance(9, 0, 0, 0); // 9:00 am start time
        Time endTime = Time.newInstance(22, 0, 0, 0); // 10:00 pm end time
        
        List<Movie__c> movies = [SELECT Id, Name, Duration__c FROM Movie__c WHERE Duration__c != NULL AND IsShowing__c = true];
        
        for (Theater__c theater : theaterList) {
            Time currentShowTime = startTime;
            for (Movie__c movie : movies) {
                
                while (currentShowTime.addHours(3).millisecond() <= endTime.millisecond()) {
                    showRecords.add(new Showtime__c(
                        Theater__c = theater.Id,
                        Movie__c = movie.Id,
                        Show_Time__c = DateTime.newInstance(Date.today(), currentShowTime),
                        Show_Format__c = '2D',
                        Language__c = 'Hindi',
                        Price__c = 180
                    ));
                    
                    currentShowTime = currentShowTime.addHours(3);
                }
            }
            currentShowTime.addMinutes(25);
        }

        if (!showRecords.isEmpty()) {
            insert showRecords;
        }
    }

    global void finish(Database.BatchableContext BC) {
    }
}