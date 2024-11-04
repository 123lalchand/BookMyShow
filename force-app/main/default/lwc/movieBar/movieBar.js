import { LightningElement,wire } from 'lwc';
import { publish,MessageContext } from 'lightning/messageService';
import moviesFilterLMS from "@salesforce/messageChannel/MoviesFilter__c";

export default class MovieBar extends LightningElement {
    upcomingShow = false ; 
    @wire(MessageContext)
    messageContext;

    handleShow(event){
        var nowShowingBtn = this.template.querySelector('.nowShowingbtn');
        var upcomingBtn = this.template.querySelector('.upcomingbtn');
        
           if(event.target.name==='nowShowing'){
                nowShowingBtn.classList.add("activebtn");
                upcomingBtn.classList.remove("activebtn");
                nowShowingBtn.classList.remove("btn");
                upcomingBtn.classList.add("btn");
                this.upcomingShow = false;
           }else if(event.target.name==='upcoming'){
              
                upcomingBtn.classList.add("activebtn"); 
                upcomingBtn.classList.remove("btn"); 
                nowShowingBtn.classList.remove("activebtn");
                nowShowingBtn.classList.add("btn");
                this.upcomingShow = true;
            }
            const messagePayload = {
                upcomingShow:this.upcomingShow,
                City:null,
                Language:null,
                Genres:null
            };
            publish(this.messageContext, moviesFilterLMS, messagePayload);
    }
}