import sentencepiece as spm
from urllib.request import urlopen
import pandas as pd
#import tensorflow as tf
import glob


import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()

import tensorflow_hub as hub
import sentencepiece as spm
import numpy as np
import os
import pandas as pd
from tensorflow import keras

def process_to_IDs_in_sparse_format(sp, sentences):
  # An utility method that processes sentences with the sentence piece processor
  # 'sp' and returns the results in tf.SparseTensor-similar format:
  # (values, indices, dense_shape)
  ids = [sp.EncodeAsIds(x) for x in sentences]
  max_len = max(len(x) for x in ids)
  dense_shape=(len(ids), max_len)
  values=[item for sublist in ids for item in sublist]
  indices=[[row,col] for row in range(len(ids)) for col in range(len(ids[row]))]
  return (values, indices, dense_shape)


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
batch_size = 512
train_dataset = train_dataset.batch(batch_size)
test_dataset = test_dataset.batch(batch_size)
validation_dataset = validation_dataset.batch(batch_size)















module = hub.Module("C:/Users/Nawaz/Desktop/qadev/js/universal-sentence-encoder-lite-2")




with tf.Session() as sess:
  spm_path = sess.run(module(signature="spm_path"))

sp = spm.SentencePieceProcessor()
sp.Load(spm_path)
print("SentencePiece model loaded at {}.".format(spm_path))

values, indices, dense_shape = process_to_IDs_in_sparse_format(sp, allTransData)

input_placeholder = tf.sparse_placeholder(tf.int64, shape=[None, None])
encodings = module(
    inputs=dict(
        values=values,
        indices=indices,
        dense_shape=dense_shape))



model = keras.Sequential()
model.add(keras.layers.Dense(input=encodings, units=1))
model.add(keras.layers.Dense(100, activation='relu'))

model.add(keras.layers.Dense(6236))
# New add softmax layer as output while training, it will effect in loss calculation, model might not train well
# model.add(tf.keras.layers.Dense(6236, activation='softmax'))


model.summary()

model.compile(optimizer='adam',
              loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
#padded_target = keras.preprocessing.sequence.pad_sequences(allTransTarget, padding='post')

#model.fit(padded_docs,np.asarray(allTransTarget), epochs=5, verbose=2, callbacks=early_stop)
model.fit(allTransData, allTransTarget, epochs=5, verbose=1, callbacks=early_stop)