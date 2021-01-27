import json
#from urllib.request import urlopen
import pandas as pd
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import glob
import os
from tensorflow import keras
import tensorflow_datasets as tfds
#os.environ["KERAS_BACKEND"] = "plaidml.keras.backend"






#import keras
#import os

# Disabling eager execution
#tf.compat.v1.disable_eager_execution()

# http://tanzil.net/trans/
translationDir = "C:/Users/Nawaz/Downloads/qdata/"

transData = []
allTransData = []
simpleTarget = []
allTransTarget = []






# https://stackoverflow.com/questions/15233340/getting-rid-of-n-when-using-readlines
# https://stackoverflow.com/questions/3207219/how-do-i-list-all-files-of-a-directory
# Reading all the translations in translationDir
for i in glob.glob(translationDir+"*.txt"):
    with open(i,'r', encoding='cp1252') as f:
           transData.append(f.read().splitlines())

# Adding all translations to allTrans
for i in transData:
    count = 0
    for j in i:
        allTransData.append(j)
        allTransTarget.append(count)
        count+=1

noOfVerse = len(transData[0])
# https://stackoverflow.com/questions/18265935/python-create-list-with-numbers-between-2-values
simpleTarget = list(range(0, noOfVerse))








t = tf.keras.preprocessing.text.Tokenizer()
t.fit_on_texts(allTransData)

vocab_set = set(t.word_index.keys())
vocab_size = len(vocab_set) + 1
encoder = tfds.features.text.TokenTextEncoder(vocab_set)
allEncodedData = []
for i in allTransData:
    allEncodedData.append(encoder.encode(i))

#print(encoder.encode(allTransData[0]))
#print(len(vocab_set))
#import numpy as np

#a = [1,2,3]
#b = np.asarray(a)
#print(b.shape)


#print("this is encoded_docs")
#print(np.asarray(encoded_docs).shape)

#padded_docs = tf.keras.preprocessing.sequence.pad_sequences(encoded_docs, padding='post')

#print("this is padded_codes ", np.asarray(padded_docs).shape)

# Glove code
# change to right directory
# https://blog.keras.io/using-pre-trained-word-embeddings-in-a-keras-model.html
embeddings_index = {}
f = open(os.path.join("C:/Users/Nawaz/Desktop/qadev/js/glove", 'glove.6B.100d.txt'))
for line in f:
    values = line.split()
    word = values[0]
    coefs = np.asarray(values[1:], dtype='float32')
    embeddings_index[word] = coefs
f.close()

print('Found %s word vectors.' % len(embeddings_index))

# create a weight matrix for words in training docs
embedding_matrix = np.zeros((vocab_size, 100))
for word, i in t.word_index.items():
	embedding_vector = embeddings_index.get(word)
	if embedding_vector is not None:
		embedding_matrix[i] = embedding_vector
# https://www.tensorflow.org/guide/keras/masking_and_padding




# input_length=len(padded_docs[0])











#embedding = hub.load("C:/Users/Nawaz/Desktop/qadev/js/universal-sentence-encoder")

#testmodel = keras.models.load_model('C:/Users/Nawaz/Desktop/qadev/js/universal-sentence-encoder')
#testmodel.save("C:/Users/Nawaz/Desktop/qadev/js/test", save_format='h5')

# trainable means the weights in this layer will get updated during training
#hub_layer = hub.KerasLayer(embedding, input_shape=[],
#                           dtype=tf.string, trainable=True)

# https://stackoverflow.com/questions/51421885/expected-dense-to-have-shape-but-got-array-with-shape
# https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.LabelBinarizer.html
#from sklearn.preprocessing import LabelBinarizer
#lb = LabelBinarizer()
#y_data = lb.fit_transform(allTransTarget)

y_data = keras.utils.to_categorical(allTransTarget, num_classes=noOfVerse)









# https://stackoverflow.com/questions/51125266/how-do-i-split-tensorflow-datasets
DATASET_SIZE = len(allTransData)
train_size = int(0.7 * DATASET_SIZE)
val_size = int(0.15 * DATASET_SIZE)
test_size = int(0.15 * DATASET_SIZE)

full_dataset = tf.data.Dataset.from_tensor_slices((allEncodedData, allTransTarget))




