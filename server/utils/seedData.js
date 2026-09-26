import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Property from '../models/Property.js';
import Tenancy from '../models/Tenancy.js';
import Invitation from '../models/Invitation.js';
import Inspection from '../models/Inspection.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Payment from '../models/Payment.js';
import Deposit from '../models/Deposit.js';
import Document from '../models/Document.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import Report from '../models/Report.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const sampleImages = {
  property: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  ],
  livingRoomBefore: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
  livingRoomAfter: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  bedroomBefore: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  bedroomAfter: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  kitchenBefore: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  kitchenAfter: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
  bathroomBefore: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  bathroomAfter: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
  plumbingBefore: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
  plumbingAfter: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('No MONGODB_URI found in environment.');
      process.exit(1);
    }

    console.log('[RentalProof Seeder] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[RentalProof Seeder] Connected successfully.');

    console.log('[RentalProof Seeder] Clearing existing records...');
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Tenancy.deleteMany({}),
      Invitation.deleteMany({}),
      Inspection.deleteMany({}),
      MaintenanceRequest.deleteMany({}),
      Payment.deleteMany({}),
      Deposit.deleteMany({}),
      Document.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log('[RentalProof Seeder] Creating Demo Users...');
    // Demo password for all: Password123!
    const landlord = await User.create({
      name: 'Demo Landlord',
      email: 'landlord@rentalproof.com',
      phone: '+91 98765 43210',
      password: 'Password123!',
      role: 'landlord',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    });

    const tenant = await User.create({
      name: 'Demo Tenant',
      email: 'tenant@rentalproof.com',
      phone: '+91 98765 12345',
      password: 'Password123!',
      role: 'tenant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    });

    const serviceProvider = await User.create({
      name: 'Demo Service Provider',
      email: 'service@rentalproof.com',
      phone: '+91 98765 67890',
      password: 'Password123!',
      role: 'service_provider',
      avatar: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=256&q=80',
    });

    const admin = await User.create({
      name: 'Demo Admin',
      email: 'admin@rentalproof.com',
      phone: '+91 98765 99999',
      password: 'Password123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    });

    console.log('[RentalProof Seeder] Creating Properties...');
    const property1 = await Property.create({
      title: 'Green Valley Apartments, Unit 402',
      description:
        'Spacious, naturally lit 2 BHK flat situated on the 4th floor with panoramic garden views, modular kitchen, and modern bathroom fittings.',
      address: '402 Palm Grove Enclave, Ring Road',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      pincode: '522002',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1250,
      rentAmount: 15000,
      depositAmount: 30000,
      amenities: ['Covered Parking', 'Elevator', '24/7 Water Supply', 'Security Guard', 'Power Backup', 'Gymnasium'],
      images: sampleImages.property,
      status: 'Occupied',
      landlord: landlord._id,
      checklist: [
        {
          category: 'Living Room',
          items: ['Walls & Paint', 'Flooring & Baseboards', 'Windows & Blinds', 'Main Door & Lock', 'Lighting & Ceiling Fan'],
        },
        {
          category: 'Master Bedroom',
          items: ['Walls & Ceiling', 'Flooring', 'Wardrobe & Closets', 'Air Conditioner', 'Window Fixtures'],
        },
        {
          category: 'Modular Kitchen',
          items: ['Granite Countertop', 'Sink & Faucet', 'Modular Cabinets', 'Exhaust Fan / Chimney', 'Wall Tiles & Grouting'],
        },
        {
          category: 'Master Bathroom',
          items: ['Washbasin & Mixer Tap', 'Toilet Commode & Jet Spray', 'Shower & Mixer', 'Geyser / Water Heater', 'Tiles & Grout'],
        },
      ],
    });

    const property2 = await Property.create({
      title: 'Sunrise Enclave Villa #14',
      description: 'Independent 3 BHK duplex luxury villa with private lawn, solar heating, and covered double garage.',
      address: 'Villa 14, Sunrise Boulevard, Pattabhipuram',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      pincode: '522006',
      propertyType: 'Villa',
      bedrooms: 3,
      bathrooms: 3,
      areaSqFt: 2100,
      rentAmount: 32000,
      depositAmount: 65000,
      amenities: ['Private Garden', 'Double Carport', 'Solar Water Heater', 'Clubhouse Access', 'CCTV Security'],
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      ],
      status: 'Available',
      landlord: landlord._id,
    });

    console.log('[RentalProof Seeder] Creating Tenancy Agreement...');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5); // 5 months ago
    const expectedEndDate = new Date(startDate);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + 11); // 11-month lease

    const tenancy = await Tenancy.create({
      property: property1._id,
      landlord: landlord._id,
      tenant: tenant._id,
      startDate,
      expectedEndDate,
      monthlyRent: 15000,
      securityDeposit: 30000,
      status: 'Active',
      notes: 'Initial 11-month agreement. Maintenance fee included in monthly rent.',
    });

    console.log('[RentalProof Seeder] Creating Move-In Inspection baseline...');
    const moveInInspection = await Inspection.create({
      property: property1._id,
      tenancy: tenancy._id,
      type: 'Move-In',
      inspector: landlord._id,
      status: 'Completed',
      inspectionDate: startDate,
      tenantAcknowledged: true,
      tenantSignedAt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000),
      tenantNotes: 'Verified all baseline fixtures and photos upon receiving keys. Looks clean and functional.',
      overallNotes: 'Premises handed over in pristine condition. All appliances functioning smoothly.',
      items: [
        {
          category: 'Living Room',
          item: 'Walls & Paint',
          condition: 'Excellent',
          notes: 'Fresh coat of paint; no scuffs or marks.',
          photos: [sampleImages.livingRoomBefore],
          attentionLevel: 'No Significant Change',
        },
        {
          category: 'Living Room',
          item: 'Flooring & Baseboards',
          condition: 'Good',
          notes: 'Vitrified tiles in good condition with clean grout.',
          photos: [sampleImages.livingRoomBefore],
          attentionLevel: 'No Significant Change',
        },
        {
          category: 'Master Bedroom',
          item: 'Air Conditioner',
          condition: 'Good',
          notes: 'Split AC tested; cooling is fast and remote is operational.',
          photos: [sampleImages.bedroomBefore],
          attentionLevel: 'No Significant Change',
        },
        {
          category: 'Modular Kitchen',
          item: 'Sink & Faucet',
          condition: 'Good',
          notes: 'Stainless steel sink clear and faucet handles smooth.',
          photos: [sampleImages.kitchenBefore],
          attentionLevel: 'No Significant Change',
        },
        {
          category: 'Master Bathroom',
          item: 'Washbasin & Mixer Tap',
          condition: 'Good',
          notes: 'Mixer tap intact with zero drip.',
          photos: [sampleImages.bathroomBefore],
          attentionLevel: 'No Significant Change',
        },
      ],
    });

    console.log('[RentalProof Seeder] Creating Move-Out Inspection (Comparison Data)...');
    const moveOutDate = new Date();
    const moveOutInspection = await Inspection.create({
      property: property1._id,
      tenancy: tenancy._id,
      type: 'Move-Out',
      inspector: landlord._id,
      status: 'Completed',
      inspectionDate: moveOutDate,
      referenceMoveInInspection: moveInInspection._id,
      tenantAcknowledged: false,
      overallNotes: 'Move-out walkthrough conducted. Minor surface changes recorded for transparency.',
      items: [
        {
          category: 'Living Room',
          item: 'Walls & Paint',
          condition: 'Fair',
          notes: 'Visible picture frame nail holes and slight sofa scuff marks on north wall.',
          photos: [sampleImages.livingRoomAfter],
          referenceMoveInItemId: moveInInspection.items[0]._id,
          attentionLevel: 'Possible Change',
          aiObservation: {
            changeDetected: true,
            confidence: 0.84,
            observations: [
              'Localized surface discoloration detected along lower drywall.',
              'Texture contrast variance consistent with furniture contact or hanging mounts.',
            ],
            requiresManualReview: true,
          },
        },
        {
          category: 'Living Room',
          item: 'Flooring & Baseboards',
          condition: 'Good',
          notes: 'No cracked tiles; standard wear and tear.',
          photos: [sampleImages.livingRoomAfter],
          referenceMoveInItemId: moveInInspection.items[1]._id,
          attentionLevel: 'No Significant Change',
          aiObservation: {
            changeDetected: false,
            confidence: 0.91,
            observations: ['Flooring alignment and color balance consistent with baseline capture.'],
            requiresManualReview: true,
          },
        },
        {
          category: 'Master Bedroom',
          item: 'Air Conditioner',
          condition: 'Good',
          notes: 'Operational and clean filter.',
          photos: [sampleImages.bedroomAfter],
          referenceMoveInItemId: moveInInspection.items[2]._id,
          attentionLevel: 'No Significant Change',
          aiObservation: {
            changeDetected: false,
            confidence: 0.88,
            observations: ['Fixture housing intact and no visual alterations identified.'],
            requiresManualReview: true,
          },
        },
        {
          category: 'Modular Kitchen',
          item: 'Sink & Faucet',
          condition: 'Fair',
          notes: 'Mineral deposits around faucet base; slight spout stiffness.',
          photos: [sampleImages.kitchenAfter],
          referenceMoveInItemId: moveInInspection.items[3]._id,
          attentionLevel: 'Possible Change',
          aiObservation: {
            changeDetected: true,
            confidence: 0.79,
            observations: ['Sheen reduction and surface mineral spotting observed around basin perimeter.'],
            requiresManualReview: true,
          },
        },
        {
          category: 'Master Bathroom',
          item: 'Washbasin & Mixer Tap',
          condition: 'Needs Attention',
          notes: 'Valve cartridge experienced leak during tenancy, repaired via maintenance ticket #M-101.',
          photos: [sampleImages.bathroomAfter],
          referenceMoveInItemId: moveInInspection.items[4]._id,
          attentionLevel: 'Possible Change',
          aiObservation: {
            changeDetected: true,
            confidence: 0.86,
            observations: [
              'Surface reflection indicates replacement hardware or seal adjustments.',
              'No structural damage identified.',
            ],
            requiresManualReview: true,
          },
        },
      ],
    });

    console.log('[RentalProof Seeder] Creating Maintenance Request & Visual Timeline...');
    const maintDate = new Date(startDate);
    maintDate.setDate(maintDate.getDate() + 45); // 45 days into tenancy

    const maintenance = await MaintenanceRequest.create({
      property: property1._id,
      tenancy: tenancy._id,
      reportedBy: tenant._id,
      assignedTo: serviceProvider._id,
      title: 'Master Bathroom Mixer Tap Dripping',
      description:
        'The hot/cold mixer faucet in the master bath drips continuously when shut off, causing water pooling on the basin deck.',
      category: 'Plumbing',
      priority: 'Medium',
      status: 'Completed',
      room: 'Master Bathroom',
      photos: [sampleImages.plumbingBefore],
      completionPhotos: [sampleImages.plumbingAfter],
      completionNotes:
        'Replaced 35mm ceramic disc cartridge and renewed Teflon seals. Tested at 3.5 bar water pressure with zero leakage.',
      costEstimate: 1500,
      actualCost: 1200,
      timeline: [
        {
          status: 'Reported',
          note: 'Tenant submitted ticket with photo evidence of dripping tap.',
          updatedBy: tenant._id,
          timestamp: maintDate,
        },
        {
          status: 'Reviewed',
          note: 'Landlord verified request and scheduled plumbing technician inspection.',
          updatedBy: landlord._id,
          timestamp: new Date(maintDate.getTime() + 18 * 60 * 60 * 1000),
        },
        {
          status: 'Assigned',
          note: 'Assigned to Apex Plumbing Services (Demo Service Provider).',
          updatedBy: landlord._id,
          timestamp: new Date(maintDate.getTime() + 24 * 60 * 60 * 1000),
        },
        {
          status: 'In Progress',
          note: 'Technician on-site, disassembled mixer body and procured genuine Kohler replacement cartridge.',
          updatedBy: serviceProvider._id,
          timestamp: new Date(maintDate.getTime() + 48 * 60 * 60 * 1000),
        },
        {
          status: 'Completed',
          note: 'Replacement fitted and pressure tested. Uploaded completion photo proof.',
          updatedBy: serviceProvider._id,
          timestamp: new Date(maintDate.getTime() + 52 * 60 * 60 * 1000),
        },
      ],
    });

    console.log('[RentalProof Seeder] Creating Payment History (5 months of rent)...');
    const paymentMonths = ['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026'];
    for (let i = 0; i < paymentMonths.length; i++) {
      const pDate = new Date(startDate);
      pDate.setMonth(pDate.getMonth() + i);
      pDate.setDate(3);

      await Payment.create({
        tenancy: tenancy._id,
        property: property1._id,
        tenant: tenant._id,
        landlord: landlord._id,
        amount: 15000,
        month: paymentMonths[i],
        year: pDate.getFullYear(),
        dueDate: new Date(pDate.getFullYear(), pDate.getMonth(), 5),
        paymentDate: pDate,
        paymentMethod: i % 2 === 0 ? 'UPI' : 'Bank Transfer',
        status: 'Paid',
        referenceNumber: `UPI-2026-${1000 + i * 142}`,
        notes: `Rent payment for ${paymentMonths[i]} confirmed via online banking.`,
      });
    }

    console.log('[RentalProof Seeder] Creating Deposit Ledger & Linked Deductions...');
    await Deposit.create({
      tenancy: tenancy._id,
      property: property1._id,
      landlord: landlord._id,
      tenant: tenant._id,
      originalDeposit: 30000,
      deductions: [
        {
          reason: 'Bathroom mixer cartridge replacement & plumbing labor',
          amount: 1200,
          date: new Date(maintDate.getTime() + 54 * 60 * 60 * 1000),
          relatedMaintenanceId: maintenance._id,
          relatedInspectionId: moveOutInspection._id,
          notes: '50% landlord/tenant split for plumbing hardware wear; recorded ₹1,200 as per maintenance ticket.',
          recordedBy: landlord._id,
        },
      ],
      recordedBalance: 28800,
      disclaimer: 'Recorded calculation only — does not constitute a legal determination of liability.',
    });

    console.log('[RentalProof Seeder] Creating Digital Documents...');
    await Document.create([
      {
        name: 'Residential Lease Agreement - Green Valley 402.pdf',
        category: 'Rental Agreement',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 340,
        uploadedBy: landlord._id,
        property: property1._id,
        tenancy: tenancy._id,
      },
      {
        name: 'Move-In Baseline Inspection Signed Report.pdf',
        category: 'Inspection Report',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 512,
        uploadedBy: landlord._id,
        property: property1._id,
        tenancy: tenancy._id,
      },
      {
        name: 'Plumbing Service Tax Invoice #AP-9042.pdf',
        category: 'Maintenance Receipt',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 128,
        uploadedBy: serviceProvider._id,
        property: property1._id,
        tenancy: tenancy._id,
      },
    ]);

    console.log('[RentalProof Seeder] Creating In-App Notifications...');
    await Notification.create([
      {
        recipient: landlord._id,
        title: 'Move-Out Inspection Recorded',
        message: 'Move-Out condition comparison is ready for Green Valley Apartments #402.',
        type: 'move_out',
        relatedEntityId: moveOutInspection._id,
        entityType: 'Inspection',
        isRead: false,
      },
      {
        recipient: tenant._id,
        title: 'Maintenance Completed',
        message: 'Your plumbing request for Bathroom Mixer Tap has been completed by Apex Plumbing Services.',
        type: 'maintenance',
        relatedEntityId: maintenance._id,
        entityType: 'MaintenanceRequest',
        isRead: false,
      },
      {
        recipient: landlord._id,
        title: 'Rent Received',
        message: '₹15,000 rent payment for September 2026 recorded from Demo Tenant.',
        type: 'payment',
        relatedEntityId: property1._id,
        entityType: 'Property',
        isRead: true,
      },
    ]);

    console.log('[RentalProof Seeder] Creating Initial Audit Log trail...');
    const auditEntries = [
      {
        user: landlord._id,
        action: 'Property Created',
        entity: 'Property',
        entityId: property1._id,
        description: 'Landlord listed "Green Valley Apartments, Unit 402" in system',
        createdAt: startDate,
      },
      {
        user: landlord._id,
        action: 'Tenancy Created',
        entity: 'Tenancy',
        entityId: tenancy._id,
        description: 'Tenancy agreement created for Demo Tenant (Rent: ₹15,000, Deposit: ₹30,000)',
        createdAt: startDate,
      },
      {
        user: landlord._id,
        action: 'Move-In Inspection Completed',
        entity: 'Inspection',
        entityId: moveInInspection._id,
        description: 'Conducted Move-In baseline inspection with 5 photo-verified items',
        createdAt: startDate,
      },
      {
        user: tenant._id,
        action: 'Inspection Acknowledged',
        entity: 'Inspection',
        entityId: moveInInspection._id,
        description: 'Tenant verified baseline condition report and digitally signed',
        createdAt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000),
      },
      {
        user: tenant._id,
        action: 'Maintenance Request Created',
        entity: 'Maintenance',
        entityId: maintenance._id,
        description: 'Reported leaking bathroom tap in master bath',
        createdAt: maintDate,
      },
      {
        user: serviceProvider._id,
        action: 'Maintenance Completed',
        entity: 'Maintenance',
        entityId: maintenance._id,
        description: 'Service technician replaced cartridge and uploaded verification photo',
        createdAt: new Date(maintDate.getTime() + 52 * 60 * 60 * 1000),
      },
      {
        user: landlord._id,
        action: 'Move-Out Inspection Completed',
        entity: 'Inspection',
        entityId: moveOutInspection._id,
        description: 'Move-Out walkthrough logged and paired with Move-In baseline',
        createdAt: moveOutDate,
      },
      {
        user: landlord._id,
        action: 'Deposit Deduction Recorded',
        entity: 'Deposit',
        entityId: tenancy._id,
        description: 'Recorded ₹1,200 deduction for plumbing repair parts',
        createdAt: new Date(maintDate.getTime() + 54 * 60 * 60 * 1000),
      },
    ];

    for (const entry of auditEntries) {
      await AuditLog.create(entry);
    }

    console.log('========================================================');
    console.log('[RentalProof Seeder] ✅ DEMO DATA POPULATED SUCCESSFULLY!');
    console.log('========================================================');
    console.log('Demo Credentials for Testing:');
    console.log('1. Landlord:         landlord@rentalproof.com  / Password123!');
    console.log('2. Tenant:           tenant@rentalproof.com    / Password123!');
    console.log('3. Service Provider: service@rentalproof.com   / Password123!');
    console.log('4. Admin:            admin@rentalproof.com     / Password123!');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[RentalProof Seeder] Error seeding data:', error);
    process.exit(1);
  }
};

seed();
