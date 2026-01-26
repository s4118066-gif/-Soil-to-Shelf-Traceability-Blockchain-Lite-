# Soil-to-Shelf Traceability System

A digital platform that creates verifiable "birth certificates" for agricultural produce, enabling complete supply chain transparency from farm to consumer.

## Overview

The Soil-to-Shelf Traceability System integrates with existing Mandi platforms to generate QR codes that link to comprehensive provenance data, supporting premium pricing for traceable produce and meeting export market requirements.

## Features

- **Digital Certificates**: Tamper-proof digital records for produce batches
- **QR Code Generation**: Unique QR codes linking to complete traceability data
- **Cryptographic Security**: Blockchain-lite approach using hash chains and Merkle trees
- **Supply Chain Tracking**: Complete audit trail from farm to consumer
- **Mobile-First Design**: Optimized for field and market environments
- **Integration Ready**: APIs for existing Mandi platform integration

## Architecture

The system uses a blockchain-lite approach with:
- **Cryptographic Hashing**: SHA-256 for data integrity
- **Merkle Trees**: Efficient verification of large datasets
- **Digital Signatures**: RSA/ECDSA for authentication
- **Immutable Audit Trail**: Version-controlled change tracking

## Project Structure

```
src/
├── types/           # TypeScript type definitions
├── crypto/          # Cryptographic utilities
│   ├── hash.ts      # Hashing functions
│   ├── signature.ts # Digital signature utilities
│   └── merkle.ts    # Merkle tree implementation
├── utils/           # Utility functions
│   ├── id-generator.ts # Unique ID generation
│   └── validation.ts   # Data validation
└── index.ts         # Main entry point
```

## Installation

```bash
npm install
```

## Development

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Testing

The project uses a dual testing approach:

### Unit Tests
- Test specific examples and edge cases
- Validate integration points between components
- Test error handling and recovery mechanisms

### Property-Based Tests
- Verify universal properties across all inputs
- Test with randomized data generation
- Validate cryptographic operations and data integrity
- Ensure performance characteristics under load

## Core Components

### Cryptographic Utilities

#### HashUtils
- SHA-256 and SHA-3 hashing
- Object serialization and hashing
- Hash chain creation for audit trails
- Hash verification and integrity checking

#### SignatureUtils
- RSA and ECDSA key pair generation
- Digital signature creation and verification
- Batch signing operations
- Key pair validation

#### MerkleTreeUtils
- Merkle tree construction from data sets
- Proof generation and verification
- Tree integrity validation
- Efficient data structure updates

### Utility Functions

#### IdGenerator
- Unique identifier generation for certificates, QR codes, events
- Content-based deterministic IDs
- Sequential and time-based ID generation
- ID format validation and collision prevention

#### ValidationUtils
- Geographic coordinate validation
- Soil health data validation
- Harvest details validation
- Farm data validation
- Email and phone number validation

## Data Models

### Core Types
- `DigitalCertificate`: Complete produce certificate with provenance data
- `FarmData`: Farmer profile and farm information
- `SoilHealthReport`: Scientific soil analysis data
- `HarvestDetails`: Crop harvest information
- `SupplyChainEvent`: Individual events in the produce journey

### Cryptographic Types
- `MerkleTree`: Hash tree for efficient verification
- `DigitalSignature`: Cryptographic signature with metadata
- `MerkleProof`: Proof of inclusion in Merkle tree

## Configuration

System configuration is available in `src/index.ts`:

```typescript
export const CONFIG = {
  HASH_ALGORITHM: 'SHA256',
  SIGNATURE_ALGORITHM: 'RSA',
  KEY_SIZE: 2048,
  QR_ERROR_CORRECTION: 'M',
  MAX_CERTIFICATE_SIZE: 1024 * 1024, // 1MB
  MAX_BATCH_SIZE: 1000,
  CACHE_TTL: 3600, // 1 hour
};
```

## Requirements Mapping

This implementation addresses the following requirements:

- **Requirement 1.4**: Tamper-proof certificate storage using cryptographic hashing
- **Requirement 4.1**: Data integrity verification using Merkle trees and digital signatures
- **Requirement 11.1**: Industry-standard encryption for data security

## Contributing

1. Follow TypeScript best practices
2. Write comprehensive tests for new features
3. Ensure all tests pass before submitting changes
4. Use meaningful commit messages
5. Update documentation for API changes

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please refer to the project documentation or create an issue in the repository.