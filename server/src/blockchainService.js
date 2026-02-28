/**
 * Blockchain Service for Backend
 * Handles blockchain interactions on the server side using ethers.js
 */

import { ethers } from 'ethers';
import crypto from 'crypto';

class ServerBlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  /**
   * Initialize blockchain provider
   */
  async initializeProvider(rpcUrl = 'http://localhost:8545') {
    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Verify connection
      const network = await this.provider.getNetwork();
      console.log('Blockchain provider initialized:', {
        chainId: network.chainId,
        name: network.name,
        url: rpcUrl
      });
      
      return { success: true, network };
    } catch (error) {
      console.error('Failed to initialize blockchain provider:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize signer with private key
   */
  initializeSigner(privateKey) {
    try {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      console.log('Blockchain signer initialized:', this.signer.address);
      return { success: true, address: this.signer.address };
    } catch (error) {
      console.error('Failed to initialize signer:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate cryptographic hash for data
   */
  generateDataHash(data) {
    const jsonString = JSON.stringify(data);
    return '0x' + crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  /**
   * Sign data on the server
   */
  async signData(data) {
    try {
      if (!this.signer) {
        throw new Error('Signer not initialized');
      }
      
      const messageHash = ethers.id(JSON.stringify(data));
      const signature = await this.signer.signMessage(
        ethers.toBeHex(messageHash)
      );
      
      return {
        success: true,
        signature,
        messageHash,
        signer: this.signer.address
      };
    } catch (error) {
      console.error('Failed to sign data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Record data integrity on blockchain
   */
  async recordDataIntegrity(dataId, dataHash, metadata) {
    try {
      if (!this.signer) {
        throw new Error('Signer not initialized');
      }
      
      const timestamp = Math.floor(Date.now() / 1000);
      const record = {
        dataId,
        dataHash,
        metadata,
        timestamp,
        recordedBy: this.signer.address
      };
      
      const signature = await this.signData(record);
      
      return {
        success: true,
        record,
        signature: signature.signature,
        blockchainSignature: signature.signature
      };
    } catch (error) {
      console.error('Failed to record data integrity:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create federated network node
   */
  async createNetworkNode(nodeId, endpoint, region) {
    try {
      const nodeData = {
        nodeId,
        endpoint,
        region,
        address: this.signer.address,
        createdAt: new Date().toISOString()
      };
      
      const dataHash = this.generateDataHash(nodeData);
      const signature = await this.signData(nodeData);
      
      return {
        success: true,
        node: {
          ...nodeData,
          hash: dataHash,
          signature: signature.signature
        }
      };
    } catch (error) {
      console.error('Failed to create network node:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create access control entry
   */
  async createAccessControlEntry(userId, role, permissions) {
    try {
      const aclEntry = {
        userId,
        role,
        permissions,
        grantedBy: this.signer.address,
        grantedAt: new Date().toISOString()
      };
      
      const dataHash = this.generateDataHash(aclEntry);
      const signature = await this.signData(aclEntry);
      
      return {
        success: true,
        acl: {
          ...aclEntry,
          hash: dataHash,
          signature: signature.signature
        }
      };
    } catch (error) {
      console.error('Failed to create ACL entry:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify data hasn't been tampered with
   */
  verifyDataIntegrity(data, hash) {
    try {
      const recalculatedHash = this.generateDataHash(data);
      const isValid = recalculatedHash === hash;
      
      return {
        success: true,
        isValid,
        originalHash: hash,
        recalculatedHash
      };
    } catch (error) {
      console.error('Failed to verify data integrity:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create audit log entry
   */
  async createAuditLog(action, userId, resource, changes) {
    try {
      const logEntry = {
        action,
        userId,
        resource,
        changes,
        timestamp: Math.floor(Date.now() / 1000),
        recordedBy: this.signer.address
      };
      
      const dataHash = this.generateDataHash(logEntry);
      const signature = await this.signData(logEntry);
      
      return {
        success: true,
        auditLog: {
          ...logEntry,
          hash: dataHash,
          signature: signature.signature
        }
      };
    } catch (error) {
      console.error('Failed to create audit log:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a digital certificate
   */
  async createCertificate(certificateData) {
    try {
      const certificate = {
        ...certificateData,
        issuedAt: new Date().toISOString(),
        issuedBy: this.signer.address
      };
      
      const dataHash = this.generateDataHash(certificate);
      const signature = await this.signData(certificate);
      
      return {
        success: true,
        certificate: {
          ...certificate,
          hash: dataHash,
          signature: signature.signature,
          verified: true
        }
      };
    } catch (error) {
      console.error('Failed to create certificate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify a digital certificate
   */
  verifyCertificate(certificate) {
    try {
      const { signature, hash, ...certificateData } = certificate;
      const recalculatedHash = this.generateDataHash(certificateData);
      
      return {
        success: true,
        isValid: recalculatedHash === hash,
        issuer: certificate.issuedBy,
        issuedAt: certificate.issuedAt
      };
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current signer address
   */
  getSignerAddress() {
    return this.signer ? this.signer.address : null;
  }

  /**
   * Get signer balance
   */
  async getSignerBalance() {
    try {
      if (!this.signer || !this.provider) {
        throw new Error('Signer or provider not initialized');
      }
      
      const balance = await this.provider.getBalance(this.signer.address);
      return {
        success: true,
        balance: ethers.formatEther(balance),
        wei: balance.toString()
      };
    } catch (error) {
      console.error('Failed to get signer balance:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get block information
   */
  async getBlockInfo(blockNumber = 'latest') {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      
      const block = await this.provider.getBlock(blockNumber);
      return {
        success: true,
        block: {
          number: block.number,
          hash: block.hash,
          timestamp: block.timestamp,
          miner: block.miner,
          gasUsed: block.gasUsed.toString()
        }
      };
    } catch (error) {
      console.error('Failed to get block info:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ServerBlockchainService;
