import express from 'express';
import https from 'https';
import { connect } from '@aragon/connect';
import { default as connectVoting } from '@aragon/connect-voting';
import  { Cast, Vote, Voting } from '@aragon/connect-voting';
const app = express();


async function retrieveAnimeImageUrl(query, response) {
  var pathVar = '/v3/search/anime?q=' + query;
  var optionsget = {
    host : 'api.jikan.moe',
    port : 443,
    path : pathVar, // the rest of the url with parameters if needed
    json : true,
    method : 'GET' // do GET
  };

  let data = '';
  https.request(optionsget, async res => {
    try {
        res.setEncoding('utf-8');
        for await (const chunk of res) {
            data += chunk;
        }      
        if(res.statusCode === 200) {
          response.send(JSON.parse(data)['results'][0]['image_url']);
        }
    } catch (e) {
        console.log('ERROR', e);
    }
  }).end();

  return 
  
}

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("App listening at https://%s:%s", host, port)
})

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/index.html')
})


app.get('/animeimage', async function (req, res) {
  if(req.query.animename.length !== 0) {
    retrieveAnimeImageUrl(req.query.animename, res);
  } else {
    res.send('');
  }
})

app.get('/proposals', async function (req, res) {
  const org = await connect('anirecdao.aragonid.eth', 'thegraph', { network: 4 });

  // Connect the Voting app using the corresponding connector:
  const voting = connectVoting(org.app('voting'));

  // Fetch votes of the Voting app
  const votes = await voting.votes();
  console.log(votes);
})


