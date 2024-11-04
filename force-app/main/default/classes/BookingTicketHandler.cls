public without sharing class BookingTicketHandler {
    public static String rozorpayBaseUrl = System.Label.RazorpayBaseUrl;
    public static String RazorpayApiKey = System.Label.RazorpayApiKey;
    public static String RazorpayApiSecret = System.Label.RazorpayApiSecret;

    @AuraEnabled
    public static Booking__c createBookingRecord(String showRecord,decimal totalFees ) {
        try {
		    Map<String, Object> showRecordObj = (Map<String, Object>)JSON.deserializeUntyped(showRecord);
            System.debug('showRecordObj>>'+showRecordObj);
            if(!string.isBlank((String) showRecordObj.get('Id'))){
                Booking__c bookingRecord = new Booking__c();
                bookingRecord.Customer__c = UserInfo.getUserId();
                bookingRecord.Showtime__c=(String)showRecordObj.get('Id');
                bookingRecord.Booking_Date__c = (DateTime)JSON.deserialize('"' + (string)showRecordObj.get('Show_Time__c') + '"', DateTime.class);
                bookingRecord.Theater__c =(String) showRecordObj.get('Theater__c');
                bookingRecord.Movie__c =(String) showRecordObj.get('Movie__c');
                bookingRecord.Per_Ticket_Price__c =(Decimal) showRecordObj.get('Price__c');
             //   bookingRecord.Payment_Status__c = (String)showRecordObj.get('Booked');
                bookingRecord.Fees__c = totalFees;
                bookingRecord.Number_of_Tickets__c = (Integer)showRecordObj.get('totalSelectedSeats');
                bookingRecord.Booking_Status__c = 'Pending';
                bookingRecord.Seat_Numbers__c =  (String)showRecordObj.get('selectedSeatsFormatted');
               insert bookingRecord;
                System.debug('bookingRecord>>'+bookingRecord);
					return bookingRecord;
                }else{
                return null;
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
     @AuraEnabled
    public static List<Booking__c> updateBookingRecord(String moviebookingRecordId, String paymentStatus, String paymentMethod) {
       try {
        List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
     
            List<Booking__c> bookingRecords = [SELECT Id, Payment_Status__c, Payment_Method__c, Booking_Status__c, Customer__r.Email, Customer__r.Name 
                                                FROM Booking__c WHERE Id = :moviebookingRecordId LIMIT 1];
           for (Booking__c bookingRecord : bookingRecords) {
                bookingRecord.Booking_Status__c = 'Booked';
                bookingRecord.Payment_Method__c = paymentMethod;
                if (paymentStatus == 'captured') {
                    bookingRecord.Payment_Status__c = 'Success';
                    emailList.add(sendEmailWithReceipt(bookingRecord)); // Send email if payment is successful
                } else if (paymentStatus == 'failed') {
                    bookingRecord.Payment_Status__c = 'Failed';
                }
            }
          
            if (bookingRecords.size() > 0) {
                try{
                    update bookingRecords;
                    Messaging.SendEmailResult[] results = Messaging.sendEmail(emailList);
                    if (results[0].success) {
                        System.debug('The email was sent successfully.');
                    }
                }catch(Exception ex){
                    System.debug('error : ' +ex.getMessage());
                }
                
                return bookingRecords;
            } else {
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    
    @AuraEnabled
    public static String getPaymentLinkRecord(String paymentLinkId) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(rozorpayBaseUrl + '/v1/payment_links/'+paymentLinkId);
        req.setMethod('GET');
        
        String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(RazorpayApiKey + ':' + RazorpayApiSecret));
        req.setHeader('Authorization', authHeader);
        req.setHeader('Content-Type', 'application/json');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug(res.getStatusCode());
        if(res.getStatusCode()==200){
            System.debug(res.getBody());
            return res.getBody();
        } else{
            return null;
        }

    }

    @AuraEnabled
    public static String createPaymentLink(Decimal amount,String bookingRecordId) {
        User currentUser = [Select Id,ContactId from user where Id =: UserInfo.getUserId()];
       	List<Contact> customer = [Select Id ,Name,Email,Phone  From Contact where Id  = :currentUser.ContactId limit 1];//
        if(customer.size()>0){
        HttpRequest req = new HttpRequest();
        req.setEndpoint(rozorpayBaseUrl + '/v1/payment_links');
        req.setMethod('POST');
        
        String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(RazorpayApiKey + ':' + RazorpayApiSecret));
        req.setHeader('Authorization', authHeader);
        req.setHeader('Content-Type', 'application/json');
        String body = JSON.serialize(new Map<String, Object>{
            'amount' => Math.floor(amount),
            'currency' => 'INR',
            'customer' => new Map<String, Object>{
                'name' => customer[0].Name,
                'contact' => customer[0].Phone!=null?'+91'+customer[0].Phone:'',
                'email' => customer[0].Email
            },
            'notify' => new Map<String, Object>{
                'sms' => false,
                'email' => false
            },
                 'callback_url' => 'https://techmatrix-8c-dev-ed.develop.my.site.com/s/paymentstatus?bookingId='+bookingRecordId,
            //'callback_url' => 'https://techmatrix-8c-dev-ed.develop.preview.salesforce-experience.com/paymentstatus?bookingId='+bookingRecordId,
            'callback_method' => 'get'
        });
        
        req.setBody(body);

        Http http = new Http();
        HTTPResponse res = http.send(req);
		 System.debug(res.getStatusCode());
        if(res.getStatusCode()==200){
            System.debug('body'+res.getBody());
            return res.getBody();
        }else{
            return res.getBody();
        }
        }else{
            return null;
        }
    }
    
      public static  Messaging.SingleEmailMessage sendEmailWithReceipt(Booking__c bookingRecord) {
       
            PageReference pdfPage = Page.BookingReceiptPage; 
            pdfPage.getParameters().put('bookingId', bookingRecord.Id);
            Blob pdfBlob = pdfPage.getContentAsPDF();

            // Create email
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] { bookingRecord.Customer__r.Email });
            email.setSubject('Your Movie Ticket Booking Receipt');
            email.setHtmlBody('Dear ' + bookingRecord.Customer__r.Name + ',<br/><br/>Thank you for your booking! Please find your receipt attached.');
            
            // Attach the PDF to the email
            Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
            attachment.setFileName('BookingReceipt.pdf');
            attachment.setBody(pdfBlob);
            attachment.setContentType('application/pdf');
            email.setFileAttachments(new Messaging.EmailFileAttachment[] { attachment });
            return email;
    }
    
     @AuraEnabled(cacheable=true)
    public static List<Booking__c> getBookingRecords() {
        try{
            return [select Id,Name,Movie__r.Name, Theater__r.Name, Booking_Date__c,Seat_Numbers__c, Total_Price__c, Per_Ticket_Price__c, Payment_Status__c,Number_of_Tickets__c,  Payment_Method__c  from Booking__c where  Customer__c =: UserInfo.getUserId() AND Payment_Status__c !=null Order By Booking_Date__c DESC];
        }catch(DmlException e){
            System.debug('error'+e.getMessage());
            return null;
        }
    }
}