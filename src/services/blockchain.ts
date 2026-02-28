/**
 * Blockchain Service for Frontend
 * Handles blockchain interactions using ethers.js
 */

import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
    this.contracts = {};
  }

  /**
   * Initialize blockchain connection
   */
  async initializeBlockchain() {
    try {
      // Check if MetaMask is available
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        this.userAddress = accounts[0];
        this.signer = await this.provider.getSigner();
        
        console.log('Blockchain initialized with address:', this.userAddress);
        return { success: true, address: this.userAddress };
      } else {
        console.warn('MetaMask not available, using read-only mode');
        this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
        return { success: false, message: 'MetaMask not installed' };
      }
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate cryptographic hash for data
   */
  generateDataHash(data) {
    const jsonString = JSON.stringify(data);
    return '0x' + CryptoJS.SHA256(jsonString).toString();
  }

  /**
   * Create a cryptographic signature
   */
  async signData(data) {
    try {
      if (!this.signer) {
        throw new Error('Blockchain not initialized');
      }
      
      const messageHash = ethers.id(JSON.stringify(data));
      const signature = await this.signer.signMessage(ethers.toBeHex(messageHash));
      
      return {
        success: true,
        signature,
        messageHash,
        signer: this.userAddress
      };
    } catch (error) {
      console.error('Failed to sign data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify a signature
   */
  verifySignature(data, signature) {
    try {
      const messageHash = ethers.id(JSON.stringify(data));
      const recoveredAddress = ethers.recoverAddress(messageHash, signature);
      return {
        success: true,
        isValid: recoveredAddress.toLowerCase() === this.userAddress.toLowerCase(),
        recoveredAddress
      };
    } catch (error) {
      console.error('Failed to verify signature:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user's wallet address
   */
  getUserAddress() {
    return this.userAddress;
  }

  /**
   * Get user's account balance
   */
  async getBalance() {
    try {
      if (!this.provider || !this.userAddress) {
        throw new Error('Blockchain not initialized');
      }
      
      const balance = await this.provider.getBalance(this.userAddress);
      return {
        success: true,
        balance: ethers.formatEther(balance),
        wei: balance.toString()
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate proof of ownership
   */
  async generateProofOfOwnership() {
    try {
      const timestamp = Date.now();
      const message = `Proof of ownership - ${this.userAddress} - ${timestamp}`;
      const signature = await this.signer.signMessage(message);
      
      return {
        success: true,
        address: this.userAddress,
        timestamp,
        signature,
        message
      };
    } catch (error) {
      console.error('Failed to generate proof of ownership:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify proof of ownership
   */
  verifyProofOfOwnership(proof) {
    try {
      const recoveredAddress = ethers.recoverAddress(
        ethers.hashMessage(proof.message),
        proof.signature
      );
      
      return {
        success: true,
        isValid: recoveredAddress.toLowerCase() === proof.address.toLowerCase()
      };
    } catch (error) {
      console.error('Failed to verify proof of ownership:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create digital credentials
   */
  async createCredential(credentialData) {
    try {
      const dataHash = this.generateDataHash(credentialData);
      const signature = await this.signData(credentialData);
      
      return {
        success: true,
        credential: {
          data: credentialData,
          hash: dataHash,
          signature: signature.signature,
          issuedAt: new Date().toISOString(),
          issuer: this.userAddress
        }
      };
    } catch (error) {
      console.error('Failed to create credential:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify digital credential
   */
  verifyCredential(credential) {
    try {
      const recalculatedHash = this.generateDataHash(credential.data);
      const hashMatch = recalculatedHash === credential.hash;
      
      const signatureValid = this.verifySignature(
        credential.data,
        credential.signature
      ).isValid;
      
      return {
        success: true,
        isValid: hashMatch && signatureValid,
        hashMatch,
        signatureValid,
        issuer: credential.issuer
      };
    } catch (error) {
      console.error('Failed to verify credential:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current network information
   */
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Blockchain not initialized');
      }
      
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getGasPrice();
      
      return {
        success: true,
        network: {
          name: network.name,
          chainId: network.chainId,
          blockNumber,
          gasPrice: ethers.formatUnits(gasPrice, 'gwei')
        }
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default BlockchainService;
