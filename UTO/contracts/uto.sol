pragma solidity >=0.6.0 <0.7.0;

contract UTO {
    //Events

    //Variables
    string private name;                //Token name for display
    string private symbol;              //Token symbol for display
    uint8 private decimals;             //Number of decimal places
    uint256 private token_eth;          //Number of tokens per ETH
    uint256 private token_value;        //Value of 1 Token (in ETH)
    uint256 private percentToHold;      //Percentage of tokens generated to be assigned to company
    address private company;            //The address of the beneficiary of the held tokens

}