const DOM = artifacts.require('DOM');
const {Utils} = artifacts.require("EmbarkJS");
const { should, EVMThrow, EVMInvalid, EVMInvalidAddress } = require('./helpers');
let accounts;

const _name = "DecentralisedOwnershipModel";
const _symbol = "DOM";
const _decimals = 18;
const _percentForBeneficiary = 10
const _tokensPerEth = 1000;

const promisify = (inner) => new Promise((resolve, reject) => inner((err, res) => err ? reject(err) : resolve(res)));
const getBalance = (addr) => promisify((cb) => web3.eth.getBalance(addr, cb));
const getTransaction = (txHash) => promisify((cb) => web3.eth.getTransaction(txHash, cb));

//variables used for sanity check
let ethwithdrawn  = "0";
let tokensbought  = "0";
let tokenssold    = "0";

config({
    deployment: {
      accounts: [
        {   
            nodeAccounts: true,
            numAddresses: "5",
            password: 'config/development/password',
            balance: '10 ether'
        }
      ]
    },
    contracts: {
        deploy: {
            "DOM": {
                args: {
                    _beneficiary: '$accounts[1]',
                    _tokensPerEth: _tokensPerEth,
                    _percentForBeneficiary: _percentForBeneficiary
                }
            }
        }
    }
  }, (_err, web3_accounts) => {
    accounts = web3_accounts
  });


