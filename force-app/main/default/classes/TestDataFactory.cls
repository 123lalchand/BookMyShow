@isTest
public class TestDataFactory {
    public static Movie__c createMovieRecord (){
       Movie__c movie = new Movie__c();
		movie.Name = 'test movie';
        return movie;
    }
}