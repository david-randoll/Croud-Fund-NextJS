import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const contractAddress = "0x8aBE3260E105D7e3b57fBd1DF3077560Daf564f3";

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), contractAddress);

export default instance;
