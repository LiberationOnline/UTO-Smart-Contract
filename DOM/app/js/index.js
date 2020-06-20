import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';


EmbarkJS.onReady((err) => {
  
  if (err) {
    console.error('Error while connecting to web3', err);
    return;
  }

  // You can execute contract calls after the connection

});