# shuffling the data, it increases accuracy
full_dataset = full_dataset.shuffle(len(allTransData))
train_dataset = full_dataset.take(train_size)
test_dataset = full_dataset.skip(train_size)
validation_dataset = test_dataset.skip(test_size)
test_dataset = test_dataset.take(test_size)

#Removing last four translations from allTransData to get traindata
#trainData = allTransData[:len(allTransData)-(4*len(transData[0]))]
#trainTarget = allTransTarget[:len(allTransTarget)-(4*len(transData[0]))]

#Using last two translations from allTransData as testData
#testData = allTransData[len(allTransData)-(2*len(transData[0])):]
#testTarget = allTransTarget[len(allTransTarget)-(2*len(transData[0])):]

#Using previous last two translations from allTransData as validationData
#validationData = allTransData[len(allTransData)-(4*len(transData[0])):len(allTransData)-(2*len(transData[0]))]
#validationTarget = allTransTarget[len(allTransTarget)-(4*len(transData[0])):len(allTransTarget)-(2*len(transData[0]))]

#train_dataset = tf.data.Dataset.from_tensor_slices((trainData, trainTarget))
#test_dataset = tf.data.Dataset.from_tensor_slices((testData, testTarget))
#validation_dataset = tf.data.Dataset.from_tensor_slices((validationData, validationTarget))
#print(dataset)
#train_dataset = train_dataset.shuffle(len(target)).batch(1)
# we are not shuffling data, but we will try shuffling the whole data
# keeping batch size low will increase the accuracy, and keeping it high will decrease the accuracy
# batch size low will take hours to train and large batch size will take minutes to train
batch_size = 5000
train_dataset = train_dataset.padded_batch(batch_size)
test_dataset = test_dataset.padded_batch(batch_size)
validation_dataset = validation_dataset.padded_batch(batch_size)




vocab_size += 1






















#embedding = hub.load("C:/Users/Nawaz/Desktop/qadev/js/universal-sentence-encoder")

#testmodel = keras.models.load_model('C:/Users/Nawaz/Desktop/qadev/js/universal-sentence-encoder')
#testmodel.save("C:/Users/Nawaz/Desktop/qadev/js/test", save_format='h5')

# trainable means the weights in this layer will get updated during training
#embedding = hub.load("C:/Users/Nawaz/Desktop/qadev/js/gnews")

# print(embedding(["cat is on the mat", "dog is in the fog"]))

#hub_layer = hub.KerasLayer(embedding, input_shape=[], output_shape=[50], dtype=tf.string, trainable=True)
#embeddinglayer = tf.keras.layers.Embedding(vocab_size, 100, weights=[embedding_matrix], input_length=len(padded_docs[0]), mask_zero=True, trainable=True)
embeddinglayer = tf.keras.layers.Embedding(vocab_size, 100, weights=[embedding_matrix], mask_zero=True, trainable=True)
model = tf.keras.Sequential()
model.add(embeddinglayer)
#model.add(tf.keras.layers.GlobalAveragePooling1D())
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(320, activation='relu'))
model.add(tf.keras.layers.Dense(6236))
# New add softmax layer as output while training, it will effect in loss calculation, model might not train well
# model.add(tf.keras.layers.Dense(6236, activation='softmax'))


model.summary()
# https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/keras/regression.ipynb#scrollTo=LcopvQh3X-kX
# https://keras.io/api/callbacks/
# we will stop ,if the loss does not change after n epochs , patience stores the n variable
# don't remove this assuming tuner will take care of epochs, we have to stop by using earlystopping to avoid unecessary epochs
early_stop = [ tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5) ]
# if target or label is integer values i.e 1,2,3 use SparseCategoricalCrossentropy, else if they are one hot encoded [1,0,0][0,1,0][0,0,1] use categorical_crossentropy
# https://jovianlin.io/cat-crossentropy-vs-sparse-cat-crossentropy/
model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
#padded_target = keras.preprocessing.sequence.pad_sequences(allTransTarget, padding='post')

#model.fit(padded_docs,np.asarray(allTransTarget), epochs=5, verbose=2, callbacks=early_stop)
model.fit(train_dataset, epochs=1, validation_data=validation_dataset, verbose=1, callbacks=early_stop)
#model.fit(allTransData, allTransTarget, epochs=5, verbose=1, callbacks=early_stop)

model.evaluate(test_dataset, verbose=2)

model.save('C:\\Users\\Nawaz\\Desktop\\qadev\\js\\models\\simple')
