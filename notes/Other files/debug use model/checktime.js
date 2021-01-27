console.time('test');
tf = require('@tensorflow/tfjs');
use = require('@tensorflow-models/universal-sentence-encoder');
require('@tensorflow/tfjs-node');

use.load().then(model => {
  // Embed an array of sentences.
  const sentences = [
    'Hello.',
    'How are you?'
  ];
  model.embed(sentences).then(embeddings => {
    // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    // So in this example `embeddings` has the shape [2, 512].
    embeddings.print(true /* verbose */);
    console.log('Time Taken:')
    console.timeEnd('test');
  });
});
