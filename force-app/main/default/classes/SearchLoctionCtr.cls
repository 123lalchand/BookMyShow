public without sharing class SearchLoctionCtr {
    @AuraEnabled(cacheable=true)
    public static List<City__mdt> getAllCities(){
        return [Select Id,DeveloperName, Popular__c from City__mdt order by DeveloperName asc];
    }
    @AuraEnabled
    public static String getCityOfLogdinUser(){
        If(!string.isBlank(UserInfo.getUserId())){
            User currentUser = [Select Id,ContactId from user where Id =: UserInfo.getUserId()];
            List<Contact> con = [Select Id ,MailingCity  From Contact where Id =:currentUser.ContactId limit 1];
            if(con.size()>0 && !string.isBlank(con[0].MailingCity)){
                return con[0].MailingCity;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
    @AuraEnabled
    public static String updateCityOnContact(String city){
        try{
                User currentUser = [Select Id,ContactId from user where Id =: UserInfo.getUserId()];
                 List<Contact>conList = [Select Id ,MailingCity  From Contact where Id =:currentUser.ContactId limit 1];
            	 for(contact con :conList ){
                        con.MailingCity = city;
                    }
                if(conList.size()>0){
                     update conList;
                    return conList[0].MailingCity;
                }else{
                return null;
            }
        }catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
       
    }
}