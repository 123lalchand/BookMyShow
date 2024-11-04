import { LightningElement,wire,track } from 'lwc';
import getLatestMoviePoster from '@salesforce/apex/MovieHandler.getLatestMoviePoster';
import { NavigationMixin } from 'lightning/navigation';

export default class CarouselOfMovies extends NavigationMixin(LightningElement) {

     @track city;
   @track latestMovies=[];
    @wire(getLatestMoviePoster)
    movies({error,data}){
        if(data){
            data.forEach(item => {
                this.latestMovies.push({movieId: item.movieId,bannerImgBase64: 'data:image/png;base64, '+item.bannerImgBase64});
            });
            console.log(this.latestMovies);
        }else if(error){
            console.log('error',error);
        }
    }

   
    navigateOnMovie(event){
        const movieId = event.target.dataset.id;
        const params = {
            'movieId': movieId
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'movie-detail' 
            },
            state: params
        });
    }
}