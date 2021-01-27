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
import tensorflowjs as tfjs




model = tf.keras.models.load_model('C:\\Users\\Nawaz\\Desktop\\qadev\\js\\models\\simple')
# Attaching softmax to get probablities which are easier to interpret
probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax(name='softmax')])

allTransData = 'God has promised O believers! Remember Allah’s favour upon you: when a people sought to harm you, but He held their hands back from you. Be mindful of Allah. And in Allah let the believers put their trust. and a great reward.'
t = tf.keras.preprocessing.text.Tokenizer()
t.fit_on_texts(allTransData)
encoded_docs = t.texts_to_sequences(allTransData)
padded_docs = keras.preprocessing.sequence.pad_sequences(encoded_docs, padding='post')

print(encoded_docs)
print(padded_docs)

#tfjs.converters.save_keras_model(probability_model, "C:\\Users\\Nawaz\\Desktop\\qadev\\js\\models\\tfjs")
#probability_model.save('C:\\Users\\Nawaz\\Desktop\\qadev\\js\\models\\probability')

predictions = probability_model.predict(padded_docs)

#predictions = probability_model.predict(['God has promised O believers! Remember Allah’s favour upon you: when a people sought to harm you, but He held their hands back from you. Be mindful of Allah. And in Allah let the believers put their trust. and a great reward.'])

print(predictions[0])
print(np.argmax(predictions[0]))
