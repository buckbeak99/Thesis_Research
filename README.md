# Self Sovereign Identity Management System

This folder contains a demonstration of basic Self Sovereign Identity Management System project. The agents provide a web browser interface to show establishing relationships between agents, issuing verifiable credentials, and proving claims from verifiable credentials.

## Motivation
In this thesis, we examine various types of identity management systems in order to strengthen the security of online platforms that users and organizations frequently use to exchange secrets and valuable digital credentials. We propose an identity system that makes use of secure tools for exchanging credentials in situations where the user lacks trust in one or more organizations. We developed the SSI system in collaboration with ***Hyperledger Indy***, ***Solid***, and ***Blockchain*** during this research.

### Used Tools and version
![Nodejs](https://img.shields.io/badge/Nodejs-14.x-red)
![Docker](https://img.shields.io/badge/Docker-latest-brightgreen)
![VisualStudioCode](https://img.shields.io/badge/VSCode-latest-orange)

### Installation and Demonstration
1. Go to [Solid Community](https://solidcommunity.net/) to create a solid ID.
2. Clone this project in your device.
```bash
   git clone https://github.com/buckbeak99/Thesis_Research.git
   cd Thesis_Research
```
3. Go to your editor and open editor terminal. Then run command:
``` bash
    ./startIndy.sh
```
4. Go to your brower and start the web server
- `localhost:3000` - Alice
- `localhost:3001` - Bob
- `localhost:3002` - Faber College
- `localhost:3003` - Acme Corporation
- `localhost:3004` - Thrift Bank
- `localhost:9000` - BCSovrin Indy Node Pool
5. Use your solid community username and password for SSI login ( right now it's only applicable for alice or bob)

### Screenshots
![AcceptPR](https://user-images.githubusercontent.com/43216053/154916644-387b368c-e988-4cd3-b489-b894af3f612b.png)
![AgentDID](https://user-images.githubusercontent.com/43216053/154916743-dde1be05-e4b0-40c5-ac5d-5f7fc77e42d7.png)
![AgentScreen](https://user-images.githubusercontent.com/43216053/154916762-06d4f5e9-cc4a-4ef3-88f3-2c57edda006d.png)
![AliceTranscriptCred](https://user-images.githubusercontent.com/43216053/154916791-bf670668-ba11-452e-b30b-87666f90997b.png)
![BrowserTabs](https://user-images.githubusercontent.com/43216053/154916837-f2496ef0-257e-4774-8d73-410f8727d152.png)
![CreateCredDef](https://user-images.githubusercontent.com/43216053/154916866-d5945234-1064-488e-b75a-40315242748d.png)
![CreateRelBlank](https://user-images.githubusercontent.com/43216053/154916895-9859f2e5-c087-4fe3-80e3-083622477788.png)
![CreateRelFill](https://user-images.githubusercontent.com/43216053/154916916-8015a8a6-f625-48d6-899d-b10f74b1c5e8.png)
![CreateRelFill2](https://user-images.githubusercontent.com/43216053/154916937-cbb24363-f3f0-4c41-aa6f-db3e66de4797.png)
![CreateSchema](https://user-images.githubusercontent.com/43216053/154917029-85994f75-eea9-47d3-88c9-2974be51b13f.png)
![CredOffer](https://user-images.githubusercontent.com/43216053/154917043-d6c33e08-3331-4210-8d74-4cf9a7c615f4.png)
![CredOfferTran](https://user-images.githubusercontent.com/43216053/154917064-e742b793-9b55-49db-bb18-acdcc259a275.png)
![Creds](https://user-images.githubusercontent.com/43216053/154917080-93b8aa45-7efa-4ce5-b5f1-e640bba327f1.png)
![DelAgentDIDRels](https://user-images.githubusercontent.com/43216053/154917090-13df26d7-d169-436c-9670-17acacfa10bf.png)
![DID](https://user-images.githubusercontent.com/43216053/154917108-ded1d44c-edf6-48c9-b12e-06cb22f3620e.png)
![FaberRelAlice](https://user-images.githubusercontent.com/43216053/154917119-714cd748-f345-4b69-8c95-7dcffd0f1c28.png)
![FIXAcceptNamePR](https://user-images.githubusercontent.com/43216053/154917130-0f689240-e8bd-4868-afac-b1dfbc075639.png)
![NamePR](https://user-images.githubusercontent.com/43216053/154917140-2fd49290-8f0d-4e3a-b82a-3b774f476f59.png)
![NamePRNotes](https://user-images.githubusercontent.com/43216053/154917152-04bc4bbd-12d6-46bf-ae17-70967224cc47.png)
![PastePR](https://user-images.githubusercontent.com/43216053/154917166-a1240141-d1b2-46cb-a60c-75052b2ac790.png)
![ProofReqOther](https://user-images.githubusercontent.com/43216053/154917183-14a8faa3-5f62-4068-aad3-c04d49c829e2.png)
![ProofRequest](https://user-images.githubusercontent.com/43216053/154917194-7f8ad3b0-b251-4692-840f-99de91a35cee.png)
![RelationshipWindow](https://user-images.githubusercontent.com/43216053/154917202-308f149f-0cee-4017-8550-b32ef93046c9.png)
![RelDIDs](https://user-images.githubusercontent.com/43216053/154917210-2bf60576-f34c-4d70-b37e-c350dc3ac3a8.png)
![TranscriptProof](https://user-images.githubusercontent.com/43216053/154917222-3a4b2b5a-2d89-4f2f-8000-76e380d5709a.png)
