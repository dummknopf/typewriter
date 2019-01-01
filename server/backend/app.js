const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const EtherPortClient = require("etherport-client").EtherPortClient;
const five = require('johnny-five');
const Script = require('./models/model');
const app = express();
var interference = false;
var tempId = "0";
var idCheck = "1";

/*const board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.1.102", //Your IP goes here
    port: 3030
  }),
  timeout: 1e5,
  repl: false
});*/

const board = new five.Board();

mongoose.connect("mongodb://localhost:27017/scripts")
  .then(() => {
    console.log('Connected to Mongo');
  })
  .catch(() => {
    console.log("There is an error");
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


app.post("/api/scripts", (req,res, next) => {

  //var s = req.body.sentence.split('');
  //var schar =  s.replace(/,/g, '');
  const script = new Script({
    sentence: req.body.sentence,
    sentence_char: req.body.sentence.split(''),
    paragraph: req.body.paragraph,
    paragraph_char: req.body.paragraph.split('')
  });

  script.save().then(createdScript => {
    
    res.status(201).json({
      message:"Paragraph added",
      scriptId: createdScript._id
    });

  })
  
  //console.log(sentence);

});

app.get("/api/scripts", (req,res, next) => {

  Script.find()
    .then(documents => {
      res.status(200).json({
        message:"OK",
        scripts: documents
      });
    })
    .catch();
  
    Script.find()
    .then(documents => {

      const id = documents[documents.length-1]._id;
      idCheck = id.toString();

      console.log(tempId);
      console.log(idCheck);

      if(tempId === "0")
      {
        interference = true;
        tempId = idCheck;
        console.log(tempId);
        console.log("Yes 0 No Print")
      }
      else if (tempId === idCheck)
      {
        interference = true;
        console.log(tempId);
        console.log("No 0 No Print")
      }
      else
      {
        console.log(idCheck);
        interference = false;
        tempId = idCheck;
        console.log(tempId);
        console.log("Yes Print")
      }

      if(interference == false)
      {

        interference = true;
        const sen = documents[documents.length-1];
        const sentenceChar = sen.sentence_char.replace(/,/g, '');

        const par = documents[documents.length-1];
        const paragraphChar = par.paragraph_char.replace(/,/g, '');

        console.log(interference);
        setTimeout(() => { interference = false; console.log(interference);}, 
        (sentenceChar.length*1000)+(1000+paragraphChar.length*1000));

        board.on("ready", onReady);

        // Sentence Loop
        activateMotor(sentenceChar,"a",0,7);
        activateMotor(sentenceChar,"b",0,6);
        activateMotor(sentenceChar,"c",0,6);
        activateMotor(sentenceChar,"d",0,6);
        activateMotor(sentenceChar,"e",0,6);
        activateMotor(sentenceChar,"f",0,6);
        activateMotor(sentenceChar,"g",0,6);
        activateMotor(sentenceChar,"h",0,6);
        activateMotor(sentenceChar,"i",0,4);
        activateMotor(sentenceChar,"l",0,6);
        activateMotor(sentenceChar,"m",0,6);
        activateMotor(sentenceChar,"n",0,6);
        activateMotor(sentenceChar,"o",0,6);
        activateMotor(sentenceChar,"k",0,6);
        activateMotor(sentenceChar,"p",0,6);
        activateMotor(sentenceChar,"q",0,6);
        activateMotor(sentenceChar,"r",0,6);
        activateMotor(sentenceChar,"s",0,6);
        activateMotor(sentenceChar,"t",0,12);
        activateMotor(sentenceChar,"u",0,6);
        activateMotor(sentenceChar,"v",0,6);
        activateMotor(sentenceChar,"w",0,6);
        activateMotor(sentenceChar,"z",0,6);
        activateMotor(sentenceChar,"x",0,6);
        activateMotor(sentenceChar,"y",0,6);
        activateMotor(sentenceChar," ",0,9);
        activateMotor(sentenceChar,".",0,6);
        activateMotor(sentenceChar,":",0,6);

        activateMotor(paragraphChar,"a",sentenceChar.length,7);
        activateMotor(paragraphChar,"b",sentenceChar.length,6);
        activateMotor(paragraphChar,"c",sentenceChar.length,6);
        activateMotor(paragraphChar,"d",sentenceChar.length,6);
        activateMotor(paragraphChar,"e",sentenceChar.length,6);
        activateMotor(paragraphChar,"f",sentenceChar.length,6);
        activateMotor(paragraphChar,"g",sentenceChar.length,6);
        activateMotor(paragraphChar,"h",sentenceChar.length,6);
        activateMotor(paragraphChar,"i",sentenceChar.length,4);
        activateMotor(paragraphChar,"l",sentenceChar.length,6);
        activateMotor(paragraphChar,"m",sentenceChar.length,6);
        activateMotor(paragraphChar,"n",sentenceChar.length,6);
        activateMotor(paragraphChar,"o",sentenceChar.length,6);
        activateMotor(paragraphChar,"k",sentenceChar.length,6);
        activateMotor(paragraphChar,"p",sentenceChar.length,6);
        activateMotor(paragraphChar,"q",sentenceChar.length,6);
        activateMotor(paragraphChar,"r",sentenceChar.length,6);
        activateMotor(paragraphChar,"s",sentenceChar.length,6);
        activateMotor(paragraphChar,"t",sentenceChar.length,12);
        activateMotor(paragraphChar,"u",sentenceChar.length,6);
        activateMotor(paragraphChar,"v",sentenceChar.length,6);
        activateMotor(paragraphChar,"w",sentenceChar.length,6);
        activateMotor(paragraphChar,"z",sentenceChar.length,6);
        activateMotor(paragraphChar,"x",sentenceChar.length,6);
        activateMotor(paragraphChar,"y",sentenceChar.length,6);
        activateMotor(paragraphChar," ",sentenceChar.length,9);
        activateMotor(paragraphChar,".",sentenceChar.length,6);
        activateMotor(paragraphChar,":",sentenceChar.length,6);
      }
      else
      {
        console.log("Wait babe");
      }
    })
    .catch();

});

app.delete("/api/scripts/:id", (req,res, next) => {
  Script.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message:"Script deleted"});
  });
});

