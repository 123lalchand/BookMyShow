@isTest
public class TestDataFactory {
    public static Movie__c createMovieRecord (){
       Movie__c movie = new Movie__c();
		movie.Name = 'test movie';
        movie.Poster__c = 'https://assetscdn1.paytm.com/images/cinema/162917-b0808581-3e85-11ef-99b5-d35223c98590.jpg';
        movie.Release_Date__c = System.Today();
        return movie;
    }
    public static Theater__c createTheaterRecord (){
       Theater__c theater = new Theater__c();
		theater.Name  = 'pvr';
        theater.Location__City__s='Ajmer';
        return theater;
    } 
     public static Screen__c createScreenRecord (String theaterId){
            Screen__c screen = new Screen__c();
            screen.Screen_Label__c   = 'Secreen 1';
            screen.Theater__c  = theaterId;
            screen.Type__c = '2d';
            return screen;
        }
    public static Showtime__c createShowtimeRecord (String movieId,String theaterId){
       Showtime__c showtime = new Showtime__c();
		showtime.Movie__c  = movieId;
        showtime.Theater__c  = theaterId;
        showtime.Show_Time__c = System.now();
        return showtime;
    }
    public static Booking__c createBookingRecord (String movieId){
       Booking__c booking = new Booking__c();
		booking.Movie__c  = movieId;
        return booking;
    }
}