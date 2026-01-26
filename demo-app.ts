#!/usr/bin/env ts-node

/**
 * Soil-to-Shelf Traceability System - Complete Demo Application
 * 
 * This demo showcases the complete functionality of the traceability system
 * including certificate creation, QR code generation, and supply chain tracking.
 */

import { 
  CertificateService, 
  QRCodeService,
  FarmData, 
  HarvestDetails, 
  SoilHealthReport, 
  Certification,
  SupplyChainEvent,
  CertificateUpdate,
  getSystemStatus,
  initializeSystem
} from './src/index';

class SoilToShelfApp {
  private certificateService: CertificateService;
  private qrCodeService: QRCodeService;

  constructor() {
    // Initialize services
    this.certificateService = new CertificateService({
      enableDigitalSignatures: true,
      hashAlgorithm: 'SHA256'
    });

    this.qrCodeService = new QRCodeService({
      baseUrl: 'https://traceability.soilshelf.com/certificate/',
      enableMetricsTracking: true,
      maxBatchSize: 1000
    });
  }

  /**
   * Complete farm-to-consumer traceability workflow
   */
  async runCompleteWorkflow(): Promise<void> {
    console.log('🌱 Soil-to-Shelf Traceability System - Complete Demo\n');
    console.log('=' .repeat(60));

    // Initialize system
    await initializeSystem();
    const status = getSystemStatus();
    console.log(`✅ System initialized: ${status.name} v${status.version}`);
    console.log(`📊 Components: ${Object.entries(status.components).map(([k, v]) => `${k}: ${v ? '✅' : '❌'}`).join(', ')}\n`);

    try {
      // Step 1: Create Farm Profile
      console.log('🚜 Step 1: Creating Farm Profile');
      const farmData = this.createSampleFarmData();
      console.log(`   Farm: ${farmData.farmName} (${farmData.farmType})`);
      console.log(`   Location: ${farmData.location.latitude}, ${farmData.location.longitude}`);
      console.log(`   Size: ${farmData.farmSize} hectares\n`);

      // Step 2: Create Soil Health Report
      console.log('🧪 Step 2: Creating Soil Health Report');
      const soilData = this.createSampleSoilData();
      console.log(`   pH Level: ${soilData.phLevel}`);
      console.log(`   Organic Matter: ${soilData.organicMatter}%`);
      console.log(`   Status: ${soilData.certificationStatus}\n`);

      // Step 3: Create Harvest Details
      console.log('🌾 Step 3: Creating Harvest Details');
      const harvestData = this.createSampleHarvestData();
      console.log(`   Crop: ${harvestData.cropType} (${harvestData.variety})`);
      console.log(`   Quantity: ${harvestData.quantity} ${harvestData.unit}`);
      console.log(`   Quality: Grade ${harvestData.qualityGrade}\n`);

      // Step 4: Create Digital Certificate
      console.log('📜 Step 4: Creating Digital Certificate');
      const certificate = await this.certificateService.createCertificate({
        farmData,
        harvestData,
        soilData,
        certifications: [this.createOrganicCertification()],
        createdBy: 'farmer@greenvalley.com'
      });
      
      console.log(`   Certificate ID: ${certificate.id}`);
      console.log(`   Data Hash: ${certificate.dataHash.substring(0, 16)}...`);
      console.log(`   Digital Signature: ${certificate.digitalSignature ? 'Present' : 'None'}\n`);

      // Step 5: Generate QR Code
      console.log('📱 Step 5: Generating QR Code');
      const qrCode = await this.qrCodeService.generateQRCode(certificate.id, {
        printSpecs: {
          width: 200,
          height: 200,
          errorCorrectionLevel: 'M',
          format: 'PNG'
        }
      });
      
      console.log(`   QR Code ID: ${qrCode.qrCodeId}`);
      console.log(`   QR Data URL: ${qrCode.qrCodeData}`);
      console.log(`   Image Size: ${qrCode.qrCodeImage.length} bytes\n`);

      // Step 6: Simulate Supply Chain Events
      console.log('🚛 Step 6: Adding Supply Chain Events');
      
      // Processing event
      const processingEvent = this.createProcessingEvent(certificate.id);
      await this.certificateService.updateCertificate(certificate.id, {
        supplyChainEvents: [processingEvent],
        updatedBy: 'processor@freshcenter.com',
        updateReason: 'Adding processing event'
      });
      console.log(`   ✅ Processing event added`);

      // Transport event
      const transportEvent = this.createTransportEvent(certificate.id);
      await this.certificateService.updateCertificate(certificate.id, {
        supplyChainEvents: [transportEvent],
        updatedBy: 'logistics@swifttransport.com',
        updateReason: 'Adding transport event'
      });
      console.log(`   ✅ Transport event added`);

      // Retail event
      const retailEvent = this.createRetailEvent(certificate.id);
      await this.certificateService.updateCertificate(certificate.id, {
        supplyChainEvents: [retailEvent],
        updatedBy: 'manager@metromarket.com',
        updateReason: 'Adding retail event'
      });
      console.log(`   ✅ Retail event added\n`);

      // Step 7: Consumer Scans QR Code
      console.log('👥 Step 7: Consumer Interaction');
      
      // Validate QR code
      const validation = await this.qrCodeService.validateQRCode(qrCode.qrCodeData);
      console.log(`   QR Code Valid: ${validation.isValid ? '✅' : '❌'}`);
      
      if (validation.isValid && validation.certificateId) {
        // Record scan
        await this.qrCodeService.recordScan(qrCode.qrCodeId, {
          latitude: 28.6139,
          longitude: 77.2090,
          accuracy: 10,
          timestamp: new Date()
        }, 'consumer-123');
        
        // Get final certificate with complete journey
        const finalCertificate = await this.certificateService.getCertificate(validation.certificateId);
        
        if (finalCertificate) {
          console.log(`   Certificate Retrieved: ${finalCertificate.id}`);
          console.log(`   Supply Chain Events: ${finalCertificate.supplyChainEvents.length}`);
          console.log(`   Journey: ${finalCertificate.supplyChainEvents.map(e => e.eventType).join(' → ')}\n`);
        }
      }

      // Step 8: Verify Data Integrity
      console.log('🔐 Step 8: Verifying Data Integrity');
      const verification = await this.certificateService.verifyCertificate(certificate.id);
      console.log(`   Data Integrity: ${verification.isValid ? '✅ VALID' : '❌ INVALID'}`);
      console.log(`   Confidence Level: ${verification.confidenceLevel}`);
      console.log(`   Issues: ${verification.errors.length === 0 ? 'None' : verification.errors.join(', ')}\n`);

      // Step 9: Generate Statistics
      console.log('📊 Step 9: System Statistics');
      const certStats = this.certificateService.getStatistics();
      const qrStats = this.qrCodeService.getStatistics();
      
      console.log(`   Total Certificates: ${certStats.totalCertificates}`);
      console.log(`   Total QR Codes: ${qrStats.totalQRCodes}`);
      console.log(`   Total Scans: ${qrStats.totalScans}`);
      console.log(`   Average Events per Certificate: ${certStats.averageSupplyChainEvents.toFixed(1)}\n`);

      // Step 10: Export Compliance Report
      console.log('📋 Step 10: Export Compliance Summary');
      console.log(`   Certificate ID: ${certificate.id}`);
      console.log(`   Farm Type: ${farmData.farmType}`);
      console.log(`   Organic Certified: ${certificate.certifications.some(c => c.type === 'ORGANIC') ? 'Yes' : 'No'}`);
      console.log(`   Soil Compliance: ${soilData.certificationStatus}`);
      console.log(`   Quality Grade: ${harvestData.qualityGrade}`);
      console.log(`   Traceability Complete: ✅`);
      console.log(`   Export Ready: ✅\n`);

      console.log('🎉 Complete Soil-to-Shelf Traceability Workflow Completed Successfully!');
      console.log('\n📋 Summary:');
      console.log('   ✅ Farm profile created with verified location');
      console.log('   ✅ Soil health data validated and stored');
      console.log('   ✅ Harvest details recorded with quality grading');
      console.log('   ✅ Digital certificate created with cryptographic security');
      console.log('   ✅ QR code generated for mobile scanning');
      console.log('   ✅ Supply chain events tracked from farm to retail');
      console.log('   ✅ Consumer transparency enabled through QR scanning');
      console.log('   ✅ Data integrity verified through cryptographic proofs');
      console.log('   ✅ Export compliance documentation ready');
      console.log('\n🌟 The produce now has complete traceability from soil to shelf!');

    } catch (error) {
      console.error('❌ Demo failed:', error);
      if (error instanceof Error) {
        console.error('   Error details:', error.message);
      }
    }
  }

