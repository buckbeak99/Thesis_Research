const {
    SolidNodeClient
} = require("solid-node-client");
const client = new SolidNodeClient();
const express = require('express');
const router = express.Router();
const indy = require('../../indy/index');
const auth = require('../authentication');

router.get('/', function (req, res, next) {
    res.send("Success");
});

router.post('/send_message', auth.isLoggedIn, async function (req, res) {
    let message = JSON.parse(req.body.message);
    message.did = req.body.did;

    const sentMsg = await indy.crypto.sendAnonCryptedMessage(req.body.did, message);
    console.log("sent message: ", sentMsg);
    res.redirect('/#messages');
});

router.post('/send_connection_request', auth.isLoggedIn, async function (req, res) {
    let theirEndpointDid = req.body.did;
    let connectionRequest = await indy.connections.prepareRequest(theirEndpointDid);

    const sentConnReq = await indy.crypto.sendAnonCryptedMessage(theirEndpointDid, connectionRequest);
    console.log("Sent Connection request: ",sentConnReq);
    res.redirect('/#relationships');
});

router.post('/issuer/create_schema', auth.isLoggedIn, async function (req, res) {
    const createdSchema = await indy.issuer.createSchema(req.body.name_of_schema, req.body.version, req.body.attributes);
    console.log("Created Schema: ", createdSchema)
    res.redirect('/#issuing');
});

router.post('/issuer/create_cred_def', auth.isLoggedIn, async function (req, res) {
    const cred_def = await indy.issuer.createCredDef(req.body.schema_id, req.body.tag);
    console.log("cred_def: ", cred_def);
    res.redirect('/#issuing');
});

router.post('/issuer/send_credential_offer', auth.isLoggedIn, async function (req, res) {
    const sentCredDef = await indy.credentials.sendOffer(req.body.their_relationship_did, req.body.cred_def_id);
    console.log("sentCred Def: ", sentCredDef);
    res.redirect('/#issuing');
});

router.post('/credentials/accept_offer', auth.isLoggedIn, async function (req, res) {
    let message = indy.store.messages.getMessage(req.body.messageId);
    indy.store.messages.deleteMessage(req.body.messageId);
    await indy.credentials.sendRequest(message.message.origin, message.message.message);
    let credentials = await indy.credentials.getAll();
    console.log("crden array: ", credentials);
    let credenJson = JSON.stringify(credentials); // coverts array into json
    console.log("done credentials: ", typeof(credentials) );
    console.log("done credentials json: ", credenJson);
    console.log("done credentials json: ", typeof(credenJson));
    let ses = await client.login({
        idp:  "https://solidcommunity.net", // e.g. https://solidcommunity.net
        username: "Alice1",       // rahim123 Alice1
        password: "logoutyeaR6@",  // logoutyeaR6* logoutyeaR6@
      });
    let updatedUserId = "";
    let count = 0;
    // truncating webId to get access user url
    for(let i=0;i< ses.webId.length;i++)
    {
      if(count == 3)
      {
        break;
      }
      else if(ses.webId[i] == "/")
      {
        updatedUserId += ses.webId[i];
        count++;
      }
      else{
        updatedUserId += ses.webId[i];
      }

    }
    console.log(updatedUserId);
    console.log("ses webid: ", req.session.webid);
    let writeResponse = await client.fetch(`${updatedUserId}private/credentials.txt`, {
        method: "PUT",
        body: credenJson,
        headers: {
            "Content-type": 'text/plain'
        }
    });
    console.log("status: ",writeResponse.status);
    res.redirect('/#messages');
});

router.post('/credentials/reject_offer', auth.isLoggedIn, async function (req, res) {
    indy.store.messages.deleteMessage(req.body.messageId);
    res.redirect('/');
});

router.put('/connections/request', auth.isLoggedIn, async function (req, res) {
    let name = req.body.name;
    let messageId = req.body.messageId;
    let message = indy.store.messages.getMessage(messageId);
    indy.store.messages.deleteMessage(messageId);
    await indy.connections.acceptRequest(name, message.message.message.endpointDid, message.message.message.did, message.message.message.nonce);
    res.redirect('/#relationships');
});

router.delete('/connections/request', auth.isLoggedIn, async function (req, res) {
    // FIXME: Are we actually passing in the messageId yet?
    if (req.body.messageId) {
        indy.store.messages.deleteMessage(req.body.messageId);
    }
    res.redirect('/#relationships');
});

router.post('/messages/delete', auth.isLoggedIn, function (req, res) {
    indy.store.messages.deleteMessage(req.body.messageId);
    res.redirect('/#messages');
});

router.post('/proofs/accept', auth.isLoggedIn, async function (req, res) {
    await indy.proofs.acceptRequest(req.body.messageId);
    res.redirect('/#messages');
});

router.post('/proofs/send_request', auth.isLoggedIn, async function (req, res) {
    let myDid = await indy.pairwise.getMyDid(req.body.their_relationship_did);
    await indy.proofs.sendRequest(myDid, req.body.their_relationship_did, req.body.proof_request_id, req.body.manual_entry);
    res.redirect('/#proofs');
});

router.post('/proofs/validate', auth.isLoggedIn, async function (req, res) {
    try {
        let proof = req.body;
        if (await indy.proofs.validate(proof)) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;