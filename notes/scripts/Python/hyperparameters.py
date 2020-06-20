import json
#from urllib.request import urlopen
import pandas as pd
import tensorflow as tf
import tensorflow_hub as hub
from tensorflow import keras
import numpy as np
import glob
import os
import kerastuner as kt
#import IPython



# Increase epochs to more value later







def model_builder(hp):
  # trainable means the weights in this layer will get updated during training
  embedding = hub.load("C:/Users/Nawaz/Desktop/qadev/js/nlm128")

  # print(embedding(["cat is on the mat", "dog is in the fog"]))

  hub_layer = hub.KerasLayer(embedding, input_shape=[],
                             dtype=tf.string, trainable=True)

  model = tf.keras.Sequential()
  model.add(hub_layer)
  # Tune the number of units in the first Dense layer
  # Choose an optimal value between 32-512
  hp_units = hp.Int('units', min_value = 32, max_value = 512, step = 32)
  model.add(tf.keras.layers.Dense(units = hp_units, activation='relu'))
  model.add(tf.keras.layers.Dense(6236))

  # Tune the learning rate for the optimizer
  # Choose an optimal value from 0.01, 0.001, or 0.0001
  hp_learning_rate = hp.Choice('learning_rate', values = [1e-2, 1e-3, 1e-4])
  model.compile(optimizer= keras.optimizers.Adam(learning_rate = hp_learning_rate),
                loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                metrics=['accuracy'])


  return model







#import keras
#import os

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

















tuner = kt.Hyperband(model_builder,
                     objective = 'val_accuracy',
                     max_epochs = 30,
                     factor = 3,
                     directory = 'D:\\hyperlogs',
                     project_name = 'intro_to_kt')

early_stop =  tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5)


tuner.search(train_dataset, epochs = 30, validation_data=validation_dataset)

# Get the optimal hyperparameters
best_hps = tuner.get_best_hyperparameters(num_trials = 1)[0]

print(f"""
The hyperparameter search is complete. The optimal number of units in the first densely-connected
layer is {best_hps.get('units')} and the optimal learning rate for the optimizer
is {best_hps.get('learning_rate')}.
""")
