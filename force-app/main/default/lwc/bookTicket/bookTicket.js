import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import bookTicket from '@salesforce/apex/TransactionController.bookTicket';
import { refreshApex } from '@salesforce/apex';

export default class BookTicket extends LightningElement {
    @track numOfTickets;
    @track patronEmail;
    @track patronId;
    @track movieId;
    

    // Method to handle field changes
    handleFieldChange(event) {
        //alert('Inside Field Change block');
        const field = event.target.name;
        if (field === 'tickets') {
            this.numOfTickets = event.target.value;
        } else if (field === 'email') {
            this.patronEmail = event.target.value;
        } else if(field ==='patron'){
            this.patronId = event.target.value;
        } else if(field ==='movie'){
            this.movieId = event.target.value;
        }
        //alert(this.numOfTickets+', '+this.patronEmail+', '+this.patronId+', '+this.movieId);
    }
    

    // Method to book ticket on button click
    bookTicketHandler(event) {
        //alert('Inside Button Block');
        // Ensure all required fields are filled
        if (this.patronId && this.movieId && this.numOfTickets && this.patronEmail) {
            bookTicket({
                patronId: this.patronId,
                movieId: this.movieId,
                numOfTickets: this.numOfTickets,
                patronEmail: this.patronEmail
            })
            .then(result => {
                // Show success toast message
                this.showToast('Success', result, 'success');

            })
            .catch(error => {
                // Show error toast message if there's an issue
                this.showToast('Error', error.body.message, 'error');
            });
           // this.handlerefresh();
           refreshApex(this.patronId, this.movieId, this.numOfTickets, this.patronEmail);
        } else {
            // Show an error message if any fields are missing
            this.showToast('Error', 'Please fill in all the fields', 'error');
            refreshApex(this.patronId, this.movieId, this.numOfTickets, this.patronEmail);
        }
    }


    // Method to reset form fields after record creation
    /*handlerefresh() {
       
        alert('Inside Reset Form');
        //refreshApex(this.patronId, this.movieId, this.numOfTickets, this.patronEmail);      
       this.movieId = null;
      this.numOfTickets = null;
       this.patronEmail = null;
    }*/

    // Method to display toast notifications
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
