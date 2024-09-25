import { LightningElement, track , wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import THEATER from '@salesforce/resourceUrl/theater';
//import MOVIE from '@salesforce/resourceUrl/movie';
//import SHOWTIME from '@salesforce/resourceUrl/showtime';
import getTheatreOptions from '@salesforce/apex/TheatreController.getTheatreOptions';
import fetchTheatreView from '@salesforce/apex/TheatreController.fetchTheatreView';
import getMovieOptions from '@salesforce/apex/TheatreController.getMovieOptions';
import getMovieShowingOptions from '@salesforce/apex/TheatreController.getMovieShowingOptions';
import getPatronOptions from '@salesforce/apex/TheatreController.getPatronOptions';
import toInsertOptions from '@salesforce/apex/TheatreController.toInsertOptions';

export default class suresh_movie_LWC extends LightningElement {
    @track currentStep = 1;
    @track currentStepString = ''+this.currentStep;
    //theater = THEATER;
    //movie = MOVIE;
    //showTime = SHOWTIME;
    @track theatreOptions = [];
    @track movieOptions = [];
    @track movieShowOptions = [];
    @track patronOptions =[];

     // Dummy Data
    /*@track theatreOptions = [
        { label: 'Theatre 1', fieldName: 'theatre1' },
        { label: 'Theatre 2', value: 'theatre2' },
        { label: 'Theatre 3', value: 'theatre3' }
    ];*/

    @wire(getTheatreOptions)
    wiredTheatreOptions({ error, data }) {
        if (data) {
            this.theatreOptions = data;
        } else if (error) {
            console.error('Error fetching Theatre options:', error);
        }
    }
   

    /*@track movieOptions = [
        { label: 'Movie A', value: 'movieA' },
        { label: 'Movie B', value: 'movieB' },
        { label: 'Movie C', value: 'movieC' }
    ];*/

    //to display Movie Options
    @wire(getMovieOptions)
    wiredMovieOptions({ error, data }) {
        if (data) {
            this.movieOptions = data;
        } else if (error) {
            console.error('Error fetching Movie options:', error);
        }
    }

   /* @track showtimeOptions = [
        { label: '10:00 AM', value: '10AM' },
        { label: '1:00 PM', value: '1PM' },
        { label: '4:00 PM', value: '4PM' },
        { label: '7:00 PM', value: '7PM' }
    ];*/

    @wire(getMovieShowingOptions,{
        tId : '$selectedTheatre',
        mId : '$selectedMovie'
    }) 
    MovieShowingOptions({ error, data }) {    
        if (data) {
            this.movieShowOptions = data;
            //alert(this.movieShowOptions);
        } 
        else if (error) {
            console.error('Error fetching Movie options:', error);
        }
    }

    /*@track customerNameOptions = [
        { label: 'John Doe', value: 'john_doe' },
        { label: 'Jane Smith', value: 'jane_smith' },
        { label: 'Alice Johnson', value: 'alice_johnson' }
    ];*/

    //to display Movie Options
    @wire(getPatronOptions)
    wiredPatronOptions({ error, data }) {
        if (data) {
            this.patronOptions = data;
        } else if (error) {
            console.error('Error fetching Movie options:', error);
        }
    }

    @track selectedTheatre;
    @track selectedMovie;
    @track selectedShowtime;
    @track numberOfTickets = 1;
    @track selectedCustomerName;
    @track customerEmail;
    @track customerMobile;
    @track TheatreView;
    TheatreName;

    @track image;

    get isStepOne() {
        return this.currentStep === 1;
    }
    get isStepTwo() {
        return this.currentStep === 2;
    }
    get isStepThree() {
        return this.currentStep === 3;
    }
    get isConfirmation() {
        return this.currentStep === 4;
    }

    handleTheatreChange(event) {
        this.selectedTheatre = event.detail.value;
        fetchTheatreView({
            tId: this.selectedTheatre
        }).then((response) => {
            //this.theatreOptions = response;
            //alert(response);
            this.TheatreView = response.Theatre_View__c;
            this.TheatreName = response.Name;
            var doc = new DOMParser().parseFromString(this.TheatreView, "text/xml");
            this.image = doc.firstChild.innerHTML; 
            this.template.querySelector('.step-content').innerHTML = this.image;
            alert('You have Selected : '+this.TheatreName);
        });
        //alert(this.selectedTheatre);
    }

    handleMovieChange(event) {
        this.selectedMovie = event.detail.value;
        alert(this.selectedMovie);
    }

    handleShowtimeChange(event) {
        this.selectedShowtime = event.detail.value;
        alert(this.selectedShowtime);
    }

    handleTicketChange(event) {
        this.numberOfTickets = event.detail.value;
        alert(this.numberOfTickets);
    }

    handleCustomerNameChange(event) {
        this.selectedCustomerName = event.detail.value;
        alert(this.selectedCustomerName);
    }

    handleCustomerEmailChange(event) {
        this.customerEmail = event.detail.value;
        alert(this.customerEmail);
    }

    handleCustomerMobileChange(event) {
        this.customerMobile = event.detail.value;
    }

    handleNextStep() {
        if (this.currentStep === 1 && !this.selectedTheatre) {
            this.showToast('Error', 'Please select a theatre.', 'error');
            this.currentStepString = ''+this.currentStep;
            return;
        }
        if (this.currentStep === 2 && !this.selectedMovie) {
            this.showToast('Error', 'Please select a movie.', 'error');
             this.currentStepString = ''+this.currentStep;
            return;
        }
        if (this.currentStep === 3) {
            const isValid = this.validateStepThree();
            if (!isValid) {
                return;
            }
        }
        this.currentStep++;
         this.currentStepString = ''+this.currentStep;
    }

    validateStepThree() {
        const isCustomerNameValid = this.selectedCustomerName;
        const isEmailValid = this.validateEmail(this.customerEmail);
        const isMobileValid = this.validateMobile(this.customerMobile);

        if (!isCustomerNameValid) {
            this.showToast('Error', 'Please select a customer name.', 'error');
            return false;
        }
        if (!isEmailValid) {
            this.showToast('Error', 'Please enter a valid email address.', 'error');
            return false;
        }
        if (!isMobileValid) {
            this.showToast('Error', 'Please enter a valid mobile number (10 digits).', 'error');
            return false;
        }
        return true;
    }

    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    validateMobile(mobile) {
        const mobilePattern = /^[0-9]{10}$/;
        return mobilePattern.test(mobile);
    }

    handlePreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
             this.currentStepString = ''+this.currentStep;
        }
    }

    handleConfirm() {
       toInsertOptions({
        showtime: this.selectedShowtime,
        patron: this.selectedCustomerName,
        noOfTickets: this.numberOfTickets,
        patronEmail:this.customerEmail
        }).then(result => {
            // Show success toast message
            this.showToast('Success', result, 'success');

        })
        .catch(error => {
            // Show error toast message if there's an issue
            this.showToast('Error', error.body.message, 'error');
        });

        if (this.validateStepThree()) {
            console.log(`Booking confirmed: ${this.selectedTheatre}, ${this.selectedMovie}, ${this.selectedShowtime}, ${this.numberOfTickets}, ${this.selectedCustomerName}, ${this.customerEmail}, ${this.customerMobile}`);
            this.showToast('Success', 'Your booking has been confirmed!', 'success');
            this.currentStep++;
             this.currentStepString = ''+this.currentStep;
        }
    }

      handleFinish() {
        this.currentStep = 1;
        this.currentStepString = ''+this.currentStep;
        this.showToast('Success', 'Thank you for your booking!', 'success');
        this.currentStep = 1;
        this.selectedTheatre = null;
        this.selectedMovie = null;
        this.selectedShowtime = null;
        this.numberOfTickets = 1;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}