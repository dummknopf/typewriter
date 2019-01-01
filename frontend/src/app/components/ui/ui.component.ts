import { Component, EventEmitter} from "@angular/core";
import { MessageService } from "../../service/message/message.service";

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ["./ui.component.css"]
})
export class UIComponent {

	//@Output() onFilter: EventEmitter = new EventEmitter();

	enteredParagraph = '';
	enteredSentence = '';

    constructor(public tilesService: MessageService) {}
    

    updateParagraph(e)
    {
    	this.enteredParagraph = e.target.value;
    }

    updateSentence(e)
    {
    	this.enteredSentence = e.target.value;
    }

    addScript(){
    	let paragraph = this.enteredParagraph;
    	console.log({message:'AddScript', data:paragraph});

    	this.tilesService.addScript(this.enteredSentence, this.enteredParagraph);
    	this.enteredSentence = '';
    	this.enteredParagraph = '';
    }

}
