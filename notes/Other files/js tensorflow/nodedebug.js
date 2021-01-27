console.time('test');
var fs = require('fs');

use = require('@tensorflow-models/universal-sentence-encoder');
tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

// dataNames = ["ahmedali","ahmedraza","arberry","daryabadi","hilali","itani","maududi","mubarakpuri","pickthall","qarai","qaribullah","sahih","sarwar","shakir","wahiduddin","yusufali"]
dataNames = ["hilali"]

extension = ".txt"
prestr = "en."
dataArr = []
embeddedDataArr = []
// No of verses
datalenght = 6236

// Array with 0 to 6235 integers
//oneArr = [...Array(datalenght).keys()]
oneArr = []
single = new Array(datalenght).fill(0)

for (i=0;i<single.length;i++){
  temp = [...single]
  temp[i]=1
  oneArr.push(temp)
}

targetArr = []


for (name of dataNames){
var buffer = fs.readFileSync("C:\\Users\\Nawaz\\Downloads\\qdata\\"+prestr+name+extension);
        dataArr= dataArr.concat(buffer.toString().split(/\r?\n/))
targetArr = targetArr.concat(oneArr)
}

// Load the model.
fulltensor = tf.tensor([])


use.load()
.then(modeler => modeler.embed(dataArr.splice(0,500))).then( data => {
  fulltensor = fulltensor.concat(data)
    console.log("embedding done")
    console.timeEnd('test');

})
