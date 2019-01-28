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
        activateMotor(sentenceChar,"a",0,28);
        activateMotor(sentenceChar,"b",0,29);
        activateMotor(sentenceChar,"c",0,37);
        activateMotor(sentenceChar,"d",0,53);
        activateMotor(sentenceChar,"e",0,44);
        activateMotor(sentenceChar,"f",0,51);
        activateMotor(sentenceChar,"g",0,41);
        activateMotor(sentenceChar,"h",0,49);
        activateMotor(sentenceChar,"i",0,46);
        activateMotor(sentenceChar,"l",0,22);
        activateMotor(sentenceChar,"m",0,25);
        activateMotor(sentenceChar,"n",0,27);
        activateMotor(sentenceChar,"o",0,38);
        activateMotor(sentenceChar,"k",0,24);
        activateMotor(sentenceChar,"p",0,48);
        activateMotor(sentenceChar,"q",0,52);
        activateMotor(sentenceChar,"r",0,42);
        activateMotor(sentenceChar,"s",0,26);
        activateMotor(sentenceChar,"t",0,30);
        activateMotor(sentenceChar,"u",0,34);
        activateMotor(sentenceChar,"v",0,35);
        activateMotor(sentenceChar,"w",0,50);
        activateMotor(sentenceChar,"z",0,32);
        activateMotor(sentenceChar,"x",0,43);
        activateMotor(sentenceChar,"y",0,45);
        activateMotor(sentenceChar," ",0,23);
        activateMotor(sentenceChar,".",0,31);
        activateMotor(sentenceChar,",",0,33);
        activateMotor(sentenceChar,"?",0,54);
        activateMotor(sentenceChar,"!",0,55);

        // Here Red tabbing/space led36
        // Here -> for tab back led46

        activateMotor(paragraphChar,"a",sentenceChar.length,28);
        activateMotor(paragraphChar,"b",sentenceChar.length,29);
        activateMotor(paragraphChar,"c",sentenceChar.length,37);
        activateMotor(paragraphChar,"d",sentenceChar.length,53);
        activateMotor(paragraphChar,"e",sentenceChar.length,44);
        activateMotor(paragraphChar,"f",sentenceChar.length,51);
        activateMotor(paragraphChar,"g",sentenceChar.length,41);
        activateMotor(paragraphChar,"h",sentenceChar.length,49);
        activateMotor(paragraphChar,"i",sentenceChar.length,46);
        activateMotor(paragraphChar,"l",sentenceChar.length,22);
        activateMotor(paragraphChar,"m",sentenceChar.length,25);
        activateMotor(paragraphChar,"n",sentenceChar.length,27);
        activateMotor(paragraphChar,"o",sentenceChar.length,38);
        activateMotor(paragraphChar,"k",sentenceChar.length,24);
        activateMotor(paragraphChar,"p",sentenceChar.length,48);
        activateMotor(paragraphChar,"q",sentenceChar.length,52);
        activateMotor(paragraphChar,"r",sentenceChar.length,42);
        activateMotor(paragraphChar,"s",sentenceChar.length,26);
        activateMotor(paragraphChar,"t",sentenceChar.length,30);
        activateMotor(paragraphChar,"u",sentenceChar.length,34);
        activateMotor(paragraphChar,"v",sentenceChar.length,35);
        activateMotor(paragraphChar,"w",sentenceChar.length,50);
        activateMotor(paragraphChar,"z",sentenceChar.length,32);
        activateMotor(paragraphChar,"x",sentenceChar.length,43);
        activateMotor(paragraphChar,"y",sentenceChar.length,45);
        activateMotor(paragraphChar," ",sentenceChar.length,23);
        activateMotor(paragraphChar,".",sentenceChar.length,31);
        activateMotor(paragraphChar,",",sentenceChar.length,33);
        activateMotor(paragraphChar,"?",sentenceChar.length,54);
        activateMotor(paragraphChar,"!",sentenceChar.length,55);
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
  var led22 = new five.Led(22);
  var led23 = new five.Led(23);
  var led24 = new five.Led(24);
  var led25 = new five.Led(25);
  var led26 = new five.Led(26);
  var led27 = new five.Led(27);
  var led28 = new five.Led(28);
  var led29 = new five.Led(29);
  var led30 = new five.Led(30);
  var led31 = new five.Led(31);
  var led32 = new five.Led(32);
  var led33 = new five.Led(33);
  var led34 = new five.Led(34);
  var led35 = new five.Led(35);
  var led36 = new five.Led(36);
  var led37 = new five.Led(37);
  var led38 = new five.Led(38);
  var led39 = new five.Led(39);
  var led40 = new five.Led(40);
  var led41 = new five.Led(41);
  var led42 = new five.Led(42);
  var led43 = new five.Led(43);
  var led44 = new five.Led(44);
  var led45 = new five.Led(45);
  var led46 = new five.Led(46);
  var led47 = new five.Led(47);
  var led48 = new five.Led(48);
  var led49 = new five.Led(49);
  var led50 = new five.Led(50);
  var led51 = new five.Led(51);
  var led52 = new five.Led(52);
  var led53 = new five.Led(53);
  
  switch(m)
  {
    case 22:
      led22.on();
      setTimeout(() => led22.off(), 1000);
    break;
    case 23:
      led23.on();
      setTimeout(() => led23.off(), 1000);
    break;
    case 24:
      led24.on();
      setTimeout(() => led24.off(), 1000);
    break;
    case 25:
      led25.on();
      setTimeout(() => led25.off(), 1000);
    break;
    case 26:
      led26.on();
      setTimeout(() => led26.off(), 1000);
    break;
    case 27:
      led27.on();
      setTimeout(() => led27.off(), 1000);
    break;
    case 28:
      led28.on();
      setTimeout(() => led28.off(), 1000);
    break;
    case 29:
      led29.on();
      setTimeout(() => led29.off(), 1000);
    break;
    case 30:
      led30.on();
      setTimeout(() => led30.off(), 1000);
    break;
    case 31:
      led31.on();
      setTimeout(() => led31.off(), 1000);
    break;
    case 32:
      led32.on();
      setTimeout(() => led32.off(), 1000);
    break;
    case 33:
      led33.on();
      setTimeout(() => led33.off(), 1000);
    break;
    case 34:
      led34.on();
      setTimeout(() => led34.off(), 1000);
    break;
    case 35:
      led35.on();
      setTimeout(() => led35.off(), 1000);
    break;
    case 36:
      led36.on();
      setTimeout(() => led36.off(), 1000);
    break;
    case 37:
      led37.on();
      setTimeout(() => led37.off(), 1000);
    break;
    case 38:
      led38.on();
      setTimeout(() => led38.off(), 1000);
    break;
    case 39:
      led39.on();
      setTimeout(() => led39.off(), 1000);
    break;
    case 40:
      led40.on();
      setTimeout(() => led40.off(), 1000);
    break;
    case 41:
      led41.on();
      setTimeout(() => led41.off(), 1000);
    break;
    case 42:
      led42.on();
      setTimeout(() => led42.off(), 1000);
    break;
    case 43:
      led43.on();
      setTimeout(() => led43.off(), 1000);
    break;
    case 44:
      led44.on();
      setTimeout(() => led44.off(), 1000);
    break;
    case 45:
      led45.on();
      setTimeout(() => led45.off(), 1000);
    break;
    case 46:
      led46.on();
      setTimeout(() => led46.off(), 1000);
    break;
    case 47:
      led47.on();
      setTimeout(() => led47.off(), 1000);
    break;
    case 48:
      led48.on();
      setTimeout(() => led48.off(), 1000);
    break;
    case 49:
      led49.on();
      setTimeout(() => led49.off(), 1000);
    break;
    case 50:
      led50.on();
      setTimeout(() => led50.off(), 1000);
    break;
    case 51:
      led51.on();
      setTimeout(() => led51.off(), 1000);
    break;
    case 52:
      led52.on();
      setTimeout(() => led52.off(), 1000);
    break;
    case 53:
      led53.on();
      setTimeout(() => led53.off(), 1000);
    break;
    case 54:
      led39.on();
      led33.on();
      setTimeout(() => led33.off(), 1000);
      setTimeout(() => led39.off(), 1000);
    break;
    case 55:
      led39.on();
      led31.on();
      setTimeout(() => led31.off(), 1000);
      setTimeout(() => led39.off(), 1000);
    break;
    default:
      led53.on();
      setTimeout(() => led53.off(), 1000);
  }

};


module.exports = app;