from absl import logging

import tensorflow.compat.v1 as tf1
tf1.disable_v2_behavior()

import tensorflow_hub as hub
import sentencepiece as spm

import numpy as np
import os
import pandas as pd
import tensorflow as tf
import glob
import os
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


module = hub.Module("C:\\Users\\Nawaz\\Desktop\\qadev\\js\\universal-sentence-encoder-lite-1")


input_placeholder = tf1.sparse_placeholder(tf1.int64, shape=[None, None])
encodings = module(
    inputs=dict(
        values=input_placeholder.values,
        indices=input_placeholder.indices,
        dense_shape=input_placeholder.dense_shape))


with tf1.Session() as sess:
  spm_path = sess.run(module(signature="spm_path"))

sp = spm.SentencePieceProcessor()
sp.Load(spm_path)
#print("SentencePiece model loaded at {}.".format(spm_path))
# Reduce logging output.
logging.set_verbosity(logging.ERROR)
fullArr = np.empty([0, 512])
inc = 3000
for x in range(0,len(allTransData)+inc,inc):


    messages = np.asarray(allTransData[0+x:inc+x])

    if messages.size > 0:

        values, indices, dense_shape = process_to_IDs_in_sparse_format(sp, messages)


        with tf1.Session() as session:
            session.run([tf1.global_variables_initializer(), tf1.tables_initializer()])
            message_embeddings = session.run(
            encodings,
            feed_dict={input_placeholder.values: values,
                input_placeholder.indices: indices,
                input_placeholder.dense_shape: dense_shape})

        fullArr = np.concatenate((fullArr,message_embeddings ))

print(fullArr.shape)
# np.save('C:\\Users\\Nawaz\\Desktop\\qadev\\js\\npfullArr\\fullArr.npy', fullArr)
#print(np.array(message_embeddings).tolist())
#print(np.round(message_embeddings,7))
#  for i, message_embedding in enumerate(np.array(message_embeddings).tolist()):
#    print("Message: {}".format(messages[i]))
#    print("Embedding size: {}".format(len(message_embedding)))
#    message_embedding_snippet = ", ".join(
#        (str(x) for x in message_embedding[:3]))
#    print("Embedding: [{}, ...]\n".format(message_embedding_snippet))