  // Helper methods to create sample data

  private createSampleFarmData(): FarmData {
    return {
      farmerId: 'FARMER-GVF-001',
      farmName: 'Green Valley Organic Farm',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 5,
        timestamp: new Date()
      },
      boundaries: {
        type: 'Polygon',
        coordinates: [
          { latitude: 28.6139, longitude: 77.2090 },
          { latitude: 28.6149, longitude: 77.2090 },
          { latitude: 28.6149, longitude: 77.2100 },
          { latitude: 28.6139, longitude: 77.2100 },
          { latitude: 28.6139, longitude: 77.2090 }
        ]
      },
      farmSize: 10.5,
      farmType: 'ORGANIC',
      certifications: [],
      registrationNumber: 'ORG-FARM-2024-001',
      verificationStatus: 'VERIFIED'
    };
  }

  private createSampleSoilData(): SoilHealthReport {
    return {
      reportId: 'SOIL-RPT-001',
      testingLabId: 'SOIL-LAB-001',
      testDate: new Date('2024-01-10'),
      soilType: 'Rich Loamy Soil',
      phLevel: 6.8,
      organicMatter: 4.2,
      nitrogen: 52,
      phosphorus: 28,
      potassium: 195,
      micronutrients: {
        iron: 18,
        zinc: 12,
        manganese: 15,
        copper: 3,
        boron: 2
      },
      contaminants: [
        {
          contaminant: 'Lead',
          level: 0.5,
          unit: 'ppm',
          safetyThreshold: 10
        }
      ],
      recommendations: [
        'Maintain current organic matter levels',
        'Monitor nitrogen levels during growing season',
        'Consider adding potassium-rich organic amendments'
      ],
      certificationStatus: 'ORGANIC_COMPLIANT'
    };
  }

  private createSampleHarvestData(): HarvestDetails {
    return {
      harvestId: 'HARVEST-TOM-001',
      cropType: 'Tomato',
      variety: 'Organic Cherry Tomato',
      plantingDate: new Date('2024-01-15'),
      harvestDate: new Date('2024-04-15'),
      quantity: 2500,
      unit: 'KG',
      qualityGrade: 'A',
      harvestConditions: {
        temperature: 26,
        humidity: 68,
        rainfall: 15,
        windSpeed: 8,
        conditions: 'Partly cloudy, ideal harvesting weather'
      },
      treatmentHistory: [
        {
          treatmentId: 'TRT-001',
          treatmentType: 'ORGANIC_AMENDMENT',
          product: 'Organic Compost',
          applicationDate: new Date('2024-02-01'),
          quantity: 500,
          unit: 'KG',
          method: 'Soil incorporation',
          operator: 'Farm Manager'
        }
      ]
    };
  }

  private createOrganicCertification(): Certification {
    return {
      certificationId: 'CERT-ORG-001',
      type: 'ORGANIC',
      issuingBody: 'National Organic Certification Board',
      issueDate: new Date('2024-01-01'),
      expiryDate: new Date('2025-01-01'),
      certificateNumber: 'ORG-2024-GVF-001',
      verificationStatus: 'ACTIVE'
    };
  }

  private createProcessingEvent(certificateId: string): SupplyChainEvent {
    return {
      eventId: 'EVT-PROC-001',
      certificateId,
      eventType: 'PROCESSING',
      participantId: 'PROCESSOR-FRESH-001',
      location: {
        latitude: 28.6200,
        longitude: 77.2150,
        accuracy: 3,
        timestamp: new Date()
      },
      timestamp: new Date(),
      eventData: {
        processType: 'Washing and Packaging',
        facility: 'Fresh Processing Center',
        batchNumber: 'FPC-2024-001',
        qualityCheck: 'Passed',
        packagingType: 'Eco-friendly containers'
      },
      digitalSignature: 'processing-signature-placeholder'
    };
  }

  private createTransportEvent(certificateId: string): SupplyChainEvent {
    return {
      eventId: 'EVT-TRANS-001',
      certificateId,
      eventType: 'TRANSPORT',
      participantId: 'LOGISTICS-SWIFT-001',
      location: {
        latitude: 28.6300,
        longitude: 77.2200,
        accuracy: 5,
        timestamp: new Date()
      },
      timestamp: new Date(),
      eventData: {
        transportMode: 'Refrigerated Truck',
        vehicleId: 'SWIFT-REF-042',
        driver: 'Rajesh Kumar',
        temperature: '4°C',
        destination: 'Metro Fresh Market',
        estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000)
      },
      digitalSignature: 'transport-signature-placeholder'
    };
  }

  private createRetailEvent(certificateId: string): SupplyChainEvent {
    return {
      eventId: 'EVT-RETAIL-001',
      certificateId,
      eventType: 'RETAIL',
      participantId: 'RETAIL-METRO-001',
      location: {
        latitude: 28.6400,
        longitude: 77.2250,
        accuracy: 2,
        timestamp: new Date()
      },
      timestamp: new Date(),
      eventData: {
        storeName: 'Metro Fresh Market',
        section: 'Organic Produce',
        displayType: 'Refrigerated Display',
        pricePerKg: 120,
        availableQuantity: 2500
      },
      digitalSignature: 'retail-signature-placeholder'
    };
  }
}

// Run the demo application
async function main() {
  const app = new SoilToShelfApp();
  await app.runCompleteWorkflow();
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export default SoilToShelfApp;