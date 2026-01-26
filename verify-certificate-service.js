/**
 * Manual verification script for CertificateService
 * This script tests the basic functionality without Jest
 */

const { CertificateService } = require('./dist/services/certificate-service');
const { IdGenerator } = require('./dist/utils/id-generator');

async function testCertificateService() {
  console.log('🧪 Testing CertificateService...\n');

  try {
    // Clear ID generator cache
    IdGenerator.clearCache();
    
    // Initialize service
    const certificateService = new CertificateService({
      enableDigitalSignatures: true,
      hashAlgorithm: 'SHA256'
    });

    console.log('✅ CertificateService initialized successfully');

    // Create mock data
    const mockFarmData = {
      farmerId: 'FARMER-123',
      farmName: 'Green Valley Farm',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 10,
        timestamp: new Date('2024-01-01T10:00:00Z')
      },
      boundaries: {
        type: 'Polygon',
        coordinates: [
          { latitude: 28.6139, longitude: 77.2090 },
          { latitude: 28.6140, longitude: 77.2091 },
          { latitude: 28.6141, longitude: 77.2089 },
          { latitude: 28.6139, longitude: 77.2090 }
        ]
      },
      farmSize: 5.5,
      farmType: 'ORGANIC',
      certifications: [],
      registrationNumber: 'REG-001',
      verificationStatus: 'VERIFIED'
    };

    const mockHarvestData = {
      harvestId: 'HARVEST-001',
      cropType: 'Tomato',
      variety: 'Cherry Tomato',
      plantingDate: new Date('2024-01-15T00:00:00Z'),
      harvestDate: new Date('2024-04-15T00:00:00Z'),
      quantity: 1000,
      unit: 'KG',
      qualityGrade: 'A',
      harvestConditions: {
        temperature: 25,
        humidity: 65,
        rainfall: 10,
        windSpeed: 5,
        conditions: 'Sunny'
      },
      treatmentHistory: []
    };

    const mockSoilData = {
      reportId: 'SOIL-001',
      testingLabId: 'LAB-001',
      testDate: new Date('2024-01-10T00:00:00Z'),
      soilType: 'Loamy',
      phLevel: 6.5,
      organicMatter: 3.2,
      nitrogen: 45,
      phosphorus: 25,
      potassium: 180,
      micronutrients: {
        iron: 15,
        zinc: 8,
        manganese: 12
      },
      recommendations: ['Add organic compost', 'Monitor pH levels'],
      certificationStatus: 'ORGANIC_COMPLIANT'
    };

    const mockCertificationData = {
      farmData: mockFarmData,
      harvestData: mockHarvestData,
      soilData: mockSoilData,
      createdBy: 'test-user'
    };

    console.log('✅ Mock data created successfully');

    // Test 1: Create Certificate
    console.log('\n🔬 Test 1: Creating certificate...');
    const certificate = await certificateService.createCertificate(mockCertificationData);
    
    console.log(`✅ Certificate created with ID: ${certificate.id}`);
    console.log(`   - Batch ID: ${certificate.batchId}`);
    console.log(`   - Farmer ID: ${certificate.farmerId}`);
    console.log(`   - Data Hash: ${certificate.dataHash.substring(0, 16)}...`);
    console.log(`   - Merkle Root: ${certificate.merkleRoot.substring(0, 16)}...`);
    console.log(`   - Digital Signature: ${certificate.digitalSignature ? 'Present' : 'Missing'}`);

    // Test 2: Retrieve Certificate
    console.log('\n🔬 Test 2: Retrieving certificate...');
    const retrieved = await certificateService.getCertificate(certificate.id);
    
    if (retrieved && retrieved.id === certificate.id) {
      console.log('✅ Certificate retrieved successfully');
    } else {
      console.log('❌ Certificate retrieval failed');
      return;
    }

    // Test 3: Verify Certificate
    console.log('\n🔬 Test 3: Verifying certificate...');
    const verification = await certificateService.verifyCertificate(certificate.id);
    
    console.log(`   - Is Valid: ${verification.isValid}`);
    console.log(`   - Confidence Level: ${verification.confidenceLevel}`);
    console.log(`   - Errors: ${verification.errors.length === 0 ? 'None' : verification.errors.join(', ')}`);

    if (verification.isValid) {
      console.log('✅ Certificate verification passed');
    } else {
      console.log('❌ Certificate verification failed');
    }

    // Test 4: Update Certificate
    console.log('\n🔬 Test 4: Updating certificate...');
    const newEvent = {
      eventId: 'EVT-001',
      certificateId: certificate.id,
      eventType: 'PROCESSING',
      participantId: 'PROCESSOR-001',
      location: {
        latitude: 28.6150,
        longitude: 77.2100,
        accuracy: 5,
        timestamp: new Date()
      },
      timestamp: new Date(),
      eventData: { processType: 'washing' },
      digitalSignature: 'signature-placeholder'
    };

    const update = {
      supplyChainEvents: [newEvent],
      updatedBy: 'test-user',
      updateReason: 'Adding processing event'
    };

    const updated = await certificateService.updateCertificate(certificate.id, update);
    
    console.log(`✅ Certificate updated successfully`);
    console.log(`   - Supply Chain Events: ${updated.supplyChainEvents.length}`);
    console.log(`   - Updated At: ${updated.updatedAt.toISOString()}`);

    // Test 5: Search Certificates
    console.log('\n🔬 Test 5: Searching certificates...');
    const searchCriteria = {
      farmerId: 'FARMER-123',
      cropType: 'Tomato'
    };

    const searchResults = await certificateService.searchCertificates(searchCriteria);
    
    console.log(`✅ Search completed - Found ${searchResults.length} certificates`);
    if (searchResults.length > 0) {
      console.log(`   - Top result relevance score: ${searchResults[0].relevanceScore}`);
      console.log(`   - Matched criteria: ${searchResults[0].matchedCriteria.join(', ')}`);
    }

    // Test 6: Get Statistics
    console.log('\n🔬 Test 6: Getting statistics...');
    const stats = certificateService.getStatistics();
    
    console.log(`✅ Statistics retrieved:`);
    console.log(`   - Total Certificates: ${stats.totalCertificates}`);
    console.log(`   - Certificates by Crop Type: ${JSON.stringify(stats.certificatesByCropType)}`);
    console.log(`   - Average Supply Chain Events: ${stats.averageSupplyChainEvents}`);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testCertificateService().catch(console.error);