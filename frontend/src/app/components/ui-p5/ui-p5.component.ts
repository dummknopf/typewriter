import { Component, EventEmitter, OnInit, OnChanges, SimpleChanges} from "@angular/core";
import { MessageService } from "../../service/message/message.service";
import * as ml5 from 'ml5';
import { TouchSequence } from "selenium-webdriver";
import { generate } from "rxjs";

@Component({
  selector: 'app-uip5',
  templateUrl: './ui-p5.component.html',
  styleUrls: ["./ui-p5.component.css"]
})

export class UIP5Component implements OnInit, OnChanges {

  runningInference = false;
  status = "Model Ready!";
  enteredSentence = "";
  showText = "not generated yet";
  charRNN;
  dataSentence;

  constructor(public tilesService: MessageService) {}

  ngOnInit() {

    this.charRNN = ml5.charRNN('/assets/models/woolf/', modelReady);

    function modelReady() {
      return "Model Loaded";
    }
  }

  ngOnChanges( changes: SimpleChanges){

    console.log(changes);

  }

  // Generate new text
  generate() {
    let outcome = "";
    if(!this.runningInference) {
      this.runningInference = true;
      // Check if there's something to send
      console.log(this.enteredSentence.length);
      if (this.enteredSentence.length > 0) {
          
        this.dataSentence = {
          seed: this.enteredSentence,
          temperature: 1,
          length: 300
        }
        console.log(this.dataSentence);

        // Generate text with the charRNN
        this.getDataAsync(this.dataSentence).then(outcome => {
          let generatedParagraph = outcome;
          this.addScript(this.enteredSentence,generatedParagraph);
        });

        this.runningInference = false;
      }
      else
      {
        console.log("No characters inserted");
      }
    }
  }

  getDataAsync(param) {
    return new Promise((resolve, reject) => {
      this.charRNN.generate(param, function(err,results){
        if(err) 
        {
          reject("there is an error");
        }
        else
        {
          let out = results.sample.substring(1, results.sample.lastIndexOf('.'));
          out = out + ".";
          console.log(out);
          resolve(out);
          window.location.reload();
        }
      });
    });
  }

  updateSentence(e)
  {
    this.enteredSentence = e.target.value;
    console.log(this.enteredSentence);
  }

  addScript(txt,gen){
    //console.log({message:'AddScript', text:txt, paragraph:gen});
    this.tilesService.addScript(txt, gen);
    this.enteredSentence = '';
  }

}