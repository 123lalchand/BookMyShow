public with sharing class ShowtimeTriggerHandler {
    public static void updateScreen(List<Showtime__c> showList){
        Set<Id> theaterIds=new Set<Id>();
        for(Showtime__c show : showList){
            //System.debug('>>> '+show.Theater__c);
            theaterIds.add(show.Theater__c);
        }
        
        System.debug('theaterIds>>>'+theaterIds);
        Map<Id,List<Screen__c>> mapOfIdAndListOfScreen = new  Map<Id,List<Screen__c>>();
        if(theaterIds.size()>0){
            List<Theater__c> theaters = [SELECT Id,(SELECT Id,Type__c from Screens__r) FROM Theater__c where Id IN :theaterIds];
            for(Theater__c theater:theaters){
                 mapOfIdAndListOfScreen.put(theater.Id,theater.Screens__r);
            }
            
        }
         System.debug('mapOfIdAndListOfScreen>>>'+mapOfIdAndListOfScreen);
        System.debug('showList>>>'+showList);
        for(Showtime__c show : showList){
            for(Screen__c screen : mapOfIdAndListOfScreen.get(show.Theater__c)){
                if(show.Show_Format__c.toLowerCase() == screen.Type__c.toLowerCase()){
                    show.Screen__c = screen.Id;
                }
            }
        }
         System.debug('showList>>>'+showList);
    }
}