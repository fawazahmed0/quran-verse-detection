dataNames = ["ahmedali","ahmedraza","arberry","daryabadi","hilali","itani","maududi","mubarakpuri","pickthall","qarai","qaribullah","sahih","sarwar","shakir","wahiduddin","yusufali"]
extension = ".txt"
prestr = "en."
dataurl = "https://cdn.jsdelivr.net/gh/fawazahmed0/LargeTxtFile@latest/qdata/"
dataArr = []
embeddedDataArr = []
// No of verses
datalenght = 6236
// Array with 0 to 6235 integers
oneArr = [...Array(datalenght).keys()]
targetArr = []
for (name of dataNames){
  fetch(dataurl + prestr + name + extension).then(response => response.text())
    .then(data => {
        dataArr= dataArr.concat(data.split(/\r?\n/))
        if(dataArr.length == datalenght * dataNames.length)
            console.log("complete")
    })
targetArr = targetArr.concat(oneArr)
}

// Returns embedding

// tf.setBackend('wasm')
// embedder = async data => use.load().then(model => model.embed(data)).then()


function begin(){
mymodel.embed(dataArr.splice(0,60)).then( data => {
  console.log(tf.memory())
  data.print()
data.dispose()
console.log(tf.memory())
if(dataArr.length>0){
  begin()
}else{
  console.log("done")
}
})

}
mymodel = await use.load()

fulltensor = tf.tensor([])
size = 60
async function tensordata(data){

chunkarr = chunk(data, size)
loadedmodel = await use.load()
for(batch of chunkarr){

embeddings = await loadedmodel.embed(batch)
fulltensor = await fulltensor.concat(embeddings)
// delete the tensor to save memory

}

return await fulltensor

}

function chunk(arr, chunkSize) {
  var R = [];
  for (var i=0,len=arr.length; i<len; i+=chunkSize)
    R.push(arr.slice(i,i+chunkSize));
  return R;
}


fulldatalength = dataArr.length

test_data=dataArr.splice(0,0.15*fulldatalength)
test_data =  embedder(test_data)
train_data =  embedder(dataArr)

test_target= targetArr.splice(0,0.15*fulldatalength)
train_target= targetArr

[trainx, trainy] =  clean(train_dataset)
[testx, testy] =  clean(test_dataset)
[valx, valy] =  clean(validation_dataset)


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
  loss: 'sparseCategoricalAccuracy',
  metrics: ['accuracy'],
});




model.fit(trainx, trainy, {
    batchSize: batchsize,
    validationData: [valx, valy],
    epochs: 5,
    verbose:1,
    callbacks: tf.callbacks.earlyStopping({monitor: 'val_loss',patience:5 })
  });

model.evaluate(testx,testy, {verbose:2})



const saveResults = await model.save('downloads://my-model-1');




async function clean(data){

// to array it, unzip manually the target, feed the data to use
val =   await data.toArray()
target = val.splice(1)

embeddata = await embedder(val)

return [embeddata, target]
//feed the data to use model and get the embeddings in tensor format
//return embeddings and target

}
