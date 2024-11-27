import { LightningElement, wire, track } from 'lwc';
import getMoviesBasedOnFilter from '@salesforce/apex/MovieHandler.getMoviesBasedOnFilter';
import moviesFilterLMS from "@salesforce/messageChannel/MoviesFilter__c";
import { subscribe, MessageContext } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';

export default class DisplayMovies extends NavigationMixin(LightningElement) {
    @track movies = [];
    allmovies = [];
    isLoading = true;
    movieAvailable = false;
    movieNotFound = false;
    isUpcomingShow = false;
    isCurrentShow = true;
    city = '';
    
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.getMoviesBasedCityMethod(false, '', 'All', '');
        this.subscriptionMethod();
    }
    
    subscriptionMethod() {
        this.subscription = subscribe(
            this.messageContext,
            moviesFilterLMS,
            (message) => this.getMoviesBasedCityMethod(message.upcomingShow, message.City, message.Language, message.Genres)
        );
    }

    getMoviesBasedCityMethod(upcomingShow, currentcity, language, genres) {
        this.city = currentcity;
       if(language=='' && (genres=='' || genres!='')){
             getMoviesBasedOnFilter({ upcomingShow: upcomingShow, city: currentcity })
            .then(result => {
                if (result.length > 0) {
                    this.allmovies = result;
                    console.log('this.allmovies',this.allmovies);
                    this.formatMovies();
                    this.handleFilters(language, genres);
                    this.isUpcomingShow = upcomingShow;
                    this.movieNotFound = false;
                    this.movieAvailable = true;
                } else {
                    this.movies = [];
                    this.isUpcomingShow = false;
                    this.movieNotFound = true;
                }
                this.isLoading = false;
            })
            .catch(error => {
                console.log('error', error);
            });
       }else{
            this.handleFilters(language, genres);
       }
       
    }

   handleFilters(language, genres) {
    this.isLoding=true;
    this.movieNotFound = false;
    const selectedGenres = genres ? genres.split(';') : [];   
        this.movies = this.allmovies.filter(movie => {
        const languageMatches = language === 'All' || !language || movie.Language__c.includes(language);

        const genreMatches = selectedGenres.length === 0 ||
            selectedGenres.some(genre => movie.Genre__c.split('/').includes(genre.trim()));

        return languageMatches && genreMatches;
    });
    if( this.movies.length==0){
         this.movieNotFound = true;
    }
    this.isLoding=false;
   }

    formatMovies() {
        this.allmovies.forEach(movie => {
            movie.Language__c = movie.Language__c.replaceAll(';', ',');
            movie.Genre__c = movie.Genre__c.replaceAll(';', '/');
            if (movie.Release_Date__c) {
                const date = new Date(movie.Release_Date__c);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear().toString().slice(-2);
                movie.Release_Date__c = `${day} ${month} ${year}`;
            }
        });
    }

    handleBookTicket(event) {
        const movieId = event.currentTarget.dataset.id;
        const params = this.isUpcomingShow
            ? { 'movieId': movieId, 'upcoming': true }
            : { 'movieId': movieId, 'city': this.city };

        this.navigationMixinMethod(params);
    }

    navigationMixinMethod(params) {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'movie-detail'
            },
            state: params
        });
    }
}