public without sharing class TheaterAndShowsHandler {
    @AuraEnabled
    public static List<Theater__c> getTheaterWithShows(Id movieId, String city, Datetime showDate) {
        if (String.isBlank(city)) {
            User currentUser = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId()];
            city = [SELECT MailingCity FROM Contact WHERE Id =: currentUser.ContactId LIMIT 1].MailingCity;
        }

        Datetime nextDate;
        //Datetime currentDateTime;
        if (showDate == null || showDate.Date() == Date.Today()) {
            System.debug('comeI=n');
            Datetime UTC = System.now();            
          Organization orgDetails = [SELECT Id, TimeZoneSidKey FROM Organization WHERE Id = :UserInfo.getOrganizationId()];
            
			String dateTimeString = UTC.format('yyyy-MM-dd HH:mm:ss', orgDetails.TimeZoneSidKey); 
			DateTime dateTimeObject = DateTime.valueOfGmt(dateTimeString);
            showDate =dateTimeObject;
        }
        System.debug('today>>>'+Date.Today());
        System.debug('showDate>>>'+showDate.Date());
        nextDate = showDate.date().addDays(1);
        List<Theater__c> theatersList = [
            SELECT Id, Name, Location__c, 
            (SELECT Id, Show_Time__c, Show_Format__c, Price__c, Language__c 
             FROM Showtimes__r 
             WHERE Movie__c =: movieId 
             AND Show_Time__c >= :showDate
             AND Show_Time__c < :nextDate Order by Show_Time__c Asc)
            FROM Theater__c 
            WHERE Location__City__s =: city
        ];

        List<Theater__c> theaters = new List<Theater__c>();
        for (Theater__c theater : theatersList) {
            if (theater.Showtimes__r.size() > 0) {
                theaters.add(theater);
                System.debug('Showtimes'+theater.Showtimes__r);
            }
        }

        return theaters.size() > 0 ? theaters : new List<Theater__c>();
    }

    @AuraEnabled
    public static List<Booking__c> getAlreadyBookedTickets(Id showId) {
        if (showId != null) {
            return [SELECT Id, Showtime__c, Seat_Numbers__c, Movie__c, Booking_Status__c 
                    FROM Booking__c 
                    WHERE Showtime__c =: showId 
                    AND Booking_Status__c = 'Booked'];
        } else {
            return new List<Booking__c>();
        }
    }

    @AuraEnabled
    public static Showtime__c getTheaterWithMovieInfo(Id showId) {
        System.debug('');
        if (showId != null) {
            return [SELECT Id, Show_Time__c, Screen__r.Screen_Label__c, Theater__r.Name, Theater__c, 
                           Movie__r.Name, Movie__r.Poster__c, Movie__c, Price__c, Language__c, Show_Format__c 
                    FROM Showtime__c 
                    WHERE Id =: showId LIMIT 1];
        } else {
            return null;
        }
    }
}