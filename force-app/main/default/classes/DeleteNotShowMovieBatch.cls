global class DeleteNotShowMovieBatch implements Database.Batchable<SObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator('SELECT Id,Name,(SELECT Movie__c FROM Bookings__r where CreatedDate = LAST_N_DAYS:3 ) FROM Movie__c');
    }

    global void execute(Database.BatchableContext BC, List<Movie__c> movieList) {
        List<Movie__c> deleteMovieList= new List<Movie__c>();

        for(Movie__c movie :movieList){
            if(movie.Bookings__r.size()==0){
                deleteMovieList.add(movie);
            }
        }
         if(deleteMovieList.size()>0){
            delete deleteMovieList;
        }

    }

    global void finish(Database.BatchableContext BC) {
    }
}