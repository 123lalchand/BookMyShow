public with sharing class MovieHandler {
	 @AuraEnabled(cacheable=true)
    public static User getLogdinUserId() {
        return [Select Id,ContactId from User where Id =: UserInfo.getUserId()];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Review__c> getAllRandomMovieReviews(String movieId) {
        return [Select Id,Review__c, Rating__c,User__c,User__r.Name from Review__c where Movie__c =:movieId];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<LatestMovieBannerWrapper> getLatestMoviePoster() {
        List<Movie__c> latestMovies = [Select Id,Name,Release_Date__c from  Movie__c where Release_Date__c <=THIS_WEEK AND Release_Date__c = LAST_N_DAYS:20 order by createdDate DESC];
        
        if (latestMovies.isEmpty()) {
            return new List<LatestMovieBannerWrapper>();
        }

        Set<Id> movieIds = new Set<Id>();
        for (Movie__c movie : latestMovies) {
            movieIds.add(movie.Id);
        }
        
        List<ContentDocumentLink> contentDocumentLinks = [SELECT LinkedEntityId, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId IN :movieIds];

        if (contentDocumentLinks.isEmpty()) {
            return new List<LatestMovieBannerWrapper>();
        }

        Map<Id, Id> movieToDocumentMap = new Map<Id, Id>();
        for (ContentDocumentLink cdl : contentDocumentLinks) {
            movieToDocumentMap.put(cdl.ContentDocumentId, cdl.LinkedEntityId);
        }
        
        List<ContentVersion> contentVersions = [SELECT ContentDocumentId, VersionData FROM ContentVersion WHERE ContentDocumentId IN :movieToDocumentMap.keySet()];
        List<LatestMovieBannerWrapper> bannerWrappers = new List<LatestMovieBannerWrapper>();

        for (ContentVersion cv : contentVersions) {
            LatestMovieBannerWrapper wrapper = new LatestMovieBannerWrapper();
            wrapper.bannerImgBase64 = EncodingUtil.base64Encode(cv.VersionData);
            wrapper.movieId = movieToDocumentMap.get(cv.ContentDocumentId);
            bannerWrappers.add(wrapper);
        }

        return bannerWrappers;
    }
	
    @AuraEnabled
    public static List<Movie__c> getMoviesBasedOnFilter(Boolean upcomingShow,String city) {//,String language,string genres
            String currentCity= '';
            User currentUser = [Select Id,ContactId from user where Id =: UserInfo.getUserId()];
            currentCity = [Select Id ,MailingCity  From Contact where Id =:currentUser.ContactId limit 1].MailingCity;
        	String query='';
            if(upcomingShow){
                query += 'SELECT Id, Name, Poster__c, Genre__c, Language__c,Release_Date__c FROM Movie__c WHERE Release_Date__c >Today ';
            }else{
                 Set<Id> movieIds = new Set<Id>();
                 if(!String.isBlank(city)){
                   currentCity = city;
                }
                List<Showtime__c> ShowtimeList =  [SELECT Movie__c FROM Showtime__c WHERE Theater__r.Location__City__s = :currentCity AND Show_Time__c >= Today];
                for(Showtime__c shows : ShowtimeList){
                    movieIds.add(shows.Movie__c);
                }
                query += 'SELECT Id, Name, Poster__c, Genre__c, Language__c FROM Movie__c WHERE Id IN :movieIds AND Release_Date__c = LAST_N_DAYS:20';  
               /* if((!String.isBlank(language) && language!='All') && (!String.isBlank(genres))){
                    query+=' AND ( Language__c INCLUDES(:language) AND Genre__c INCLUDES(:genres))';
                }else if((!String.isBlank(language) && language!='All') || (!String.isBlank(genres))){
                    query+=' AND ( Language__c INCLUDES(:language) OR Genre__c INCLUDES(:genres))';
                }*/
                 query +=' Order by createdDate DESC';
            }
     
        	System.debug(Database.query(query));
        
        	return  Database.query(query);//[SELECT Id, Name, Poster__c, Genre__c, Language__c FROM Movie__c WHERE  ( Language__c INCLUDES(:language) OR Genre__c INCLUDES(:genres)) AND  Id IN : movieIds];
          }
        @AuraEnabled
    public static Movie__c getMovieDetails(Id movieId){
        return [SELECT Id, Name, Poster__c, isShowing__c, Genre__c,MovieTrailerLink__c,Duration__c, Language__c,Release_Date__c FROM Movie__c WHERE Id=:movieId limit 1];
    }

    

    public class LatestMovieBannerWrapper {
        @AuraEnabled
        public String bannerImgBase64 { get; set; }
        
        @AuraEnabled
        public String movieId { get; set; }
    }
}