function activateMotor(charArray, indexValue, delay, motor)
{
  /*console.log(getCharIndex(charArray,indexValue));
  console.log(getCharIndex(charArray,indexValue).length);*/
  for(i = 0; i < getCharIndex(charArray,indexValue).length; i++)
  {
    if(getCharIndex(charArray,indexValue)[i] == 0)
    {
      setTimeout(() => {
        console.log(indexValue);
        onReady(motor);
      }, (getCharIndex(charArray,indexValue)[i]*1000)+(1000+delay*1000));
    }
    else
    {
      setTimeout(() => {
        console.log(indexValue);
        onReady(motor);
      },(getCharIndex(charArray,indexValue)[i]*1000)+(1000+delay*1000));
    }
  }
}

function getCharIndex(arr, val) {
  var indexes = [], i = -1;
  var arrLower = arr.toLowerCase();
  while ((i = arrLower.indexOf(val, i+1)) != -1){
      indexes.push(i);
  }
  return indexes;
}

function onReady(m) {
  var led6 = new five.Led(6);
  var led4 = new five.Led(4);
  var led7 = new five.Led(7);
  var led9 = new five.Led(9);
  var led12 = new five.Led(12);
  
  switch(m)
  {
    case 4:
      led4.on();
      setTimeout(() => led4.off(), 1000);
    break;
    case 7:
      led7.on();
      setTimeout(() => led7.off(), 1000);
    break;
    case 9:
      led9.on();
      setTimeout(() => led9.off(), 1000);
    break;
    case 12:
      led12.on();
      setTimeout(() => led12.off(), 1000);
    break;
    default:
      led6.on();
      setTimeout(() => led6.off(), 1000);
  }

};


module.exports = app;