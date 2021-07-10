const { SolidNodeClient } = require("solid-node-client");
const client = new SolidNodeClient();
const $rdf = require("rdflib");
const store = $rdf.graph();
const fetcher = $rdf.fetcher(store, {
  fetch: client.fetch.bind(client),
});
const VCARD = $rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const foaf = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const pim = $rdf.Namespace("http://www.w3.org/ns/pim/space#");
const path = require("path");
// const uuid = require('uuid');
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const prettyStringify = require("json-stringify-pretty-compact");
const router = express.Router();
const indy = require("../../indy/index");
const config = require("../../config");
const messageParsers = require("../messageParsers");
const auth = require("../authentication");

const messageTypes = {
  connections: indy.connections.MESSAGE_TYPES,
  credentials: indy.credentials.MESSAGE_TYPES,
  proofs: indy.proofs.MESSAGE_TYPES,
};

const THEME = process.env["THEME"] || "black";
const YOUR_IDENTITY_PROVIDER = "https://solidcommunity.net";
/* GET home page. */
router.get("/", auth.isLoggedIn, async function (req, res) {
  // res.sendFile(path.join(__dirname + '/../views/index.html'));
  let rawMessages = indy.store.messages.getAll();
  let messages = [];
  for (let message of rawMessages) {
    if (messageParsers[message.message.type]) {
      messages.push(await messageParsers[message.message.type](message));
    } else {
      messages.push(message);
    }
  }

  let proofRequests = await indy.proofs.getProofRequests(true);
  for (let prKey of Object.keys(proofRequests)) {
    proofRequests[prKey].string = prettyStringify(proofRequests[prKey]);
  }

  let credentials = await indy.credentials.getAll();
  let relationships = await indy.pairwise.getAll();

  // console.log("credentails: ",credentials);
  // console.log("relationships: ",relationships);
  // console.log("proofRequests: ", proofRequests);
  // console.log("messages: ", messages);
  // console.log("messageTypes:", messageTypes);
  // console.log("schemas,", await indy.issuer.getSchemas());

  res.render("index", {
    messages: messages,
    messageTypes: messageTypes,
    relationships: relationships,
    credentials: credentials,
    schemas: await indy.issuer.getSchemas(),
    credentialDefinitions: await indy.did.getEndpointDidAttribute(
      "credential_definitions"
    ),
    endpointDid: await indy.did.getEndpointDid(),
    proofRequests: proofRequests,
    name: req.session.username,
    srcId: req.session.img,
    theme: THEME,
  });

  for (let prKey of Object.keys(proofRequests)) {
    delete proofRequests[prKey].string;
  }
});

router.get("/login", function (req, res) {
  res.render("login", {
    name: config.userInformation.name,
  });
});

router.post("/login", async function (req, res) {
  if (
    req.body.username === config.userInformation.username &&
    req.body.password === config.userInformation.password
  ) {
    let token = uuidv4();
    req.session.token = token;
    req.session.save((err) => {
      auth.validTokens.push(token);
      res.redirect("/");
    });
  } else {
    res.redirect("/login?msg=Authentication Failed. Please try again.");
  }
});

router.get("/getloginSSI", function (req, res) {
  res.render("loginSSI", {
    name: config.userInformation.name,
  });
});

router.post("/loginSSI", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const idp = req.body.idp;

  console.log("done");
  try {
    // let ses = await client.login({
    //   idp: YOUR_IDENTITY_PROVIDER,
    //   username: "alice",
    //   password: "logoutyeaR6*",
    // })

    let ses = await client.login({
      idp: YOUR_IDENTITY_PROVIDER, // e.g. https://solidcommunity.net
      username: username, // rahim123 Alice1 alice faber1 acme1
      password: password, // logoutyeaR6* logoutyeaR6@ logoutyeaR6* logoutyeaR6@ logoutyeaR6@
    });
    if (!ses) {
      res.redirect("/login?msg=Authentication Failed. Please try again.");
    }
    console.log("webID: ", ses.webId, " type: ", typeof ses.webId);
    const webid = ses.webId;
    const me = $rdf.sym(webid);
    console.log("me: ", me);
    const profile = $rdf.sym(webid).doc();
    let updatedUserId = "";
    let count = 0;
    // truncating webId to get access user url
    for (let i = 0; i < profile.value.length; i++) {
      if (count == 3) {
        break;
      } else if (profile.value[i] == "/") {
        updatedUserId += profile.value[i];
        count++;
      } else {
        updatedUserId += profile.value[i];
      }
    }
    console.log(updatedUserId);
    console.log("profile: ", profile);
    // ======================= retrieve email from webID =====================================
    await fetcher.load(profile);
    let myPrefs = store.any(me, pim("preferencesFile"));
    await fetcher.load(myPrefs);
    let mbox = store.any(me, foaf("mbox"));
    console.log("mbox: ", mbox.value);
    // ====================== retrieve email from webID ======================================

    console.log("mail working");

    // ===================== retrieve name from webId ========================================
    let name = store.any(me, VCARD("fn")) || store.any(me, foaf("name"));
    // console.log("user: ", name);
    console.log("user name: ", name.value);
    // ===================== retrieve name from webId ========================================
    console.log("username working");

    // ===================== retrieve image from webId ========================================
    let hasPhoto =
      store.any(me, VCARD("hasPhoto")) || store.any(me, foaf("name"));
    // console.log("user: ", name);
    console.log("user name: ", hasPhoto.value);
    // ===================== retrieve image from webId ========================================

    console.log("image working~!");

    // ===================== retrieve organization from webId ================================
    let orgName =
      store.any(me, VCARD("organization-name")) || store.any(me, foaf("name"));
    // console.log("org: ", orgName);
    console.log("org name: ", orgName.value);
    // ===================== retrieve organization from webId ================================
    console.log("org working!!");

    // ===================== retrieve Role from webId ========================================
    let role = store.any(me, VCARD("role")) || store.any(me, foaf("name"));
    // console.log("role: ", role);
    console.log("role name: ", role.value);
    // ===================== retrieve Role from webId ========================================
    console.log("role working!");

    // ===================== retrieve phone from webId ========================================
    let phone =
      store.any(me, VCARD("hasTelephone")) || store.any(me, foaf("name"));
    // console.log("role: ", role);
    console.log("telephone : ", phone.value);
    // ===================== retrieve Role from webId ========================================
    console.log("mobile working!");

    // ===================== retrieve email from webId ========================================
    let email = store.any(me, VCARD("hasEmail")) || store.any(me, foaf("name"));
    // console.log("role: ", role);
    console.log("email : ", email.value);
    // ===================== retrieve Role from webId ===========================================
    console.log("email working!");

    let token = uuidv4();
    req.session.token = token;
    req.session.ses = ses;
    req.session.us = "Alice1";
    req.session.pass = "logoutyeaR6@";
    req.session.YOUR_IDENTITY_PROVIDER = YOUR_IDENTITY_PROVIDER;
    req.session.username = name.value;
    req.session.webid = updatedUserId;
    req.session.img = hasPhoto.value;
    req.session.save((err) => {
      auth.validTokens.push(token);
      res.redirect("/");
    });
    // return res.redirect(YOUR_IDENTITY_PROVIDER);
    // return res.send("hi");
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/logout", async function (req, res, next) {
  for (let i = 0; i < auth.validTokens.length; i++) {
    if (auth.validTokens[i] === req.session.token) {
      auth.validTokens.splice(i, 1);
    }
  }
  await client.logout();
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    } else {
      
      auth.session = null;
      res.redirect("/login");
    }
  });
});

module.exports = router;
