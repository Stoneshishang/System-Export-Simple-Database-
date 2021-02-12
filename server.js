const express = require('express');
const fs = require('fs');
const database = require('./database');

const DATA_DIR = 'aedb_data';

const app = express();
const cache = {};
app.use(express.json());

const hashtable = {};

//mimic a memory & database from System Expert. 
app.post('/memory/:key', (req, res) =>{
  hashtable[req.params.key] = req.body.data;
  res.send();
});

app.get('/memory/:key', (req, res) =>{
  const key = req.params.key;
  if(key in hashtable){
    res.send(hashtable[key]);
    return;
  }
  res.send('null');
});

app.post('/disk/:key', (req, res) =>{
  const destinationFile = `${DATA_DIR}/${req.params.key}`;
  fs.writeFileSync(destinationFile, req.body.data);
  res.send();
})

app.get('/disk/:key', (req, res) =>{
  const destinationFile = `${DATA_DIR}/${req.params.key}`;
  try {
    const data = fs.readFileSync(destinationFile);
    res.send(data);
  } catch (e) {
    res.send('null');
  }
})
//mimic a memory & database from System Expert. 

//Mimic a web page caching with Node JS.
app.get('/nocache/index.html',(req,res) =>{
  database.get('index.html', page => {
    res.send(page);
  })
})

app.get('/withcache/index.html', (req, res) =>{
  if('index.html' in cache){
    res.send(cache['index.html']);
    return;
  }

  database.get('index.html', page =>{
    cache['index.html'] = page;
    res.send(page)
  })
})

app.listen(3001, () =>{
  console.log('Listening on port 3001!');
})