pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DOM is ERC20, Ownable, Pausable {

    string private _name = "DecentralisedOwnershipModel";
    string private _symbol = "DOM";

    uint256 public tokensPerEth;            //Number of tokens per ETH
    uint256 public tokenValue;              //Value of 1 Token (in ETH)
    uint256 public percentForBeneficiary;   //Percentage of tokens generated to be assigned to beneficiary
    address public beneficiary;             //The address of the beneficiary of the held tokens

    bytes32[] private invoiceIndex;         //keep track of our invoices

    constructor(address _beneficiary, uint256 _tokensPerEth, uint256 _percentForBeneficiary) ERC20(_name, _symbol) public {
        tokensPerEth = _tokensPerEth;
        tokenValue = 1 wei;    //initial value, dynamic once contract is deployed
        beneficiary = _beneficiary;
        percentForBeneficiary = _percentForBeneficiary;
    }

    /**
     * @dev Fallback function that forwards to buyTokens
     */
    fallback() external whenNotPaused payable {
        buyTokens(msg.sender);
    }

    /**
     * @dev Function to buy Tokens
     * @param _to The address that will receive the minted tokens
     */
    function buyTokens(address _to) whenNotPaused public payable {
        //require(_to != 0x0);

        uint256 tokens = (msg.value * tokensPerEth);

        //mint(_to, tokens * (100 - percentToHold) / 100);
        //mint(beneficiary, tokens * percentToHold / 100);
  }

    /**
     * @dev called by the owner to pause, triggers stopped state
     */
    function pause() public onlyOwner whenNotPaused  {
        return _pause();
    }

    /**
     * @dev called by the owner to unpause, returns to normal state
     */
    function unpause() public onlyOwner whenPaused {
        return _unpause();
    }

    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender when not paused.
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     */
    function approve(address _spender, uint256 _value) public override whenNotPaused returns (bool) {
        return super.approve(_spender, _value);
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address _recipient, uint256 _amount) public override whenNotPaused returns (bool) {
        return super.transfer(_recipient, _amount);
    }

    /**
     * @dev Allows the current owner to change the beneficiary.
     * @param newBeneficiary The address of the new beneficiary.
     */
    function setBeneficiary(address newBeneficiary) public onlyOwner {
        require(newBeneficiary != address(0), "Invalid address for beneficiary");
        beneficiary = newBeneficiary;
    }


    function getInvoiceCount() public view returns (uint count) {
        return invoiceIndex.length;
    }

}