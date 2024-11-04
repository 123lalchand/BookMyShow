import { LightningElement,wire ,track} from 'lwc';
import getAllCities from '@salesforce/apex/SearchLoctionCtr.getAllCities'
export default class SearchLoction extends LightningElement {
    cityValue='';
    @track popularCities=[];
    allCities=[];
    searchedCities=[];
    showCombobox=false;
    
    @wire(getAllCities)
    cities({error,data}){
        if(data){
            this.allCities=data;
            data.forEach(city=>{
                if(city.Popular__c==true){
                    this.popularCities.push(city);
                }
            });
           // console.log('city>>>>',JSON.stringify(this.popularCities));
        }else if(error){
            console.log('error',error);
        }

    }

    handleSearch(event){
        this.cityValue = event.detail.value;
        this.searchedCities=[];
        if(this.cityValue==''){
            this.showCombobox = false;
            return;
        }
        this.showCombobox = true;
        this.allCities.forEach(city=>{
            if(city.DeveloperName.toLowerCase().includes(this.cityValue.toLowerCase())){
                this.searchedCities.push(city);
            }});
       // console.log('cityValue',this.cityValue);
    }
    handleSearchCity(event){
        this.cityValue = event.target.dataset.name;
        this.dispatchEvent(new CustomEvent('selectedcity', {
            detail:{
                message:this.cityValue
            }
        }));
        this.showCombobox = false;
       // console.log('searched city',this.cityValue);
    }

    handlePopularCity(event){
        this.cityValue = event.target.name;
            this.dispatchEvent(new CustomEvent('selectedcity', {
                detail:{
                    message:this.cityValue
                }
        }));
       // console.log('popular city',this.cityValue);
    }
}