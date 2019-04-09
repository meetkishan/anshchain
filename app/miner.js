const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        //include a reward for miner
        const validTaransactions = this.transactionPool.validTransactions();
        validTaransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet())
        );
        //create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTaransactions);
        //Sync chains in the peer-to-peer server
        this.p2pServer.syncChains();
        //clear the transaction pool
        this.transactionPool.clear();
        //broadcast to every miner to clear their transaction pools
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;