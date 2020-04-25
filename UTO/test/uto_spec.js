const UTO = artifacts.require('UTO');
const {Utils} = artifacts.require("EmbarkJS");
let accounts;

config({
    deployment: {
      accounts: [
        // you can configure custom accounts with a custom balance
        // see https://framework.embarklabs.io/docs/contracts_testing.html#Configuring-accounts
        {   
            nodeAccounts: true,
            password: 'config/development/password',
            balance: '10 ether'
        }
      ]
    },
    contracts: {
        deploy: {
            "UTO": {}
        }
    }
  }, (_err, web3_accounts) => {
    accounts = web3_accounts
  });

contract('UTO', function() {

    it("should have an address", async function () { assert.fail('test not implemented') });

    it("should have the correct token name", async function () { assert.fail('test not implemented') });

    it("should have the correct token symbol", async function () { assert.fail('test not implemented') });
    
    it("should have the correct number of decimals", async function () { assert.fail('test not implemented') });
    
    it("should set owner on contract creation when Ownable", async function () { assert.fail('test not implemented') });
    
    it("should not be paused on contract creation when Pausable", async function () { assert.fail('test not implemented') });
    
    it("should set company on contract creation", async function () { assert.fail('test not implemented') });
    
    it("should allow setting new company by owner to valid address", async function () { assert.fail('test not implemented') });
    
    it("should not allow setting new company if not owner", async function () { assert.fail('test not implemented') });
    
    it("should allow transfer of ownership by owner when Ownable", async function () { assert.fail('test not implemented') });
    
    it("should not allow transfer of ownership by non-owner when Ownable", async function () { assert.fail('test not implemented') });
    
    it("should be able to be paused and unpaused by owner when Pausable", async function () { assert.fail('test not implemented') });
    
    it("should not allow pause by non-owner when Pausable", async function () { assert.fail('test not implemented') });
    
    it("should not allow unpause by non-owner if paused when Pausable", async function () { assert.fail('test not implemented') });
    
    it("should allow approve() and allowance() when unpaused", async function () { assert.fail('test not implemented') });
    
    it("should not allow approve() when paused", async function () { assert.fail('test not implemented') });
    
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