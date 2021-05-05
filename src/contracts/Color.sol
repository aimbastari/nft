// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {
    string[] public colors;
    mapping(string => bool) _colorExists;


    constructor() ERC721("Color", "COLOR")  {
    }

    function mint (string memory _color) public {
        require(!_colorExists[_color]);
        colors.push(_color);
        uint _id = colors.length -1;
        _safeMint(msg.sender, _id);
        _colorExists[_color] = true;

    }

    function totalSupply() public view returns(uint){
        return colors.length;
    }
}