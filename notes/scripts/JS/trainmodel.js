var fs = require('fs');
var use = require('@tensorflow-models/universal-sentence-encoder');
var tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');


var datalenght = 6236
var oneArr = []
/*
var single = new Array(datalenght).fill(0)

for (i=0;i<single.length;i++){
  temp = [...single]
  temp[i]=1
  oneArr.push(temp)
}
*/
oneArr = [...Array(datalenght).keys()]
targetArr = []




buffer = fs.readFileSync('./testfilenew')
dataArr = JSON.parse(buffer) // Embedded data

for (i = 0; i < dataArr.length / datalenght; i++) {

  targetArr = targetArr.concat(oneArr)
}
// Shuffling data

var randomorder = tf.util.createShuffledIndices(dataArr.length);

shuffledata = []
shuffletarget = []

for (i = 0; i < dataArr.length; i++) {
  shuffledata[i] = dataArr[randomorder[i]]
  shuffletarget[i] = targetArr[randomorder[i]]
}

dataArr = shuffledata
targetArr = shuffletarget

fulldatalength = dataArr.length

test_data = dataArr.splice(0, 0.15 * fulldatalength)
train_data = dataArr
console.log("dataArr shape: ", dataArr.length, dataArr[0].length)
// This is not required, I can just feed the arrays also, but then during prediction time, I will have to convert the tensor to array and then feed the value
// So training with tensor might be better
test_data = tf.tensor(test_data)
train_data = tf.tensor(dataArr)


test_target = targetArr.splice(0, 0.15 * fulldatalength)
train_target = targetArr
console.log("targetArr shape: ", targetArr.length, targetArr[0].length)
//just debugging
test_target = tf.tensor(test_target)
train_target = tf.tensor(train_target)
// See inputShape

var model = tf.sequential();
/*
model.add(tf.layers.flatten({
//  inputShape:[512]
}));

model.add(tf.layers.dense({
    inputShape: [512],
    units: 100,
}));
*/
model.add(tf.layers.dense({
  inputShape: [512],
  activation: 'relu',
  units: 320,
}));



model.add(tf.layers.dense({
  //  inputShape: [6236],
  activation: 'softmax',
  units: 6236
}));


// Compile the model
model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy'],
});
model.summary()
var batch = 256

function runner() {

  model.fit(train_data, train_target, {
      batchSize: batch,
      epochs: 12,
      verbose: 1,
      validationSplit: 0.1764,
      //      shuffle: true,
      callbacks: tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: 5
      })
    }).then(() => {
      result = model.evaluate(test_data, test_target, {
        batchSize: batch
      })
      console.log("result is ", result.toString())
      //, {verbose:2, batchSize:5000}
      saveResults = model.save('file://./model-1a')
      return saveResults
    })
    .then(console.log)
    .catch(console.error)

}
runner()
