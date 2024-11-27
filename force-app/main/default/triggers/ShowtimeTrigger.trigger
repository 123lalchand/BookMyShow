trigger ShowtimeTrigger on Showtime__c (before insert,before update) {
    if(Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)){
        ShowtimeTriggerHandler.updateScreen(Trigger.New);
    }
}