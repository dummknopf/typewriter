import { Component, Output, EventEmitter, OnInit, OnDestroy} from "@angular/core";
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig} from '@angular/material';

import { MessageService } from "../../service/message/message.service";
import { Script} from "../../script.model";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ["./message-list.component.css"]
})
export class MessageListComponent implements OnInit, OnDestroy {

	scripts: Script[] = [];
  	private messSub: Subscription;
  @Output() addScript = new EventEmitter();

    constructor(public messageService: MessageService) {}


    ngOnInit() {

	    this.messageService.getScripts();
	    this.messSub = this.messageService.getScriptUpdateListener()
	      .subscribe((scripts: Script[]) => {
					this.scripts = scripts;
				});
  	} 

  	ngOnDestroy() {
    	this.messSub.unsubscribe();
  	}

    deleteScript(scriptId: string) {
    	this.messageService.deleteScript(scriptId);
    }



}
