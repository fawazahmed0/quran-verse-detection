var fs = require('fs');

use = require('@tensorflow-models/universal-sentence-encoder');
tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

dataNames = ["ahmedali","ahmedraza","arberry","daryabadi","hilali","itani","maududi","mubarakpuri","pickthall","qarai","qaribullah","sahih","sarwar","shakir","wahiduddin","yusufali"]
// dataNames = ["sahih"]

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
/*
function embedder(dataset){
use.load().then(modeler => modeler.embed(dataset.splice(0,5000))).then( data => {
fulltensor = fulltensor.concat(data)

if(dataset.length>0){
  embedder(dataset)
}else{
  console.log("embedding done")
  return fulltensor
}
})

}
*/


var model;
async function embedder(dataset){
// return use.load().then(modeler => modeler.embed(dataset.splice(0,5000))).then( data => {
return model.embed(dataset.splice(0,5000)).then( data => {
fulltensor = fulltensor.concat(data)

if(dataset.length>0){
  embedder(dataset)
}else{
  console.log("embedding done")
  return fulltensor
}
})
.catch(console.error)

}



fulldatalength = dataArr.length

test_data=dataArr.splice(0,0.15*fulldatalength)
//test_data = await embedder(test_data)
// train_data = await embedder(dataArr)

test_target= targetArr.splice(0,0.15*fulldatalength)
train_target= targetArr



model = tf.sequential();


model.add(tf.layers.dense({
    inputShape: [512],
    activation: 'relu',
    units: 320,
}));

model.add(tf.layers.dense({
    units: 6236,
}));


// Compile the model
model.compile({
  optimizer: tf.train.adam(),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

async function runner(){
  model = await use.load()
  test_data = await embedder(test_data)
  train_data = await embedder(dataArr)
  model.fit(train_data, train_target, {
      batchSize: 5000,
      epochs: 5,
      verbose:1,
      validationSplit: 0.1764,
      shuffle: true,
      callbacks: tf.callbacks.earlyStopping({monitor: 'val_loss',patience:5 })
    }).then(() => {
  model.evaluate(test_data,test_target, {verbose:2})
  saveResults =  model.save('file://./model-1a')
  return saveResults
})
.then(console.log)
.catch(console.error)

}
runner()
