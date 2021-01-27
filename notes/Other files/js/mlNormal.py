import json
#from urllib.request import urlopen
import pandas as pd
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np




#jsonurl = urlopen('https://api.alquran.cloud/v1/quran/en.yusufali')
#data = json.loads(jsonurl.read())

#jsonurl = urlopen('https://api.alquran.cloud/v1/quran/en.sahih')
#datasahih = json.loads(jsonurl.read())

#jsonurl = urlopen('https://api.alquran.cloud/v1/quran/en.pickthall')
#datapick = json.loads(jsonurl.read())

#jsonurl = urlopen('https://api.alquran.cloud/v1/quran/en.hilali')
#datahilali = json.loads(jsonurl.read())


with open('C:/Users/Nawaz/Downloads/en.yusufali.json','r', encoding='cp1252') as f:
    data = json.load(f)


with open('C:/Users/Nawaz/Downloads/en.sahih.json','r', encoding='cp1252') as p:
    datasahih = json.load(p)

with open('C:/Users/Nawaz/Downloads/en.pickthall.json','r', encoding='cp1252') as q:
    datapick = json.load(q)


with open('C:/Users/Nawaz/Downloads/en.asad.json','r', encoding='cp1252') as r:
    datahilali = json.load(r)




#print(data)

#dict = {}
#testdict = {}
#try:
#    print(data['data']['surahs'][0]['ayahs'][5]['text'])
#except:
#    print(1)

target = []
text = []

testtext = []
testtarget = []

count = 0
for i in range(114):
    for j in range(len(data['data']['surahs'][i]['ayahs'])):
        #print(data['data']['surahs'][i]['ayahs'][j]['text'])
        #target.append(str(i+1)+" "+str(j+1))
        target.append(count)
        target.append(count)
        target.append(count)
        testtarget.append(count)
        count+=1
        text.append(data['data']['surahs'][i]['ayahs'][j]['text'])
        text.append(datasahih['data']['surahs'][i]['ayahs'][j]['text'])
        text.append(datapick['data']['surahs'][i]['ayahs'][j]['text'])
        testtext.append(datahilali['data']['surahs'][i]['ayahs'][j]['text'])

#dict['text'] = text
#dict['target'] = target

#testdict['text'] = testtext
#testdict['target'] = testtarget

#df = pd.DataFrame(dict)

#testdf  = pd.DataFrame(testdict)

#print(df)
#print(df.dtypes)
#target = df.pop('target')

#testtarget = testdf.pop('target')

#print(target.tail(5))
train_dataset = tf.data.Dataset.from_tensor_slices((text, target))

test_dataset = tf.data.Dataset.from_tensor_slices((testtext, testtarget))
#print(dataset)
train_dataset = train_dataset.shuffle(len(target)).batch(1)
test_dataset = test_dataset.batch(1)
print("before embedding")

#module = hub.Module("https://tfhub.dev/deepmind/i3d-kinetics-600/1")


#embedding = "https://tfhub.dev/google/tf2-preview/nnlm-en-dim50/1"

embedding = hub.load("C:/Users/Nawaz/Desktop/qadev/js/universal-sentence-encoder")

hub_layer = hub.KerasLayer(embedding, input_shape=[],
                           dtype=tf.string, trainable=True)

model = tf.keras.Sequential()
model.add(hub_layer)
model.add(tf.keras.layers.Dense(100, activation='relu'))
model.add(tf.keras.layers.Dense(6236))

#model.summary()

print("starting compile & fitting")


model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

model.fit(train_dataset, epochs=5, verbose=2)
model.evaluate(test_dataset, verbose=2)
