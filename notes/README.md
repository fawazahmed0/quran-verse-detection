The notes in this folder is only meant for me, to remember how model was trained and other details etc, you can see this, if you like to.

I referred tensorflow gettings started tutorials on how to train etc
https://www.tensorflow.org/learn
https://www.tensorflow.org/tutorials
https://www.tensorflow.org/js/tutorials

At beginning I tried to train the model at python side(mlcleanNormal.py) and then convert to JS using https://github.com/tensorflow/tfjs/tree/master/tfjs-converter , but it did not work, as the converter didn't support few operations which were performed by my model , the embedding operations were performed by https://tfhub.dev/google/tf2-preview/nnlm-en-dim128/1, and it was the source of problem.
Also raised the issue here: https://github.com/tensorflow/tfjs/issues/3381

I then thought of making the model javascript side, but the browser development environment was very slow, later I ended up developing on node.js.
It also had some problem like: https://github.com/tensorflow/tfjs/issues/3471
i.e it slows down after embedding large datasets, it can be fixed by:

npm cache clean --force
Might also want to try, if above didn't solve the problem:
yarn autoclean --init
yarn autoclean --force
yarn cache clean

https://classic.yarnpkg.com/en/docs/cli/autoclean/
https://docs.npmjs.com/cli-commands/cache.html

This is how this model was made:
First embedding using the universal sentense encoder model were saved for the translation text (saveembeddings.js)(In ml we have to embed the data from text to numbers, so that it can understand)
In next step these embeddings were used to train the model at python side (mlcleanjs.py)(training at node js side had very low accuray around 85% (trainmodel.js), but at python side, I got 98% accuray, probably because python api had loss function calculation using logits supported for sparsecategoricalcrossentropy)
Also keras tuner was used to get the hyperparameters for my model (I got 320 nodes in middle layer)(hyperparameters.py)

The model was converted using https://github.com/tensorflow/tfjs/tree/master/tfjs-converter tensorflowjs_wizard (with 2-bytes quantization to reduce model size)

If node js throws Out of memory error, I can use:
node --max-old-space-size=8192 yourFile.js
or set env var for one session
set NODE_OPTIONS="--max-old-space-size=8192"
https://stackoverflow.com/questions/38558989/node-js-heap-out-of-memory