pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract UTO is ERC20, Ownable, Pausable {

    string private _name = "UnlimitedToken";
    string private _symbol = "UTO";

    uint256 public token_eth;       //Number of tokens per ETH
    uint256 public token_value;     //Value of 1 Token (in ETH)
    uint256 public percentToHold;   //Percentage of tokens generated to be assigned to company
    address public company;        //The address of the beneficiary of the held tokens

    constructor(address _company) ERC20(_name, _symbol) public {
        token_eth = 1000;
        token_value = 1 wei;    //note that this value is dynamic once contract is deployed
        company = _company;   // not sure about this, could cause issue if contract proxy is used
        percentToHold = 20;
    }

}