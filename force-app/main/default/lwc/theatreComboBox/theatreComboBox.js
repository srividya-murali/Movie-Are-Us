import { LightningElement, wire, track } from 'lwc';
import getTheatreOptions from '@salesforce/apex/TheatreController.getTheatreOptions';
import getMovieOptions from '@salesforce/apex/TheatreController.getMovieOptions';
import getMovieShowingOptions from '@salesforce/apex/TheatreController.getMovieShowingOptions';

export default class TheatreCombobox extends LightningElement {
    @track theatreOptions = [];
    @track movieOptions = [];
    @track movieShowOptions = [];
    @track selectedTheatre; 
    @track selectedMovie; 
    tId;
    mId;
    
    //to display Theatre Options
    @wire(getTheatreOptions)
    wiredTheatreOptions({ error, data }) {
        if (data) {
            this.theatreOptions = data;
            //alert(this.theatreOptions);
        } else if (error) {
            console.error('Error fetching Theatre options:', error);
        }
    }

    //to display Movie Options
    @wire(getMovieOptions)
    wiredMovieOptions({ error, data }) {
        if (data) {
            this.movieOptions = data;
        } else if (error) {
            console.error('Error fetching Movie options:', error);
        }
    }

    //to display Movie Showing Options
    handleChange(event) {
        this.selectedTheatre = event.detail.value;
       //let tId = this.selectedTheatre;
       alert(this.selectedTheatre);
        
    }

    
    handleMovieChange(event) {
        this.selectedMovie = event.detail.value;
        //let mId = this.selectedMovie;
        alert(this.selectedMovie);
    }

    //to display Movie Options
    @wire(getMovieShowingOptions,{
        tId : '$selectedTheatre',
        mId : '$selectedMovie'
    }) 
    MovieShowingOptions({ error, data }) {    
        if (data) {
            //alert(tId+' , '+mId);
            this.movieShowOptions = data;
            alert(this.movieShowOptions);
        } else if (error) {
            console.error('Error fetching Movie options:', error);
        }
    }


    handleMovieShowingChange(event) {
        this.selectedMovieShowing = event.detail.value;
        //alert(this.selectedMovieShowing);
    }
}
