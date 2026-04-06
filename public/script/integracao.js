let conexao;
let web3; // Variável global para a instância do Web3
let destinatario;

// Guarda o endereco do meu contrato na blockchain
const contractAddress = "0xb9beFF0D202De9432834408042e6e91692E0421d";

// Arquivo json que recebe o meu contrato que esta na blockchain
const contractABI = [ 
  
	{
	"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "remetente",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "destinatario",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "TransferenciaRealizada",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_destinatario",
				"type": "address"
			}
		],
		"name": "enviarEther",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}

] ;

// A conexao da aplicacao web com a carteira da metamask;
async function connectWallet() {
  if (window.ethereum) {
    try {

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      web3 = new Web3(window.ethereum);
      conexao = accounts;

      alert('Carteira conectada na Sepolia!');

    } catch (error) {
      console.error(error);
    }
  }
}

async function buy() {
  const urlParams = new URLSearchParams(window.location.search);
  destinatario = urlParams.get('wallet');
  alert(destinatario);

	if (conexao) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
      const transaction = await contract.methods.enviarEther(destinatario).send({ 
        from: conexao[0], 
        // Valor modificado para 1 Wei (a menor unidade)
        value: web3.utils.toWei('0.0001', 'ether') 
      });
           
      console.log('Transação enviada:', transaction.transactionHash);
      alert('Compra concluída!');
    } catch (error) {
      // 1. Imprime o erro completo no console para debug
      console.error('Erro detalhado da transação:', error);
      
      // 2. Exibe uma mensagem amigável no pop-up, talvez com a mensagem do erro
      // Tente usar 'error.message' se disponível, senão use uma mensagem fixa.
      const mensagemErro = error.message || 'Erro desconhecido. Verifique o console para detalhes.';
      
      alert('ERRO NA TRANSAÇÃO: ' + mensagemErro);
    }
}
}

//0x82231E3281B09413363485311DF299F2833782D8

document.getElementById('conectar').onclick = connectWallet;
document.getElementById('buyButton').onclick = buy;