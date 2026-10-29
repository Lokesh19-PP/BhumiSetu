package in.bhumisetu.config;

import in.bhumisetu.domain.entity.*;
import in.bhumisetu.domain.enums.*;
import in.bhumisetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.WKTReader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final LandParcelRepository landParcelRepository;
    private final OwnershipRecordRepository ownershipRecordRepository;
    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final WKTReader wktReader = new WKTReader(geometryFactory);

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (departmentRepository.count() > 0 && landParcelRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial seeding.");
            return;
        }

        log.info("Starting Bhumisetu initial data seeding...");

        // 1. Seed Departments
        Department revenueDept = departmentRepository.save(Department.builder()
                .code("REVENUE")
                .name("Revenue & Land Records Department")
                .description("Responsible for 7/12 records, land titles, and agricultural to non-agricultural conversions.")
                .build());

        Department planningDept = departmentRepository.save(Department.builder()
                .code("PLANNING")
                .name("Town Planning & Municipal Sanctions")
                .description("Authority for building permissions, FSI sanctions, and structural approvals.")
                .build());

        Department treeDept = departmentRepository.save(Department.builder()
                .code("TREE")
                .name("Urban Forestry & Tree Authority")
                .description("Tree preservation, felling NOCs, and environmental compliance.")
                .build());

        Department utilityDept = departmentRepository.save(Department.builder()
                .code("UTILITY")
                .name("Water Supply & Public Utilities")
                .description("Municipal water supply, sewerage connections, and drainage infrastructure.")
                .build());

        // 2. Seed Users (password: Demo@123)
        String encodedPassword = passwordEncoder.encode("Demo@123");

        User citizen = userRepository.save(User.builder()
                .fullName("Ramesh Narayan Patil")
                .email("citizen@bhumisetu.in")
                .password(encodedPassword)
                .phone("+91 98220 12345")
                .role(Role.CITIZEN)
                .build());

        User revenueOfficer = userRepository.save(User.builder()
                .fullName("Santosh Jadhav (Tahsildar)")
                .email("revenue@bhumisetu.in")
                .password(encodedPassword)
                .phone("+91 98220 54321")
                .role(Role.REVENUE_OFFICER)
                .department(revenueDept)
                .build());

        User planningOfficer = userRepository.save(User.builder()
                .fullName("Neha Kulkarni (Town Planner)")
                .email("planning@bhumisetu.in")
                .password(encodedPassword)
                .phone("+91 98220 67890")
                .role(Role.PLANNING_OFFICER)
                .department(planningDept)
                .build());

        User treeOfficer = userRepository.save(User.builder()
                .fullName("Rajesh Shinde (Tree Officer)")
                .email("tree@bhumisetu.in")
                .password(encodedPassword)
                .phone("+91 98220 11223")
                .role(Role.TREE_OFFICER)
                .department(treeDept)
                .build());

        User utilityOfficer = userRepository.save(User.builder()
                .fullName("Sunita Deshpande (Executive Engineer)")
                .email("utility@bhumisetu.in")
                .password(encodedPassword)
                .phone("+91 98220 33445")
                .role(Role.UTILITY_OFFICER)
                .department(utilityDept)
                .build());

        User admin = userRepository.save(User.builder()
                .fullName("Amit Sharma (System Admin)")
                .email("admin@bhumisetu.in")
                .password(encodedPassword)
                .phone("+91 98220 99999")
                .role(Role.ADMIN)
                .build());

        // 3. Seed 25 Pune Land Parcels
        List<LandParcel> parcels = seedParcels();

        // 4. Seed Ownership Records
        seedOwnerships(parcels);

        // 5. Seed Documents
        seedDocuments(parcels, citizen, revenueOfficer);

        // 6. Seed Applications & Workflow Histories
        seedApplications(parcels, citizen, revenueOfficer, planningOfficer, utilityOfficer, revenueDept, planningDept, utilityDept);

        // 7. Seed Initial Audit Logs
        auditLogRepository.save(AuditLog.builder()
                .userId(admin.getId())
                .userEmail(admin.getEmail())
                .action("SYSTEM_INITIALIZED")
                .entity("System")
                .entityId("0")
                .ipAddress("127.0.0.1")
                .details("Bhumisetu platform initialized with 25 Pune GIS parcels, RBAC roles, and mock workflows.")
                .timestamp(LocalDateTime.now())
                .build());

        log.info("Bhumisetu initial data seeding completed successfully! Total parcels: {}", parcels.size());
    }

    private List<LandParcel> seedParcels() throws Exception {
        // 25 realistic parcels in Pune (Hinjewadi, Wakad, Baner, Kharadi, Wagholi, Hadapsar)
        Object[][] parcelSpecs = {
            // Hinjewadi (Phase 1 & 2) - IT & Commercial/Residential
            {"MH-PUN-HIN-001", "125/2", "Hinjewadi", "Mulshi", "Pune", 3450.0, LandUseType.COMMERCIAL,
             "POLYGON((73.7250 18.5910, 73.7275 18.5910, 73.7275 18.5890, 73.7250 18.5890, 73.7250 18.5910))"},
            {"MH-PUN-HIN-002", "125/1", "Hinjewadi", "Mulshi", "Pune", 2800.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.7276 18.5910, 73.7300 18.5910, 73.7300 18.5890, 73.7276 18.5890, 73.7276 18.5910))"},
            {"MH-PUN-HIN-003", "126/3", "Hinjewadi", "Mulshi", "Pune", 5120.0, LandUseType.COMMERCIAL,
             "POLYGON((73.7250 18.5889, 73.7285 18.5889, 73.7285 18.5865, 73.7250 18.5865, 73.7250 18.5889))"},
            {"MH-PUN-HIN-004", "128/1", "Hinjewadi", "Mulshi", "Pune", 4200.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.7286 18.5889, 73.7320 18.5889, 73.7320 18.5865, 73.7286 18.5865, 73.7286 18.5889))"},
            {"MH-PUN-HIN-005", "130/2", "Hinjewadi", "Mulshi", "Pune", 1850.0, LandUseType.MIXED_USE,
             "POLYGON((73.7325 18.5915, 73.7350 18.5915, 73.7350 18.5895, 73.7325 18.5895, 73.7325 18.5915))"},

            // Wakad - Residential & Commercial
            {"MH-PUN-WAK-006", "42/1", "Wakad", "Haveli", "Pune", 2150.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.7620 18.5980, 73.7645 18.5980, 73.7645 18.5960, 73.7620 18.5960, 73.7620 18.5980))"},
            {"MH-PUN-WAK-007", "42/2A", "Wakad", "Haveli", "Pune", 3100.0, LandUseType.COMMERCIAL,
             "POLYGON((73.7646 18.5980, 73.7675 18.5980, 73.7675 18.5960, 73.7646 18.5960, 73.7646 18.5980))"},
            {"MH-PUN-WAK-008", "43/4", "Wakad", "Haveli", "Pune", 1950.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.7620 18.5959, 73.7650 18.5959, 73.7650 18.5940, 73.7620 18.5940, 73.7620 18.5959))"},
            {"MH-PUN-WAK-009", "45/1", "Wakad", "Haveli", "Pune", 4600.0, LandUseType.MIXED_USE,
             "POLYGON((73.7651 18.5959, 73.7690 18.5959, 73.7690 18.5935, 73.7651 18.5935, 73.7651 18.5959))"},

            // Baner - High-end Residential & Commercial
            {"MH-PUN-BAN-010", "84/1A", "Baner", "Haveli", "Pune", 2980.0, LandUseType.COMMERCIAL,
             "POLYGON((73.7840 18.5620, 73.7870 18.5620, 73.7870 18.5600, 73.7840 18.5600, 73.7840 18.5620))"},
            {"MH-PUN-BAN-011", "84/2", "Baner", "Haveli", "Pune", 3500.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.7871 18.5620, 73.7905 18.5620, 73.7905 18.5600, 73.7871 18.5600, 73.7871 18.5620))"},
            {"MH-PUN-BAN-012", "85/3", "Baner", "Haveli", "Pune", 1750.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.7840 18.5599, 73.7868 18.5599, 73.7868 18.5580, 73.7840 18.5580, 73.7840 18.5599))"},
            {"MH-PUN-BAN-013", "87/1", "Baner", "Haveli", "Pune", 6200.0, LandUseType.COMMERCIAL,
             "POLYGON((73.7869 18.5599, 73.7915 18.5599, 73.7915 18.5570, 73.7869 18.5570, 73.7869 18.5599))"},

            // Kharadi - IT Hub & Residential
            {"MH-PUN-KHA-014", "61/1", "Kharadi", "Haveli", "Pune", 4800.0, LandUseType.COMMERCIAL,
             "POLYGON((73.9420 18.5540, 73.9455 18.5540, 73.9455 18.5515, 73.9420 18.5515, 73.9420 18.5540))"},
            {"MH-PUN-KHA-015", "62/2", "Kharadi", "Haveli", "Pune", 3200.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.9456 18.5540, 73.9485 18.5540, 73.9485 18.5515, 73.9456 18.5515, 73.9456 18.5540))"},
            {"MH-PUN-KHA-016", "63/1B", "Kharadi", "Haveli", "Pune", 2600.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.9420 18.5514, 73.9450 18.5514, 73.9450 18.5490, 73.9420 18.5490, 73.9420 18.5514))"},
            {"MH-PUN-KHA-017", "65/3", "Kharadi", "Haveli", "Pune", 7500.0, LandUseType.INDUSTRIAL,
             "POLYGON((73.9451 18.5514, 73.9500 18.5514, 73.9500 18.5480, 73.9451 18.5480, 73.9451 18.5514))"},

            // Wagholi - Agricultural & Emerging Suburbs
            {"MH-PUN-WAG-018", "204/1", "Wagholi", "Haveli", "Pune", 8500.0, LandUseType.AGRICULTURAL,
             "POLYGON((73.9800 18.5830, 73.9850 18.5830, 73.9850 18.5795, 73.9800 18.5795, 73.9800 18.5830))"},
            {"MH-PUN-WAG-019", "204/2", "Wagholi", "Haveli", "Pune", 6100.0, LandUseType.AGRICULTURAL,
             "POLYGON((73.9851 18.5830, 73.9895 18.5830, 73.9895 18.5795, 73.9851 18.5795, 73.9851 18.5830))"},
            {"MH-PUN-WAG-020", "205/3", "Wagholi", "Haveli", "Pune", 3800.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.9800 18.5794, 73.9845 18.5794, 73.9845 18.5765, 73.9800 18.5765, 73.9800 18.5794))"},
            {"MH-PUN-WAG-021", "207/1", "Wagholi", "Haveli", "Pune", 4900.0, LandUseType.MIXED_USE,
             "POLYGON((73.9846 18.5794, 73.9890 18.5794, 73.9890 18.5760, 73.9846 18.5760, 73.9846 18.5794))"},

            // Hadapsar - Industrial & Mixed Commercial
            {"MH-PUN-HAD-022", "311/A", "Hadapsar", "Haveli", "Pune", 5400.0, LandUseType.INDUSTRIAL,
             "POLYGON((73.9280 18.5050, 73.9325 18.5050, 73.9325 18.5020, 73.9280 18.5020, 73.9280 18.5050))"},
            {"MH-PUN-HAD-023", "311/B", "Hadapsar", "Haveli", "Pune", 4100.0, LandUseType.COMMERCIAL,
             "POLYGON((73.9326 18.5050, 73.9360 18.5050, 73.9360 18.5020, 73.9326 18.5020, 73.9326 18.5050))"},
            {"MH-PUN-HAD-024", "312/1", "Hadapsar", "Haveli", "Pune", 3250.0, LandUseType.RESIDENTIAL,
             "POLYGON((73.9280 18.5019, 73.9315 18.5019, 73.9315 18.4995, 73.9280 18.4995, 73.9280 18.5019))"},
            {"MH-PUN-HAD-025", "314/2", "Hadapsar", "Haveli", "Pune", 6800.0, LandUseType.INDUSTRIAL,
             "POLYGON((73.9316 18.5019, 73.9370 18.5019, 73.9370 18.4985, 73.9316 18.4985, 73.9316 18.5019))"}
        };

        List<LandParcel> savedParcels = new ArrayList<>();
        for (Object[] spec : parcelSpecs) {
            Polygon polygon = (Polygon) wktReader.read((String) spec[7]);
            polygon.setSRID(4326);

            LandParcel parcel = LandParcel.builder()
                    .ulpin((String) spec[0])
                    .surveyNumber((String) spec[1])
                    .village((String) spec[2])
                    .taluka((String) spec[3])
                    .district((String) spec[4])
                    .areaSqM((Double) spec[5])
                    .landUse((LandUseType) spec[6])
                    .boundary(polygon)
                    .build();

            savedParcels.add(landParcelRepository.save(parcel));
        }
        return savedParcels;
    }

    private void seedOwnerships(List<LandParcel> parcels) {
        String[] firstNames = {"Ramesh", "Suresh", "Santosh", "Anand", "Vikas", "Mahesh", "Sunil", "Prakash", "Dattatraya", "Ganesh"};
        String[] lastNames = {"Patil", "Deshmukh", "Kulkarni", "Jadhav", "Shinde", "Gaikwad", "Chavan", "Pawar", "Bhosale", "More"};

        int idx = 0;
        for (LandParcel parcel : parcels) {
            idx++;
            // The first parcel belongs to our demo citizen
            if (parcel.getSurveyNumber().equals("125/2")) {
                ownershipRecordRepository.save(OwnershipRecord.builder()
                        .parcel(parcel)
                        .ownerName("Ramesh Narayan Patil")
                        .aadhaarMasked("XXXX-XXXX-4819")
                        .ownershipShare("100%")
                        .ownershipType("INDIVIDUAL")
                        .acquiredDate(LocalDate.of(2018, 5, 14))
                        .mutationNumber("MUT-2018-4501")
                        .build());
            } else {
                String fn = firstNames[idx % firstNames.length];
                String ln = lastNames[idx % lastNames.length];
                ownershipRecordRepository.save(OwnershipRecord.builder()
                        .parcel(parcel)
                        .ownerName(fn + " " + ln)
                        .aadhaarMasked("XXXX-XXXX-" + (1000 + (idx * 137) % 9000))
                        .ownershipShare(idx % 3 == 0 ? "50%" : "100%")
                        .ownershipType(idx % 3 == 0 ? "JOINT" : "INDIVIDUAL")
                        .acquiredDate(LocalDate.of(2015 + (idx % 8), 1 + (idx % 12), 1 + (idx % 27)))
                        .mutationNumber("MUT-" + (2015 + (idx % 8)) + "-" + (1000 + idx * 42))
                        .build());

                // If joint ownership, add second co-owner
                if (idx % 3 == 0) {
                    ownershipRecordRepository.save(OwnershipRecord.builder()
                            .parcel(parcel)
                            .ownerName("Sunita " + fn + " " + ln)
                            .aadhaarMasked("XXXX-XXXX-" + (2000 + (idx * 153) % 8000))
                            .ownershipShare("50%")
                            .ownershipType("JOINT")
                            .acquiredDate(LocalDate.of(2015 + (idx % 8), 1 + (idx % 12), 1 + (idx % 27)))
                            .mutationNumber("MUT-" + (2015 + (idx % 8)) + "-" + (1000 + idx * 42))
                            .build());
                }
            }
        }
    }

    private void seedDocuments(List<LandParcel> parcels, User citizen, User officer) {
        LandParcel hinjewadiParcel = parcels.get(0); // 125/2
        LandParcel banerParcel = parcels.get(9);    // 84/1A
        LandParcel wagholiParcel = parcels.get(17); // 204/1

        // 7/12 Satbara Extract for Hinjewadi 125/2
        documentRepository.save(Document.builder()
                .parcel(hinjewadiParcel)
                .uploadedBy(citizen)
                .documentType(DocumentType.EXTRACT_7_12)
                .fileName("7-12_Extract_Survey_125_2_Hinjewadi.pdf")
                .filePath("/uploads/7-12_Extract_Survey_125_2_Hinjewadi.pdf")
                .fileSizeBytes(245760L)
                .contentType("application/pdf")
                .extractedMetadata("""
                    {
                      "documentType": "7/12 Satbara Extract",
                      "surveyNumber": "125/2",
                      "ulpin": "MH-PUN-HIN-001",
                      "village": "Hinjewadi",
                      "taluka": "Mulshi",
                      "district": "Pune",
                      "areaSqM": 3450.0,
                      "documentDate": "2024-03-15",
                      "registrationNumber": "MH-PUN-REG-89211",
                      "ownerNames": ["Ramesh Narayan Patil"],
                      "mutationNumber": "MUT-2018-4501",
                      "confidence": 0.96
                    }
                    """)
                .verified(true)
                .verifiedBy(officer)
                .verifiedAt(LocalDateTime.now().minusDays(10))
                .fullText("GOVERNMENT OF MAHARASHTRA REVENUE DEPARTMENT FORM VII-XII SATBARA VILLAGE: HINJEWADI TALUKA: MULSHI DISTRICT: PUNE SURVEY NUMBER: 125/2 ULPIN: MH-PUN-HIN-001 AREA: 0.3450 HECTARES (3450 SQ MTR) OCCUPANT CLASS 1: RAMESH NARAYAN PATIL MUTATION NUMBER: 4501 ASSESSMENT: RS 42.50 ENCUMBRANCE: NIL")
                .build());

        // Sanctioned Building Plan for Hinjewadi 125/2
        documentRepository.save(Document.builder()
                .parcel(hinjewadiParcel)
                .uploadedBy(citizen)
                .documentType(DocumentType.BUILDING_PLAN)
                .fileName("Building_Layout_Plan_RevA.pdf")
                .filePath("/uploads/Building_Layout_Plan_RevA.pdf")
                .fileSizeBytes(1542000L)
                .contentType("application/pdf")
                .extractedMetadata("""
                    {
                      "documentType": "Sanctioned Building Plan",
                      "surveyNumber": "125/2",
                      "village": "Hinjewadi",
                      "proposedBuiltUpAreaSqM": 4120.0,
                      "buildingHeightM": 24.5,
                      "architectLicense": "CA/2015/78412",
                      "confidence": 0.92
                    }
                    """)
                .verified(true)
                .verifiedBy(officer)
                .verifiedAt(LocalDateTime.now().minusDays(5))
                .fullText("PUNE METROPOLITAN REGION DEVELOPMENT AUTHORITY (PMRDA) PROPOSED COMMERCIAL COMPLEX PLAN SURVEY NO 125/2 HINJEWADI BUILT UP AREA: 4120 SQ M HEIGHT: 24.5 M FLOORS: G+7 FIRE SAFETY CLEARANCE ATTACHED")
                .build());

        // Tax Receipt for Baner 84/1A
        documentRepository.save(Document.builder()
                .parcel(banerParcel)
                .uploadedBy(citizen)
                .documentType(DocumentType.TAX_RECEIPT)
                .fileName("Property_Tax_Receipt_2025_26.pdf")
                .filePath("/uploads/Property_Tax_Receipt_2025_26.pdf")
                .fileSizeBytes(112400L)
                .contentType("application/pdf")
                .extractedMetadata("""
                    {
                      "documentType": "Property Tax Receipt",
                      "surveyNumber": "84/1A",
                      "village": "Baner",
                      "amountPaid": 28450.0,
                      "financialYear": "2025-2026",
                      "confidence": 0.98
                    }
                    """)
                .verified(true)
                .fullText("PUNE MUNICIPAL CORPORATION PMC PROPERTY TAX RECEIPT FY 2025-2026 WARD: BANER-BALEWADI PROPERTY NO: BNR-84-1A AMOUNT RECEIVED: RS 28,450 STATUS: PAID IN FULL TRANSACTION ID: PMC-TX-987162")
                .build());

        // 7/12 Extract for Wagholi 204/1
        documentRepository.save(Document.builder()
                .parcel(wagholiParcel)
                .uploadedBy(citizen)
                .documentType(DocumentType.EXTRACT_7_12)
                .fileName("7-12_Wagholi_Survey_204_1.pdf")
                .filePath("/uploads/7-12_Wagholi_Survey_204_1.pdf")
                .fileSizeBytes(210000L)
                .contentType("application/pdf")
                .extractedMetadata("""
                    {
                      "documentType": "7/12 Satbara Extract",
                      "surveyNumber": "204/1",
                      "ulpin": "MH-PUN-WAG-018",
                      "village": "Wagholi",
                      "taluka": "Haveli",
                      "district": "Pune",
                      "areaSqM": 8500.0,
                      "documentDate": "2024-01-20",
                      "confidence": 0.94
                    }
                    """)
                .verified(false)
                .fullText("MAHARASHTRA LAND RECORDS SATBARA VILLAGE: WAGHOLI GAT NUMBER: 204/1 ULPIN: MH-PUN-WAG-018 AGRICULTURAL LAND JOWAR/SUGARCANE CROPS AREA: 0.8500 HECTARES MUTATION ENTRY PENDING")
                .build());
    }

    private void seedApplications(List<LandParcel> parcels, User citizen, User revenueOfficer,
                                 User planningOfficer, User utilityOfficer,
                                 Department revenueDept, Department planningDept, Department utilityDept) {

        LandParcel parcelHinjewadi = parcels.get(0); // 125/2
        LandParcel parcelBaner = parcels.get(9);      // 84/1A
        LandParcel parcelWagholi = parcels.get(17);   // 204/1
        LandParcel parcelWakad = parcels.get(5);      // 42/1
        LandParcel parcelHadapsar = parcels.get(21);  // 311/A

        // App 1: Building Permission (UNDER_REVIEW) - Planning Officer
        Application app1 = applicationRepository.save(Application.builder()
                .applicationNumber("BS-2026-BP-00101")
                .parcel(parcelHinjewadi)
                .applicant(citizen)
                .serviceType(ServiceType.BUILDING_PERMISSION)
                .status(ApplicationStatus.UNDER_REVIEW)
                .department(planningDept)
                .assignedOfficer(planningOfficer)
                .builtUpAreaSqM(4120.0)
                .buildingHeightM(24.5)
                .remarks("Application for G+7 commercial office building on Hinjewadi survey 125/2. Structural designs attached.")
                .createdAt(LocalDateTime.now().minusDays(4))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app1)
                .action("SUBMITTED")
                .actedBy(citizen)
                .comment("Citizen submitted building permission application with architectural blueprints.")
                .timestamp(LocalDateTime.now().minusDays(4))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app1)
                .action("UNDER_REVIEW")
                .actedBy(planningOfficer)
                .comment("Town planning officer verified FSI calculations (1.5 permitted, 1.2 utilized). Awaiting fire department NOC.")
                .timestamp(LocalDateTime.now().minusDays(2))
                .build());

        // App 2: Land-Use Change (INFO_REQUESTED) - Revenue Officer
        Application app2 = applicationRepository.save(Application.builder()
                .applicationNumber("BS-2026-LC-00204")
                .parcel(parcelWagholi)
                .applicant(citizen)
                .serviceType(ServiceType.LAND_USE_CHANGE)
                .status(ApplicationStatus.INFO_REQUESTED)
                .department(revenueDept)
                .assignedOfficer(revenueOfficer)
                .proposedLandUse("RESIDENTIAL")
                .remarks("Conversion of 8,500 sq.m agricultural land to residential plotted development.")
                .createdAt(LocalDateTime.now().minusDays(8))
                .updatedAt(LocalDateTime.now().minusDays(3))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app2)
                .action("SUBMITTED")
                .actedBy(citizen)
                .comment("Application filed for NA conversion with cadastral map.")
                .timestamp(LocalDateTime.now().minusDays(8))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app2)
                .action("INFO_REQUESTED")
                .actedBy(revenueOfficer)
                .comment("Please upload the latest 7/12 extract reflecting mutation entry 4120 and soil clearance certificate.")
                .timestamp(LocalDateTime.now().minusDays(3))
                .build());

        // App 3: Water Connection (APPROVED) - Utility Officer
        Application app3 = applicationRepository.save(Application.builder()
                .applicationNumber("BS-2026-WC-00340")
                .parcel(parcelBaner)
                .applicant(citizen)
                .serviceType(ServiceType.WATER_CONNECTION)
                .status(ApplicationStatus.APPROVED)
                .department(utilityDept)
                .assignedOfficer(utilityOfficer)
                .waterConnectionType("COMMERCIAL_25MM")
                .remarks("Water connection request for 25mm industrial grade meter connection.")
                .createdAt(LocalDateTime.now().minusDays(15))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app3)
                .action("SUBMITTED")
                .actedBy(citizen)
                .comment("Application submitted with plumbing diagrams and PMC tax receipt.")
                .timestamp(LocalDateTime.now().minusDays(15))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app3)
                .action("UNDER_REVIEW")
                .actedBy(utilityOfficer)
                .comment("Site inspection conducted on parcel 84/1A. Main pipeline connection point identified at North-West boundary.")
                .timestamp(LocalDateTime.now().minusDays(7))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app3)
                .action("APPROVED")
                .actedBy(utilityOfficer)
                .comment("Approved: Sanction order #PMC-WC-8841 issued. Citizen may proceed with meter installation.")
                .timestamp(LocalDateTime.now().minusDays(1))
                .build());

        // App 4: Building Permission (SUBMITTED) - Fresh application
        Application app4 = applicationRepository.save(Application.builder()
                .applicationNumber("BS-2026-BP-00412")
                .parcel(parcelWakad)
                .applicant(citizen)
                .serviceType(ServiceType.BUILDING_PERMISSION)
                .status(ApplicationStatus.SUBMITTED)
                .department(planningDept)
                .builtUpAreaSqM(1850.0)
                .buildingHeightM(12.0)
                .remarks("Residential villa construction on Wakad survey 42/1.")
                .createdAt(LocalDateTime.now().minusHours(6))
                .updatedAt(LocalDateTime.now().minusHours(6))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app4)
                .action("SUBMITTED")
                .actedBy(citizen)
                .comment("Application submitted online via Single Window Portal.")
                .timestamp(LocalDateTime.now().minusHours(6))
                .build());

        // App 5: Land-Use Change (REJECTED) - Hadapsar
        Application app5 = applicationRepository.save(Application.builder()
                .applicationNumber("BS-2026-LC-00501")
                .parcel(parcelHadapsar)
                .applicant(citizen)
                .serviceType(ServiceType.LAND_USE_CHANGE)
                .status(ApplicationStatus.REJECTED)
                .department(revenueDept)
                .assignedOfficer(revenueOfficer)
                .proposedLandUse("COMMERCIAL")
                .remarks("Commercial conversion on survey 311/A Hadapsar.")
                .createdAt(LocalDateTime.now().minusDays(20))
                .updatedAt(LocalDateTime.now().minusDays(12))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app5)
                .action("SUBMITTED")
                .actedBy(citizen)
                .comment("Submitted proposal for commercial warehousing.")
                .timestamp(LocalDateTime.now().minusDays(20))
                .build());

        workflowHistoryRepository.save(WorkflowHistory.builder()
                .application(app5)
                .action("REJECTED")
                .actedBy(revenueOfficer)
                .comment("Rejected: Parcel lies inside the designated green ecological buffer zone of Mula-Mutha river catchment (DP 2041).")
                .timestamp(LocalDateTime.now().minusDays(12))
                .build());
    }
}
