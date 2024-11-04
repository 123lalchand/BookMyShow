@isTest
public class SearchLoctionCtrTest {
	 @testSetup static void setup() {
       User currentUser = [Select Id,ContactId from user where Id =: UserInfo.getUserId()];
       	// System.RunAs(currentUser){
         contact con = new contact ();
         con.LastName= 'test';
         con.MailingCity = 'Ajmer';
         insert con;
         
         currentUser.contactId = currentUser.Id;
         update currentUser;
    }
    @istest
    public static void getCityOfLogdinUserTest(){
		test.startTest();
        	SearchLoctionCtr.getAllCities();
        test.stopTest();
    }
     @istest
    public static void updateCityOnContactTest(){
        User currentUser = [Select Id,ContactId from user where Id =: UserInfo.getUserId()];
    }
}