contract('DOM', function() {

    // Runs once at start of test suite
    before(async function() {
        console.log(accounts);
        [owner, beneficiary, tokenowner, donator, customer] = accounts;
    });

    /**
     * Runs before each test
     */
    beforeEach(async function() {

        //ensure contract is unpaused
        let isPaused = await DOM.paused();
            if(isPaused) {
            await DOM.methods.unpause().send({from: accounts[0]});
        }

        //reset contract owner
        let currentOwner = await DOM.owner();
        await DOM.methods.transferOwnership(owner).send({from: currentOwner});

        //reset beneficiary
        await DOM.methods.setBeneficiary(beneficiary).send({from: owner});
    });

    //----BRING ON THEM TESTS----//

    it("should have an address", async function () { 
        //console.log(DOM);
        web3.utils.isAddress(DOM.address).should.be.true;
     });

    it("should have the correct token name", async function () { 
        (await DOM.name()).should.equal(_name);
    });

    it("should have the correct token symbol", async function () { 
        (await DOM.symbol()).should.equal(_symbol);
     });
    
    it("should have the correct number of decimals", async function () { 
        let decimals = await (DOM.decimals());
        decimals.should.bignumber.equal(_decimals);
     });
    
    it("should set owner on contract creation when Ownable", async function () { 
        (await DOM.owner()).should.equal(owner);
     });
    
    it("should not be paused on contract creation when Pausable", async function () { 
        (await DOM.paused()).should.be.false;
     });
    
    it("should set beneficiary on contract creation", async function () { 
        (await DOM.beneficiary()).should.deep.equal(beneficiary);
     });

    it("should have the correct percent to hold value", async function () { 
        let percentForBeneficiary = await (DOM.percentForBeneficiary());
        percentForBeneficiary.should.bignumber.equal(_percentForBeneficiary);
     });
    
    it("should allow setting new beneficiary by owner to valid address", async function () {
        await DOM.methods.setBeneficiary(owner).send({from: owner});
        (await DOM.methods.beneficiary().call()).should.deep.equal(owner);
     });
    
    it("should not allow setting new beneficiary if not owner", async function () { 
       await DOM.methods.setBeneficiary(owner).send({from: customer}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should allow transfer of ownership by owner when Ownable", async function () { 
        let newOwner = accounts[9];

        // set the contract owner
        await DOM.methods.transferOwnership(newOwner).send( { from: owner });

        // validate the owner has been changed and matches the new address
        (await DOM.owner()).should.equal(newOwner);
     });
    
    it("should not allow transfer of ownership by non-owner when Ownable", async function () { 
        let newOwner = accounts[9];

        await DOM.methods.transferOwnership(newOwner).send({from: beneficiary}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should be able to be paused and unpaused by owner when Pausable", async function () { 
        await DOM.methods.pause().send({from: owner});
        (await DOM.paused()).should.be.true;
        await DOM.methods.unpause().send({from: owner});
        (await DOM.paused()).should.be.false;
     });
    
    it("should not allow pause by non-owner when Pausable", async function () { 
        await DOM.methods.pause().send({from: accounts[1]}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should not allow unpause by non-owner if paused when Pausable", async function () { 
        await DOM.methods.pause().send({from: owner});
        (await DOM.paused()).should.be.true;
        await DOM.methods.unpause().send({from: accounts[1]}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should allow approve() and allowance() when unpaused", async function () { 
        assert.fail('test not implemented')   
     });
    
    it("should not allow approve() when paused", async function () { 
        await DOM.pause({from: owner});
        (await DOM.paused()).should.be.true;

        await (DOM.methods.approve(accounts[1], 0).send({from: accounts[0]}))
            .should.be.rejectedWith(EVMThrow);
     });
    
    it("should not allow transfer() when paused", async function () { 
        await DOM.pause({from: accounts[0]});

        let xferAmt = 0;

        await DOM.methods.transfer(accounts[1],xferAmt).send({ from: accounts[0] })
            .should.be.rejectedWith(EVMThrow);
     });

    it("should not allow transfer() for more than you have", async function () { 
        let xferAmt = 100;

        await DOM.methods.transfer(accounts[1],xferAmt).send({ from: accounts[0] })
            .should.be.rejectedWith(EVMThrow);
    });

    it("should not allow transferFrom() when paused", async function () { assert.fail('test not implemented') });
    
    it("should not allow transfer() when _to is null", async function () { assert.fail('test not implemented') });
    
    it("should not allow transfer() when _to is 0x0000000000000000000000000000000000000000", async function () { 
        (await DOM.paused()).should.be.false;
        let xferAmt = 1000;

        await DOM.methods.transfer(
            '0x0000000000000000000000000000000000000000',
            xferAmt).send({ from: accounts[0] })
            .should.be.rejectedWith(EVMThrow);
     });
    
    it("should not allow transferFrom() when _to is null", async function () { assert.fail('test not implemented') });
    
    it("should not allow transferFrom() when _to is 0x0000000000000000000000000000000000000000", async function () { assert.fail('test not implemented') });
    
    it("should set the number of Tokens per ETH when contract deployed", async function () { 
        let tokenvalue = await DOM.tokensPerEth();
        tokenvalue.should.bignumber.equal(_tokensPerEth);
    });
    
    it("should issue correct amount of tokens when 1 Ether is sent and is unpaused", async function () { assert.fail('test not implemented') });
    
    it("should issue correct amount of tokens when 1 Ether is sent to fallback function", async function () { 
        let xferAmt = web3.utils.toWei("1", "ether");
        let requiredGas = "100000";

        await web3.eth.sendTransaction({
            from: tokenowner,
            to: DOM.address,
        gas: requiredGas, // technically optional, but you almost certainly need more than the default 21k gas
        value: xferAmt //optional, if you want to pay the contract Ether
        });

        let t = await (DOM.methods.balanceOf(tokenowner));
        //console.log(t)
        let c = await (DOM.methods.balanceOf(beneficiary));

        tokensbought = web3.utils.toBN(t).plus(c);

        //@todo - need to do some tests
     });
    
    it("should allow transferFrom() when properly approved and unpaused", async function () { assert.fail('test not implemented') });
    
    it("should allow transfer() of Tokens by address owner when unpaused", async function () { assert.fail('test not implemented') });
    
    it("should not allow buying of tokens when paused", async function () { assert.fail('test not implemented') });
    
    it("should allow selling of tokens when not paused", async function () { assert.fail('test not implemented') });
    
    it("should not allow selling of tokens when paused", async function () { assert.fail('test not implemented') });
    
    it("should not allow selling more tokens than you have", async function () { assert.fail('test not implemented') });
    
    it("should allow you to withdraw ether that you have after selling tokens", async function () { assert.fail('test not implemented') });
    
    it("should allow creating new invoice", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be cancelled", async function () { assert.fail('test not implemented') });
    
    it("should error when trying to cancel an invoice that does not exist", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be partially paid with tokens", async function () { assert.fail('test not implemented') });
    
    it("should allow multiple payments against an invoice", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be paid in full with tokens", async function () { assert.fail('test not implemented') });
    
    it("should only burn the correct amount of tokens when invoice is overpaid", async function () { assert.fail('test not implemented') });
    
    it("should not allow payments against fully paid invoices", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be partially paid in ether", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be paid in full with ether", async function () { assert.fail('test not implemented') });
    
    it("should issue new tokens if invoice is overpaid with ether", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be partially paid with combination of ether and tokens", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be paid in full with combination of ether and tokens", async function () { assert.fail('test not implemented') });
    
    it("should allow an invoice to be overpaid with combination of ether and tokens", async function () { assert.fail('test not implemented') });

    it("Sanity Check", async function() {

        //let ethbalance = await getBalance(DOM.address);
        let tokensincirculation = await DOM.totalSupply();
        //let beneficiarybalance = await DOM.balanceOf(beneficiary);
        //let tokenownerethavailable = (await DOM.checkWithdrawalAvailability(tokenowner));
        let numberinvoices = await DOM.getInvoiceCount();

        console.log('-----');
        //console.log(web3);
        //console.log("Ether Balance: " + web3.fromWei(ethbalance, 'ether'));
        console.log(_symbol + " Tokens Bought: " + web3.utils.fromWei(tokensbought, 'ether'));
        console.log(_symbol + " Tokens Sold: " + web3.utils.fromWei(tokenssold, 'ether'));
        console.log(_symbol + " Tokens In Circulation: " + web3.utils.fromWei(tokensincirculation, 'ether')); //warning - only if decimals is 18
        //console.log("Beneficiary Tokens: " + web3.utils.fromWei(beneficiarybalance, 'ether')); 
        //console.log("Withdrawal Amount Available: " + web3.fromWei(tokenownerethavailable, 'ether'));
        console.log("Number of Invoices Issued: " + numberinvoices);
        console.log("Value of Invoices Paid: " );
        console.log('-----');

    });

});