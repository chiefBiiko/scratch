// cli script to train a stoopid naive bayes natural language classifier

const fs = require('fs')
const natural = require('natural')

const EXAMPLE_DATA = [  // [[[x0...xn], y], ...]
  [['hi', 'hello', 'hallo'], 'hi buddy'],
  [['what is your name', 'your name', 'ur name'], 'chiefbot'],
  [['how are you', 'how is it going', 'how are things?'], 'fine, thanks'],
  [['how can you help me', 'help me', 'i need help'], 'let me guide you'],
  [['your products', 'product overview', 'services'], 'go to /products'],
  [['thank you', 'thanks', 'thanks a lot'], 'you are welcome'],
  [['goodbye', 'bye', 'byebye', 'see you', 'see ya', 'later'], 'byebye'],
  [['ping'], 'pong'],
  [['yin', 'ying'], 'yang']
]
const TRAINING_DATA = process.argv[3] ?
  JSON.parse(readFileSync(process.argv[3], 'utf8')) : EXAMPLE_DATA
const fpath = process.argv[4] || 'classifier.json'

// constructor takes stemmer -> default: english porter stemmer
const classifier = new natural.BayesClassifier();
// feeding a classifier
TRAINING_DATA.forEach(doc => classifier.addDocument(doc[0], doc[1]))

// persist the classifier to a json file once done
classifier.events.on('trainedWithDocument', obj => {
  if (obj.index + 1 === obj.total) {  // classifier been trained
    classifier.save(fpath, (err, classifier) => {
      if (err) return console.error(err)
      console.log('trained naive bayes classifier saved to "classifier.json"')
    })
  }
})

classifier.train()
