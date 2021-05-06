const { assert } = require('chai');

const Color = artifacts.require('Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) => {
	let contract;

	before(async () => {
		contract = await Color.deployed();
	});

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = contract.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
			console.log(address);
		});

		it('has a name', async () => {
			const name = await contract.name();
			assert.equal(name, 'Color');
		});

		it('has a symbol', async () => {
			const symbol = await contract.symbol();
			assert.equal(symbol, 'COLOR');
		});
	});

	describe('minting', async () => {
		it('creates a new token', async () => {
			const result = await contract.mint('#EC058E');
			const result1 = await contract.mint('#FFFFFF');
			const result2 = await contract.mint('#000000');

			const totalSupply = await contract.totalSupply();
			assert.equal(totalSupply, 3);

			// FAILURE: cannot mint same color twice
			await contract.mint('#EC058E').should.be.rejected;
		});
	});
});
