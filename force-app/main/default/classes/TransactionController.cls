public with sharing class TransactionController {
    @AuraEnabled
    public static String bookTicket(Id patronId, Id movieId, Integer numOfTickets, String patronEmail) {
        try {
            Transaction__c newTransaction = new Transaction__c();
            newTransaction.Patron_Name__c = patronId;  // Lookup to Patron
            newTransaction.Current_Movie__c = movieId;  // Lookup to Movie
            newTransaction.No_tickets_requested_by_Patron__c = numOfTickets;  // Number of Tickets requested
            newTransaction.Patron_Email__c = patronEmail;  // Email

            insert newTransaction;
            //deploy test

            return 'Booked Ticket Successfully';
        } catch (Exception e) {
            throw new AuraHandledException('Error booking the ticket: ' + e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Theatre__c> fetchTheatres(){
        try {
            return [Select Id,Name, Theatre_View__c from Theatre__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

