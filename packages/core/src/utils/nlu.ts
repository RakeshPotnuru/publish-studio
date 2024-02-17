import { IamAuthenticator } from "ibm-watson/auth";
import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1";

const nlu = new NaturalLanguageUnderstandingV1({
  version: "2022-04-07",
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSON_API_KEY,
  }),
  serviceUrl: process.env.IBM_WATSON_SERVICE_URL,
});

export default nlu;
