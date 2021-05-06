import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json';

class App extends Component {
	async componentWillMount() {
		await this.loadWeb3();
		await this.loadBlockChainData();
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	}

	async loadBlockChainData() {
		const web3 = window.web3;
		// load accounts
		const accounts = await web3.eth.getAccounts();
		this.setState({ accounts: accounts[0] });

		const networkId = await web3.eth.net.getId();
		const networkData = Color.networks[networkId];
		if (networkData) {
			const abi = Color.abi;
			const address = networkData.address;
			const contract = new web3.eth.Contract(abi, address);
			this.setState({ contract });
			const totalSupply = await contract.methods.totalSupply().call();
			this.setState({ totalSupply });
			// Load the colors
			for (var i = 1; i <= totalSupply; i++) {
				const color = await contract.methods.colors(i - 1).call();
				this.setState({ colors: [ ...this.state.colors, color ] });
			}
		} else {
			window.alert('Smart Contract not deployed on specific network');
		}
	}

	mint = (color) => {
		console.log(color);
		this.state.contract.methods.mint(color).send({ from: this.state.accounts }).once('receipt', (receipt) => {
			this.setState({ colors: [ ...this.state.colors, color ] });
		});
	};

	constructor(props) {
		super(props);
		this.state = {
			accounts: '',
			contract: null,
			totalSupply: 0,
			colors: []
		};
	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
					<a
						className="navbar-brand col-sm-3 col-md-2 mr-0"
						href="http://www.dappuniversity.com/bootcamp"
						target="_blank"
						rel="noopener noreferrer"
					>
						Cryptobia
					</a>
					<ul className="navbar-nav px-3">
						<li className="nav-item text-nowrap d-none d-sm-non d-sm-block">
							<small className="text-white">
								<span id="account">{this.state.accounts}</span>
							</small>
						</li>
					</ul>
				</nav>
				<div className="container-fluid mt-5">
					<div className="row">
						<main role="main" className="col-lg-12 d-flex text-center">
							<div className="content mr-auto ml-auto" />
							<h1>Issue Token</h1>
							<form
								onSubmit={(event) => {
									event.preventDefault();
									const color = this.color.value;
									this.mint(color);
								}}
							>
								<input
									type="text"
									className="form-control mb-1"
									placeholder="#FFFFFF"
									ref={(input) => {
										this.color = input;
									}}
								/>
								<input type="submit" className="btn btn-block btn-primary" value="MINT" />
							</form>
						</main>
					</div>
					<hr />
					<div className="row text-center">
						{this.state.colors.map((color, key) => {
							return (
								<div key={key} className="col-md-3 mb-3">
									<div className="token" style={{ background: color }} />
									<div>{color}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
