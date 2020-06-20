# quran-verse-detection
Give any verse and it will tell the specific Chapter and Verse No of Quran

This is a TensorflowJS model, which can be used in browser to detect the chapter and Verse No of a given verse. This model depends on  [Universal Sentence Encoder Lite Model](https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder-lite/1/default/1 "Sentence Encoder Lite Model") 
It will output the specific line the specific verse it corresponds to and we can use that line number to get the chapter No and verse No

**Note:** 
Line number begins from 0 for this model, for example line number 0 corresponds to chapter 1, verse 1

**Example([Link](https://codepen.io/fawazahmed0/pen/oNbZbRb?editors=1111 "link")):**
```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"></script>
<script>
```
```javascript
// It will take some time to load the above scripts, the total size of this model(including the above script and model)is around 32mb
console.log("Please wait the model is loading")
// Loading quran verse detection model
var model1 = tf.loadLayersModel("https://cdn.jsdelivr.net/gh/fawazahmed0/quran-verse-detection@master/model/model.json")
// Loading universal sentence encoder model
var model2 = use.load()

async function run(){
// Assigning the models to new variables and waiting for it to load, before proceeding
var quranmodel = await model1
var usemodel = await model2

// Quran text to detect chapter and verse No, you can specify any verse text here to test this code
// This is chapter 31 ,verse 14
var text1 = "And We have enjoined upon man [care] for his parents. His mother carried him, [increasing her] in weakness upon weakness, and his weaning is in two years. Be grateful to Me and to your parents; to Me is the [final] destination."
// This is chapter 112 ,verse 1
var text2 = "Say, He is Allah, [who is] One"
// Embedding the text into numbers, so that model can understand
var embed = await usemodel.embed([text1,text2])
// predicting
var predictions = quranmodel.predict(embed).softmax()
// Array contaning the line number of the verse
var arr = predictions.argMax(1).arraySync()
// Printing the line number specific to the verse in the console
console.log("Line Number of verse in quran of text1 and text2: ",arr)
// Printing the probability of prediction
console.log("Probability of prediction of text1 and text2: ",predictions.max(1).arraySync())

// Creating line to [chapter,verseNo] mappings

// Array containing number of verses in chapters
var chaplength = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]

var mappings = []

for(i=1;i<=114;i++)
{

for(j=1;j<=chaplength[i-1];j++){
  mappings.push([i,j])
}

}

// Printing Chapter and verse Number of the text

console.log("chapter and verse No of text1 and text2:", mappings[arr[0]],mappings[arr[1]])

}

// Calling run function
run()
```
```html
</script>
```

**Output in console:**

    Please wait the model is loading
	
    Line Number of verse in quran of text1 and text2: [3482, 6221]
	
    Probability of prediction of text1 and text2: [0.9999980926513672, 0.9985342025756836]
	
    chapter and verse No of text1 and text2: [31, 14] [112, 1]



