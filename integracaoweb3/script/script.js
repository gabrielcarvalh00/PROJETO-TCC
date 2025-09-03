let conexao;
let web3; // Variável global para a instância do Web3

// Guarda o endereco do meu contrato na blockchain
const contractAddress = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";

// Arquivo json que recebe o meu contrato que esta na blockchain
const contractABI = [ 
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "Adress_seller",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_link",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "buyImage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "image",
    "outputs": [
      {
        "internalType": "address",
        "name": "Adress_seller",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "link",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ownerContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] ;

// A conexao da aplicacao web com a carteira da metamask;
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Se a conexão for bem-sucedida, inicializa o Web3 e salva a conexao
      web3 = new Web3(window.ethereum);
      conexao = accounts;
      console.log('Carteira conectada! Contas:', conexao);
      alert('Carteira conectada!');
    } catch (error) {
      console.error('Erro ao conectar a carteira:', error);
      alert('Erro ao conectar a carteira. Por favor, tente novamente.');
    }
  } else {
    alert('Por favor, instale a MetaMask!');
  }
}

async function buy() {
  if (conexao) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
      const transaction = await contract.methods.buyImage().send({ 
        from: conexao[0], 
        value: web3.utils.toWei('0.1', 'ether') 
      });

      console.log('Transação enviada:', transaction.transactionHash);
      alert('Compra concluída!');
    } catch (error) {
      console.error('Erro ao realizar a compra:', error);
      alert('Erro ao realizar a compra. Por favor, verifique o console para mais detalhes.');
    }
  } else {
    alert('Por favor, conecte a sua carteira primeiro.');
  }
}

document.getElementById('conectar').onclick = connectWallet;
document.getElementById('buyButton').onclick = buy;