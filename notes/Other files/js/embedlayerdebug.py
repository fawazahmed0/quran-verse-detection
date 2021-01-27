#import json
from urllib.request import urlopen
import pandas as pd
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import glob
import os
from tensorflow import keras

transData = []
allTransData = []
allTransTarget = []


# https://cdn.jsdelivr.net/gh/fawazahmed0/LargeTxtFile@latest/qdata/en.sahih.txt

url = urlopen('https://cdn.jsdelivr.net/gh/fawazahmed0/LargeTxtFile@latest/qdata/en.sahih.txt')

# https://stackoverflow.com/questions/15233340/getting-rid-of-n-when-using-readlines
# https://stackoverflow.com/questions/3207219/how-do-i-list-all-files-of-a-directory
# Reading all the translations in translationDir
transData.append(url.read().splitlines())

# Adding all translations to allTrans
for i in transData:
    count = 0
    for j in i:
        #https://stackoverflow.com/questions/37016946/remove-b-character-do-in-front-of-a-string-literal-in-python-3
        allTransData.append(j.decode("utf-8"))
        allTransTarget.append(count)
        count+=1




# https://stackoverflow.com/questions/51125266/how-do-i-split-tensorflow-datasets
DATASET_SIZE = len(allTransData)
train_size = int(0.7 * DATASET_SIZE)
val_size = int(0.15 * DATASET_SIZE)
test_size = int(0.15 * DATASET_SIZE)

full_dataset = tf.data.Dataset.from_tensor_slices((allTransData, allTransTarget))
# shuffling the data, it increases accuracy
full_dataset = full_dataset.shuffle(len(allTransData))
train_dataset = full_dataset.take(train_size)
test_dataset = full_dataset.skip(train_size)
validation_dataset = test_dataset.skip(test_size)
test_dataset = test_dataset.take(test_size)

# we are not shuffling data, but we will try shuffling the whole data
# keeping batch size low will increase the accuracy, and keeping it high will decrease the accuracy
# batch size low will take hours to train and large batch size will take minutes to train
batch_size = 5000
train_dataset = train_dataset.batch(batch_size)
test_dataset = test_dataset.batch(batch_size)
validation_dataset = validation_dataset.batch(batch_size)


# trainable means the weights in this layer will get updated during training
#embedding = hub.load("C:/Users/Nawaz/Desktop/qadev/js/nlm128")
#https://tfhub.dev/google/tf2-preview/gnews-swivel-20dim/1
embedding = hub.load("https://tfhub.dev/google/tf2-preview/gnews-swivel-20dim/1")
# print(embedding(["cat is on the mat", "dog is in the fog"]))

hub_layer = hub.KerasLayer(embedding, input_shape=[],
                           dtype=tf.string, trainable=True)

model = tf.keras.Sequential()
model.add(hub_layer)
model.add(tf.keras.layers.Dense(100, activation='relu'))
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

model.fit(train_dataset, epochs=1, validation_data=validation_dataset, verbose=1, callbacks=early_stop)

model.evaluate(test_dataset, verbose=2)

model.save('models/debug')
