const UTO = artifacts.require('UTO');
const {Utils} = artifacts.require("EmbarkJS");
const { should, EVMThrow, EVMInvalid, EVMInvalidAddress } = require('./helpers');
let accounts;

const _name = "UnlimitedToken";
const _symbol = "UTO";
const _decimals = 18;
const _percentForBeneficiary = 10

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
            "UTO": {
                args: {
                    _beneficiary: '$accounts[1]',
                    _tokensPerEth: 1000,
                    _percentForBeneficiary: _percentForBeneficiary
                }
            }
        }
    }
  }, (_err, web3_accounts) => {
    accounts = web3_accounts
  });


contract('UTO', function() {

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
        let isPaused = await UTO.paused();
            if(isPaused) {
            await UTO.methods.unpause().send({from: accounts[0]});
        }

        //reset contract owner
        let currentOwner = await UTO.owner();
        await UTO.methods.transferOwnership(owner).send({from: currentOwner});

        //reset beneficiary
        await UTO.methods.setBeneficiary(beneficiary).send({from: owner});
    });

    //----BRING ON THEM TESTS----//

    it("should have an address", async function () { 
        //console.log(UTO);
        web3.utils.isAddress(UTO.address).should.be.true;
     });

    it("should have the correct token name", async function () { 
        (await UTO.name()).should.equal(_name);
    });

    it("should have the correct token symbol", async function () { 
        (await UTO.symbol()).should.equal(_symbol);
     });
    
    it("should have the correct number of decimals", async function () { 
        let decimals = await (UTO.decimals());
        decimals.should.bignumber.equal(_decimals);
     });
    
    it("should set owner on contract creation when Ownable", async function () { 
        (await UTO.owner()).should.equal(owner);
     });
    
    it("should not be paused on contract creation when Pausable", async function () { 
        (await UTO.paused()).should.be.false;
     });
    
    it("should set beneficiary on contract creation", async function () { 
        (await UTO.beneficiary()).should.deep.equal(beneficiary);
     });

    it("should have the correct percent to hold value", async function () { 
        let percentForBeneficiary = await (UTO.percentForBeneficiary());
        percentForBeneficiary.should.bignumber.equal(_percentForBeneficiary);
     });
    
    it("should allow setting new beneficiary by owner to valid address", async function () {
        await UTO.methods.setBeneficiary(owner).send({from: owner});
        (await UTO.methods.beneficiary().call()).should.deep.equal(owner);
     });
    
    it("should not allow setting new beneficiary if not owner", async function () { 
       await UTO.methods.setBeneficiary(owner).send({from: customer}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should allow transfer of ownership by owner when Ownable", async function () { 
        let newOwner = accounts[9];

        // set the contract owner
        await UTO.methods.transferOwnership(newOwner).send( { from: owner });

        // validate the owner has been changed and matches the new address
        (await UTO.owner()).should.equal(newOwner);
     });
    
    it("should not allow transfer of ownership by non-owner when Ownable", async function () { 
        let newOwner = accounts[9];

        await UTO.methods.transferOwnership(newOwner).send({from: beneficiary}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should be able to be paused and unpaused by owner when Pausable", async function () { 
        await UTO.methods.pause().send({from: owner});
        (await UTO.paused()).should.be.true;
        await UTO.methods.unpause().send({from: owner});
        (await UTO.paused()).should.be.false;
     });
    
    it("should not allow pause by non-owner when Pausable", async function () { 
        await UTO.methods.pause().send({from: accounts[1]}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should not allow unpause by non-owner if paused when Pausable", async function () { 
        await UTO.methods.pause().send({from: owner});
        (await UTO.paused()).should.be.true;
        await UTO.methods.unpause().send({from: accounts[1]}).should.be.rejectedWith(EVMThrow);
     });
    
    it("should allow approve() and allowance() when unpaused", async function () { 
        assert.fail('test not implemented')   
     });
    
    it("should not allow approve() when paused", async function () { 
        await UTO.pause({from: owner});
        (await UTO.paused()).should.be.true;

        await (UTO.methods.approve(accounts[1], 0).send({from: accounts[0]}))
            .should.be.rejectedWith(EVMThrow);
     });
    
    it("should not allow transfer() when paused", async function () { assert.fail('test not implemented') });
    
    it("should not allow transferFrom() when paused", async function () { assert.fail('test not implemented') });
    
    it("should not allow transfer() when _to is null", async function () { assert.fail('test not implemented') });
    
    it("should not allow transfer() when _to is 0x0000000000000000000000000000000000000000", async function () { assert.fail('test not implemented') });
    
    it("should not allow transferFrom() when _to is null", async function () { assert.fail('test not implemented') });
    
    it("should not allow transferFrom() when _to is 0x0000000000000000000000000000000000000000", async function () { assert.fail('test not implemented') });
    
    it("should set the number of Tokens per ETH when contract deployed", async function () { assert.fail('test not implemented') });
    
    it("should issue correct amount of tokens when 1 Ether is sent and is unpaused", async function () { assert.fail('test not implemented') });
    
    it("should issue correct amount of tokens when 1 Ether is sent to fallback function", async function () { assert.fail('test not implemented') });
    
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

});