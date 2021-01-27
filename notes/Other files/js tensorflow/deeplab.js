tf = require('@tensorflow/tfjs');
const deeplab = require('@tensorflow-models/deeplab');
require('@tensorflow/tfjs-node');
const loadModel = async () => {
  const modelName = 'pascal';   // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
  const quantizationBytes = 2;  // either 1, 2 or 4
  return await deeplab.load({base: modelName, quantizationBytes});
};

const input = tf.zeros([227, 500, 3]);
// ...

loadModel()
    .then((model) => model.segment(input))
    .then(
        ({legend}) =>
            console.log(`The predicted classes are ${JSON.stringify(legend)}`));
