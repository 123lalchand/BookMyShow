import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import theaterLMS from "@salesforce/messageChannel/TheaterLMS__c";

export default class DateFilterForShows extends LightningElement {
    dates = [];
    activeIndex = 0; // Set the first date to be active by default

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.getDaysWithDate();
    }

    // Get 5 upcoming days with formatted dates
    getDaysWithDate() {
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const currentdate = new Date();
        for (let i = 0; i < 5; i++) {
            const tempDate = new Date();
            tempDate.setDate(currentdate.getDate() + i);

            const day = tempDate.getDate();
            const weekday = weekdays[tempDate.getDay()];
            const formattedDate = tempDate; // Format as YYYY-MM-DD
         console.log('formattedDate>>',formattedDate)
            this.dates.push({ 
                currentdate: formattedDate, 
                day: day, 
                weekday: weekday,
                cssClass: i === 0 ? 'dateCard acitvebtn' : 'dateCard' ,
                cssDateClass: i === 0 ? 'date acitvedate' : 'date' 
            });
        }

        console.log(' this.dates>>>>>>', this.dates);
    }
    handleDateBTN(event) {
         const index = event.currentTarget.dataset.index;
        const selectedDate = this.dates[index];
        
        // Determine the time based on the selected date
        const isToday = index == 0 ? true:false;
        var selectedDateTime = new Date(selectedDate.currentdate);
        
        if (isToday) {
            selectedDateTime.setHours(new Date().getHours(), new Date().getMinutes());
        } else {
            selectedDateTime.setHours(7, 0); // Set to 7:00 AM for future dates
        }
          console.log(' index>>>>>>',index);
         console.log(' isToday>>>>>>',isToday);

        console.log(' selectedDateTimes>>>>>>',selectedDateTime);
        this.dates = this.dates.map((date, i) => {
            return {
                ...date,
                cssClass: i === parseInt(index) ? 'dateCard acitvebtn' : 'dateCard' ,
                cssDateClass: i === parseInt(index) ? 'date acitvedate' : 'date'
            };
        });
        

        const message = { Date: selectedDateTime };
        publish(this.messageContext, theaterLMS, message);
    }
}