var fs = require('fs');
var use = require('@tensorflow-models/universal-sentence-encoder');
var tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');







buffer = fs.readFileSync('C:\\Users\\Nawaz\\Desktop\\qadev\\js tensorflow\\testfilenew')
dataArr = JSON.parse(buffer)  // Embedded data




var sentensemodel = use.load()

async function a(){
loadedmodel = await tf.loadLayersModel("file://./jsmodel/normal/model.json")
usemodel = await sentensemodel
embed = await usemodel.embed([`g Surah an-Nur (24:30-31) “Tell the believing men to cast down their looks and guard their private parts; that is purer for them; surely Allah is aware of what they do. And tell the believing women that they cast down their looks and guard their private parts and do not display their ornaments except what appears thereof….`])
//var model = tf.sequential()
//model.add(loadedmodel)
//model.add(tf.layers.softmax())
// predictions = loadedmodel.predict(tf.tensor(dataArr.slice(0,5)))
predictions = loadedmodel.predict(embed).softmax()
// 1 represents 1st dimension in argMax, default is 0 dimension, our single data is in 1st dimension, in 0th dim we have list of data
// ref: https://stackoverflow.com/questions/41708572/tensorflow-questions-regarding-tf-argmax-and-tf-equal
console.log(predictions.argMax(1).dataSync())
console.log(predictions.max(1).dataSync())
}
a().catch(console.error)
