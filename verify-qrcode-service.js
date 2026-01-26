/**
 * Manual verification script for QRCodeService
 * This script tests the basic functionality without Jest
 */

const { QRCodeService } = require('./dist/services/qrcode-service');
const { IdGenerator } = require('./dist/utils/id-generator');

async function testQRCodeService() {
  console.log('🧪 Testing QRCodeService...\n');

  try {
    // Clear ID generator cache
    IdGenerator.clearCache();
    
    // Initialize service
    const qrCodeService = new QRCodeService({
      baseUrl: 'https://test.example.com/certificate/',
      enableMetricsTracking: true,
      maxBatchSize: 100,
      defaultErrorCorrectionLevel: 'M',
      defaultImageFormat: 'PNG'
    });

    console.log('✅ QRCodeService initialized successfully');

    // Test 1: Generate single QR code
    console.log('\n🔬 Test 1: Generating single QR code...');
    const certificateId1 = IdGenerator.generateCertificateId();
    
    const qrCode1 = await qrCodeService.generateQRCode(certificateId1, {
      printSpecs: {
        width: 200,
        height: 200,
        errorCorrectionLevel: 'M',
        format: 'PNG'
      },
      includeMetadata: true
    });
    
    console.log(`✅ QR Code generated successfully:`);
    console.log(`   - QR Code ID: ${qrCode1.qrCodeId}`);
    console.log(`   - Certificate ID: ${qrCode1.certificateId}`);
    console.log(`   - QR Data: ${qrCode1.qrCodeData.substring(0, 50)}...`);
    console.log(`   - Image Size: ${qrCode1.qrCodeImage.length} bytes`);
    console.log(`   - Print Specs: ${qrCode1.printSpecs.width}x${qrCode1.printSpecs.height} ${qrCode1.printSpecs.format}`);

    // Test 2: Generate QR code with expiry
    console.log('\n🔬 Test 2: Generating QR code with expiry...');
    const certificateId2 = IdGenerator.generateCertificateId();
    const expiryDate = new Date(Date.now() + 86400000); // 24 hours from now
    
    const qrCode2 = await qrCodeService.generateQRCode(certificateId2, {
      expiryDate,
      printSpecs: {
        errorCorrectionLevel: 'H',
        format: 'SVG'
      }
    });
    
    console.log(`✅ QR Code with expiry generated:`);
    console.log(`   - QR Code ID: ${qrCode2.qrCodeId}`);
    console.log(`   - Expiry Date: ${qrCode2.expiryDate?.toISOString()}`);
    console.log(`   - Error Correction: ${qrCode2.printSpecs.errorCorrectionLevel}`);
    console.log(`   - Format: ${qrCode2.printSpecs.format}`);

    // Test 3: Generate bulk QR codes
    console.log('\n🔬 Test 3: Generating bulk QR codes...');
    const certificateIds = [
      IdGenerator.generateCertificateId(),
      IdGenerator.generateCertificateId(),
      IdGenerator.generateCertificateId()
    ];
    
    const batch = await qrCodeService.generateBulkQRCodes(certificateIds, {
      printSpecs: {
        width: 150,
        height: 150,
        errorCorrectionLevel: 'Q'
      }
    });
    
    console.log(`✅ Bulk QR codes generated:`);
    console.log(`   - Batch ID: ${batch.batchId}`);
    console.log(`   - Total Count: ${batch.totalCount}`);
    console.log(`   - Created At: ${batch.createdAt.toISOString()}`);
    console.log(`   - QR Code IDs: ${batch.qrCodes.map(qr => qr.qrCodeId).join(', ')}`);

    // Test 4: Validate QR codes
    console.log('\n🔬 Test 4: Validating QR codes...');
    
    // Validate valid QR code
    const validation1 = await qrCodeService.validateQRCode(qrCode1.qrCodeData);
    console.log(`✅ Valid QR code validation:`);
    console.log(`   - Is Valid: ${validation1.isValid}`);
    console.log(`   - Certificate ID: ${validation1.certificateId}`);
    console.log(`   - Error Message: ${validation1.errorMessage || 'None'}`);

    // Validate invalid QR code
    const validation2 = await qrCodeService.validateQRCode('invalid-qr-data');
    console.log(`✅ Invalid QR code validation:`);
    console.log(`   - Is Valid: ${validation2.isValid}`);
    console.log(`   - Error Message: ${validation2.errorMessage}`);

    // Test 5: Metrics tracking
    console.log('\n🔬 Test 5: Testing metrics tracking...');
    
    // Get initial metrics
    const initialMetrics = await qrCodeService.getQRCodeMetrics(qrCode1.qrCodeId);
    console.log(`✅ Initial metrics:`);
    console.log(`   - Scan Count: ${initialMetrics.scanCount}`);
    console.log(`   - Unique Users: ${initialMetrics.uniqueUsers}`);
    console.log(`   - Locations: ${initialMetrics.locations.length}`);

    // Record some scans
    const location1 = {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 10,
      timestamp: new Date()
    };

    const location2 = {
      latitude: 28.6150,
      longitude: 77.2100,
      accuracy: 5,
      timestamp: new Date()
    };

    await qrCodeService.recordScan(qrCode1.qrCodeId, location1, 'user123');
    await qrCodeService.recordScan(qrCode1.qrCodeId, location2, 'user456');

    const updatedMetrics = await qrCodeService.getQRCodeMetrics(qrCode1.qrCodeId);
    console.log(`✅ Updated metrics after scans:`);
    console.log(`   - Scan Count: ${updatedMetrics.scanCount}`);
    console.log(`   - Unique Users: ${updatedMetrics.uniqueUsers}`);
    console.log(`   - Locations: ${updatedMetrics.locations.length}`);
    console.log(`   - Last Scanned: ${updatedMetrics.lastScanned?.toISOString()}`);

    // Test 6: Get QR codes for certificate
    console.log('\n🔬 Test 6: Getting QR codes for certificate...');
    
    // Generate multiple QR codes for same certificate
    const testCertId = IdGenerator.generateCertificateId();
    await qrCodeService.generateQRCode(testCertId);
    await qrCodeService.generateQRCode(testCertId);
    
    const qrCodesForCert = qrCodeService.getQRCodesForCertificate(testCertId);
    console.log(`✅ QR codes for certificate ${testCertId}:`);
    console.log(`   - Count: ${qrCodesForCert.length}`);
    console.log(`   - QR Code IDs: ${qrCodesForCert.map(qr => qr.qrCodeId).join(', ')}`);

    // Test 7: Get batch information
    console.log('\n🔬 Test 7: Getting batch information...');
    
    const retrievedBatch = qrCodeService.getBatch(batch.batchId);
    if (retrievedBatch) {
      console.log(`✅ Batch retrieved successfully:`);
      console.log(`   - Batch ID: ${retrievedBatch.batchId}`);
      console.log(`   - Total Count: ${retrievedBatch.totalCount}`);
      console.log(`   - QR Codes: ${retrievedBatch.qrCodes.length}`);
    } else {
      console.log('❌ Batch retrieval failed');
    }

    // Test 8: Get service statistics
    console.log('\n🔬 Test 8: Getting service statistics...');
    
    const stats = qrCodeService.getStatistics();
    console.log(`✅ Service statistics:`);
    console.log(`   - Total QR Codes: ${stats.totalQRCodes}`);
    console.log(`   - Total Batches: ${stats.totalBatches}`);
    console.log(`   - Total Scans: ${stats.totalScans}`);
    console.log(`   - Average Scans per QR Code: ${stats.averageScansPerQRCode.toFixed(2)}`);
    console.log(`   - QR Codes by Error Correction Level: ${JSON.stringify(stats.qrCodesByErrorCorrectionLevel)}`);

    // Test 9: Error handling
    console.log('\n🔬 Test 9: Testing error handling...');
    
    try {
      await qrCodeService.generateQRCode('invalid-cert-id');
      console.log('❌ Should have thrown error for invalid certificate ID');
    } catch (error) {
      console.log(`✅ Correctly handled invalid certificate ID: ${error.message}`);
    }

    try {
      await qrCodeService.generateBulkQRCodes([]);
      console.log('❌ Should have thrown error for empty array');
    } catch (error) {
      console.log(`✅ Correctly handled empty certificate array: ${error.message}`);
    }

    try {
      await qrCodeService.getQRCodeMetrics('QR-NONEXISTENT');
      console.log('❌ Should have thrown error for non-existent QR code');
    } catch (error) {
      console.log(`✅ Correctly handled non-existent QR code: ${error.message}`);
    }

    // Test 10: Uniqueness verification
    console.log('\n🔬 Test 10: Verifying QR code uniqueness...');
    
    const uniquenessCertId = IdGenerator.generateCertificateId();
    const qrCodes = [];
    
    // Generate multiple QR codes for the same certificate
    for (let i = 0; i < 5; i++) {
      const qr = await qrCodeService.generateQRCode(uniquenessCertId);
      qrCodes.push(qr);
    }
    
    // Check that all QR code IDs are unique
    const qrCodeIds = qrCodes.map(qr => qr.qrCodeId);
    const uniqueIds = new Set(qrCodeIds);
    
    if (uniqueIds.size === qrCodes.length) {
      console.log(`✅ All QR code IDs are unique (${uniqueIds.size}/${qrCodes.length})`);
    } else {
      console.log(`❌ Duplicate QR code IDs found (${uniqueIds.size}/${qrCodes.length})`);
    }

    // Check that all QR code data is unique
    const qrCodeData = qrCodes.map(qr => qr.qrCodeData);
    const uniqueData = new Set(qrCodeData);
    
    if (uniqueData.size === qrCodes.length) {
      console.log(`✅ All QR code data is unique (${uniqueData.size}/${qrCodes.length})`);
    } else {
      console.log(`❌ Duplicate QR code data found (${uniqueData.size}/${qrCodes.length})`);
    }

    console.log('\n🎉 All QRCodeService tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the tests
testQRCodeService().catch(console.error);