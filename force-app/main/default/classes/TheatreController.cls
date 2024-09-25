public with sharing class TheatreController {
    //to fetch Theatres
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getTheatreOptions() {
        List<Map<String, String>> toptions = new List<Map<String, String>>();
        for (Theatre__c theatre : [SELECT Id, Name FROM Theatre__c]) {
            Map<String, String> toption = new Map<String, String>();
            toption.put('value', theatre.Id);
            toption.put('label', theatre.Name);
            toptions.add(toption);
        }
        return toptions;
    }

    //to fetch Theatre Image
    @AuraEnabled(cacheable=true)
    public static Theatre__c fetchTheatreView(Id tId){
        try {
            return [Select Name, Theatre_View__c from Theatre__c WHERE Id = :tId WITH SECURITY_ENFORCED limit 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //to Fetch Movies
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getMovieOptions() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        for (Movie__c movie : [SELECT Id, Name FROM Movie__c]) {
            Map<String, String> option = new Map<String, String>();
            option.put('value', movie.Id);
            option.put('label', movie.Name);
            options.add(option);
        }
        return options;
    }

    //to fetch Movies Showing Based on Theatre & Movie Selected Previously
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getMovieShowingOptions(String mId, String tId) {
        
        List<Map<String, String>> moptions = new List<Map<String, String>>();
        
        for (Movie_Showing__c movieshow : [SELECT Id, Name FROM Movie_Showing__c WHERE Movie_Name__c = : mId AND Theatre__c = : tId AND No_remaining_tickets__c > 0]) {
            Map<String, String> moption = new Map<String, String>();
            moption.put('value', movieshow.Id);
            moption.put('label', movieshow.Name);
            moptions.add(moption);
        
        }
        return moptions;
    }

    //to Fetch Patrons
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getPatronOptions() {
        List<Map<String, String>> poptions = new List<Map<String, String>>();
        for (Patron__c patron : [SELECT Id, Name FROM Patron__c]) {
            Map<String, String> poption = new Map<String, String>();
            poption.put('value', patron.Id);
            poption.put('label', patron.Name);
            poptions.add(poption);
        }
        return poptions;
    }

    //to Add new Transactions/Booking
    @AuraEnabled
    public static String toInsertOptions(String patron, String showtime, Integer noOfTickets, string patronEmail) {
        Transaction__c booking = new Transaction__c();
            booking.Patron_Name__c = patron;
            booking.Current_Movie__c = showtime;
            booking.No_tickets_requested_by_Patron__c = noOfTickets;
            booking.Patron_Email__c = patronEmail;

        try {
            insert booking;
            return 'Transaction Booked Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }
}

