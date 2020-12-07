
let voteContract;
let userAccount;

const { ethereum } = window;

document.getElementById('metamaskConnect').onclick = async () => {
  try {
    await ethereum.request( {method: 'eth_requestAccounts' } );
    document.getElementById('metamaskConnect').disabled = true;
  } catch(error) {
    console.error(error);
    document.getElementById('metamaskConnect').disabled = false;
    document.getElementById('accountAddress').innerText = 'failed to connect to MetaMask';
  }
};

function startApp() {
  //const voteContractContractAddress = "YOUR_CONTRACT_ADDRESS";
  //voteContract = new web3js.eth.Contract(voteABI, voteContractAddress);

  const accountInterval = setInterval(function() {
    // Check if account has changed
    if (web3.eth.accounts[0] !== userAccount) {
      userAccount = web3.eth.accounts[0];
      document.getElementById('accountAddress').innerText = `Connected to account: ${userAccount}`;
      // Call a function to update the UI with the new account
      //getZombiesByOwner(userAccount)
        //.then(displayZombies);
    }
  }, 100);

  voteContract.events.ProposalCreated()
      .on('data', function(e) {
        let proposal = e.returnValues;
        console.log("new proposal created", proposal.proposalId, proposal.creator, proposal.metadata);
      })
      .on('error', function(error) {
          console.error(error);
      });
    
  voteContract.events.VoteCasted()
      .on('data', function(e) {
        let voteCast = e.returnValues;
        console.log("new vote cast", voteCast.proposalId, voteCast.voter, voteCast.supports);
      })
      .on('error', function(error) {
          console.error(error);
      });
}

function getUserVote(proposalId, user) {
  return voteContract.methods.getUserVote(proposalId, user).call();
}

function getTotalYeas(proposalId) {
  return voteContract.methods.getTotalYeas(proposalId).call();
}

function getTotalNays(proposalId) {
  return voteContract.methods.getTotalNays(proposalId).call();
}

function propose(metadata) {
  return voteContract.methods.propose(metadata)
      .send({ from: userAccount })
      .on('receipt', function(receipt) {

      })
      .on('error', function(error) {

      });
}

function vote(proposalId, supports) {
  return voteContract.methods.vote(proposalId, supports)
      .send({ from: userAccount })
      .on('receipt', function(receipt) {

      })
      .on('error', function(error) {

      });
}



window.addEventListener('load', function() {

  if (Boolean(ethereum) && ethereum.isMetaMask) {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
    startApp()
  } else {
    // Handle the case where the user doesn't have Metamask installed
    // Probably show them a message prompting them to install Metamask
    document.getElementById('metamaskConnect').disabled = true;
    document.getElementById('accountAddress').innerText = "Install Metamask and then reload the page to continue."
  }

})
