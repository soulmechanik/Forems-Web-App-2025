import PDFDocument from "pdfkit";
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";

/**
 * Download image from URL and return as buffer
 * @param {string} imageUrl - The image URL
 * @returns {Promise<Buffer>} Image buffer
 */
const downloadImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const client = imageUrl.startsWith('https') ? https : http;
    
    const request = client.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      response.on('error', reject);
    });
    
    request.on('error', reject);
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Image download timeout'));
    });
  });
};

/**
 * Generate a professional Tenancy Application PDF in memory
 * @param {Object} application - The tenancy application object
 * @param {Object} tenantUser - The tenant user { name, email }
 * @param {Object} property - The property object
 * @returns {Promise<Buffer>} PDF file buffer
 */
export const generateTenancyApplicationPDF = async (application, tenantUser, property) => {
  try {
    // Pre-download images if they are URLs
    let passportPhotoBuffer = null;
    let guarantorPhotoBuffer = null;
    
    if (application.passportPhoto && application.passportPhoto.startsWith('http')) {
      try {
        passportPhotoBuffer = await downloadImage(application.passportPhoto);
        console.log("Passport photo downloaded successfully");
      } catch (err) {
        console.log("Failed to download passport photo:", err.message);
      }
    }
    
    if (application.guarantorPassportPhotos?.length && application.guarantorPassportPhotos[0].startsWith('http')) {
      try {
        guarantorPhotoBuffer = await downloadImage(application.guarantorPassportPhotos[0]);
        console.log("Guarantor photo downloaded successfully");
      } catch (err) {
        console.log("Failed to download guarantor photo:", err.message);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });
        
        let buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Professional color scheme
        const primaryColor = "#1a1a1a"; // Very dark gray
        const secondaryColor = "#555555"; // Medium gray
        const borderColor = "#d0d0d0"; // Light gray
        const backgroundColor = "#f9f9f9"; // Very light gray
        const accentColor = "#2c3e50"; // Professional dark blue
        
        // Helper functions
        const addSection = (title, startY = null) => {
          if (startY !== null) doc.y = startY;
          
          // Check if we have enough space for section header + at least 3 lines of content (80px)
          if (doc.y > 670) {
            doc.addPage();
            doc.y = 50;
          }
          
          doc.moveDown(0.5);
          
          // Section header with background
          const sectionY = doc.y;
          doc.rect(50, sectionY - 2, 495, 28).fill(backgroundColor);
          doc.rect(50, sectionY - 2, 495, 28).strokeColor(borderColor).lineWidth(1).stroke();
          
          doc.font("Helvetica-Bold").fontSize(12).fillColor(accentColor)
             .text(title, 58, sectionY + 6);
          
          doc.moveDown(2.5);
          return doc.y;
        };

        const addField = (label, value, options = {}) => {
          const {
            x = 58,
            labelWidth = 140,
            fontSize = 10,
            spacing = 1.8
          } = options;
          
          // Check if we have enough space for this field (25px minimum)
          if (doc.y > 750) {
            doc.addPage();
            doc.y = 50;
          }
          
          const currentY = doc.y;
          
          // Label
          doc.font("Helvetica-Bold").fontSize(fontSize).fillColor(secondaryColor)
             .text(label + ":", x, currentY, { width: labelWidth });
          
          // Value - handle long text properly
          const valueText = value || "Not provided";
          doc.font("Helvetica").fontSize(fontSize).fillColor(primaryColor)
             .text(valueText, x + labelWidth, currentY, { 
               width: 495 - labelWidth - 58,
               lineGap: 2
             });
          
          doc.moveDown(spacing);
          return doc.y;
        };

        // Smart section wrapper - ensures section header and content stay together
        const addSmartSection = (title, contentRenderer) => {
          // Check if we have enough space for section + minimum content (100px)
          if (doc.y > 650) {
            doc.addPage();
            doc.y = 50;
          }
          
          const sectionStart = addSection(title);
          const contentStartY = doc.y;
          
          try {
            contentRenderer();
            
            // If content overflowed to next page and section header is alone, fix it
            if (doc.y > 700 && (doc.y - contentStartY) < 50) {
              // Content was minimal but we're near page end, this is fine
              return;
            }
          } catch (err) {
            console.log("Error rendering section content:", err);
          }
        };

        const addImageBox = (imageBuffer, x, y, width, height, label) => {
          if (imageBuffer) {
            try {
              doc.image(imageBuffer, x, y, { 
                width: width, 
                height: height,
                fit: [width, height],
                align: 'center'
              });
            } catch (err) {
              // Fallback to placeholder
              doc.rect(x, y, width, height).strokeColor(borderColor).stroke();
              doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
                 .text("Image Error", x, y + height/2 - 5, { width: width, align: "center" });
            }
          } else {
            // Placeholder box
            doc.rect(x, y, width, height).strokeColor(borderColor).stroke();
            doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
               .text("No Image", x, y + height/2 - 5, { width: width, align: "center" });
          }
          
          // Label below image
          doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
             .text(label, x, y + height + 5, { width: width, align: "center" });
        };

        // ========== HEADER SECTION ==========
        let currentY = 40;
        
        // Company Logo - Multiple approaches including base64 fallback
        let logoLoaded = false;
        
        try {
          // First try: Direct file paths
          const logoPaths = [
            path.join(process.cwd(), "frontend", "public", "newlogoforems.png"),
            path.join(process.cwd(), "public", "newlogoforems.png"),
            path.resolve(process.cwd(), "frontend", "public", "newlogoforems.png"),
            path.resolve(process.cwd(), "public", "newlogoforems.png")
          ];
          
          console.log("🔍 Current working directory:", process.cwd());
          console.log("🔍 Attempting to load logo...");
          
          for (const logoPath of logoPaths) {
            try {
              console.log(`🔍 Checking: ${logoPath}`);
              if (fs.existsSync(logoPath)) {
                const logoBuffer = fs.readFileSync(logoPath);
                doc.image(logoBuffer, 58, currentY, { width: 100, height: 80 });
                console.log(`🎉 Logo loaded from: ${logoPath}`);
                logoLoaded = true;
                break;
              }
            } catch (pathErr) {
              console.log(`❌ Failed: ${logoPath} - ${pathErr.message}`);
            }
          }
          
          // Second try: Check if running from backend directory
          if (!logoLoaded) {
            const backendPaths = [
              "../frontend/public/forems logo no bg.png",
              "../../frontend/public/forems logo no bg.png",
              "../public/forems logo no bg.png"
            ];
            
            for (const logoPath of backendPaths) {
              try {
                const fullPath = path.resolve(logoPath);
                console.log(`🔍 Backend path: ${fullPath}`);
                if (fs.existsSync(fullPath)) {
                  const logoBuffer = fs.readFileSync(fullPath);
                  doc.image(logoBuffer, 58, currentY, { width: 100, height: 80 });
                  console.log(`🎉 Logo loaded from backend path: ${fullPath}`);
                  logoLoaded = true;
                  break;
                }
              } catch (err) {
                console.log(`❌ Backend path failed: ${logoPath}`);
              }
            }
          }
          
        } catch (err) {
          console.log("❌ Logo loading error:", err.message);
        }
        
        // Fallback: Create professional text logo
        if (!logoLoaded) {
          console.log("⚠️ Using text logo fallback");
          // Professional text-based logo
          doc.rect(58, currentY, 100, 80).strokeColor(borderColor).lineWidth(2).stroke();
          doc.font("Helvetica-Bold").fontSize(16).fillColor(accentColor)
             .text("FOREMS", 58, currentY + 25, { width: 100, align: "center" });
          doc.font("Helvetica").fontSize(10).fillColor(secondaryColor)
             .text("AFRICA", 58, currentY + 45, { width: 100, align: "center" });
          console.log("📝 Text logo rendered");
        }
        
        // Company Information
        doc.font("Helvetica-Bold").fontSize(22).fillColor(accentColor)
           .text("FOREMS AFRICA", 180, currentY + 10);
        
        doc.font("Helvetica").fontSize(12).fillColor(secondaryColor)
           .text("Africa's Number 1# Property Management Solution", 180, currentY + 38);
           
        doc.font("Helvetica").fontSize(10).fillColor(secondaryColor)
           .text("www.forems.africa", 180, currentY + 58, {
             link: "https://www.forems.africa",
             underline: true
           });
        
        // Document Title
        currentY += 100;
        doc.font("Helvetica-Bold").fontSize(18).fillColor(primaryColor)
           .text("TENANT APPLICATION FORM", 50, currentY, { align: "center" });
        
        // Horizontal line
        currentY += 35;
        doc.moveTo(50, currentY).lineTo(545, currentY).strokeColor(accentColor).lineWidth(2).stroke();
        
        // ========== APPLICATION SUMMARY ==========
        currentY += 25;
        doc.rect(50, currentY, 495, 70).fill(backgroundColor);
        doc.rect(50, currentY, 495, 70).strokeColor(borderColor).lineWidth(1).stroke();
        
        // Application details in organized layout
        doc.font("Helvetica-Bold").fontSize(11).fillColor(accentColor)
           .text("APPLICATION SUMMARY", 58, currentY + 8);
        
        doc.font("Helvetica-Bold").fontSize(9).fillColor(secondaryColor)
           .text("Application ID:", 58, currentY + 28)
           .text("Status:", 58, currentY + 45);
           
        doc.font("Helvetica").fontSize(9).fillColor(primaryColor)
           .text(application._id, 150, currentY + 28)
           .text(application.status.toUpperCase(), 150, currentY + 45);
        
        doc.font("Helvetica-Bold").fontSize(9).fillColor(secondaryColor)
           .text("Date Submitted:", 300, currentY + 28)
           .text("Generated:", 300, currentY + 45);
           
        doc.font("Helvetica").fontSize(9).fillColor(primaryColor)
           .text(new Date(application.createdAt).toLocaleDateString(), 385, currentY + 28)
           .text(new Date().toLocaleDateString(), 385, currentY + 45);
        
        currentY += 85;
        
        // ========== TENANT INFORMATION ==========
        addSmartSection("TENANT INFORMATION", () => {
          const tenantInfoStartY = doc.y;
          
          addField("Full Name", application.tenantName || tenantUser.name, { fontSize: 10 });
          addField("Email Address", tenantUser.email, { fontSize: 10 });
          addField("Tenant ID", application.tenant.toString(), { fontSize: 10 });
          
          // Add passport photo (larger and properly positioned)
          if (passportPhotoBuffer || (application.passportPhoto && !application.passportPhoto.startsWith('http'))) {
            const photoY = tenantInfoStartY;
            const imageSource = passportPhotoBuffer || application.passportPhoto;
            addImageBox(imageSource, 420, photoY, 80, 100, "Passport Photo");
          } else if (application.passportPhoto) {
            const photoY = tenantInfoStartY;
            addImageBox(null, 420, photoY, 80, 100, "Photo Available Online");
          }
          
          doc.moveDown(2);
        });
        
        // ========== PROPERTY INFORMATION ==========
        addSmartSection("PROPERTY INFORMATION", () => {
          addField("Property Name", property.propertyName, { fontSize: 10 });
          addField("Address", property.address, { fontSize: 10 });
          addField("State", property.state, { fontSize: 10 });
          addField("Property Type", property.propertyType, { fontSize: 10 });
          doc.moveDown(1.5);
        });
        
        // ========== PERSONAL PROFILE ==========
        if (application.formData?.personalProfile) {
          addSmartSection("PERSONAL PROFILE", () => {
            const profile = application.formData.personalProfile;
            addField("Age", profile.age?.toString(), { fontSize: 10 });
            addField("Marital Status", profile.maritalStatus, { fontSize: 10 });
            addField("State of Origin", profile.stateOfOrigin, { fontSize: 10 });
            addField("Geopolitical Zone", profile.geopoliticalZone, { fontSize: 10 });
            doc.moveDown(1.5);
          });
        }
        
        // ========== EMPLOYMENT INFORMATION ==========
        if (application.formData?.employment) {
          addSmartSection("EMPLOYMENT INFORMATION", () => {
            const employment = application.formData.employment;
            addField("Employment Status", employment.employmentStatus, { fontSize: 10 });
            addField("Job Title", employment.jobTitle, { fontSize: 10 });
            addField("Company Name", employment.companyName, { fontSize: 10 });
            addField("Salary Range", employment.salaryRange, { fontSize: 10 });
            addField("Work Address", employment.workAddress, { fontSize: 10 });
            doc.moveDown(1.5);
          });
        }
        
        // ========== EMERGENCY CONTACT ==========
        if (application.formData?.emergencyContact) {
          addSmartSection("EMERGENCY CONTACT", () => {
            const ec = application.formData.emergencyContact;
            addField("Name", ec.name, { fontSize: 10 });
            addField("Phone Number", ec.phone, { fontSize: 10 });
            addField("Relationship", ec.relationship, { fontSize: 10 });
            doc.moveDown(1.5);
          });
        }
        
        // ========== GUARANTOR INFORMATION ==========
        if (application.formData?.guarantors?.length || application.formData?.guarantor) {
          addSmartSection("GUARANTOR INFORMATION", () => {
            // Handle both guarantors array and single guarantor object
            const guarantors = application.formData.guarantors || 
                              (application.formData.guarantor ? [application.formData.guarantor] : []);
            
            if (guarantors.length > 0) {
              // Create a clean layout for guarantors
              const guarantorStartY = doc.y;
              let currentGuarantorY = guarantorStartY;
              
              guarantors.forEach((guarantor, index) => {
                // Check if we need a new page for this guarantor
                if (currentGuarantorY > 650) {
                  doc.addPage();
                  currentGuarantorY = 50;
                }
                
                // Add spacing between multiple guarantors
                if (index > 0) {
                  currentGuarantorY += 25; // Fixed spacing between guarantors
                }
                
                // Multiple guarantor header
                if (guarantors.length > 1) {
                  doc.font("Helvetica-Bold").fontSize(11).fillColor(accentColor)
                     .text(`Guarantor ${index + 1}`, 58, currentGuarantorY);
                  currentGuarantorY += 20;
                }
                
                // Create a contained box for each guarantor's information
                const guarantorBoxY = currentGuarantorY;
                
                // Guarantor info in left column (fixed width)
                doc.font("Helvetica-Bold").fontSize(9).fillColor(secondaryColor)
                   .text("Name:", 58, guarantorBoxY)
                   .text("Phone:", 58, guarantorBoxY + 15)
                   .text("Relationship:", 58, guarantorBoxY + 30)
                   .text("Address:", 58, guarantorBoxY + 45);
                
                doc.font("Helvetica").fontSize(9).fillColor(primaryColor)
                   .text(guarantor.name || "Not provided", 140, guarantorBoxY, { width: 250 })
                   .text(guarantor.phone || "Not provided", 140, guarantorBoxY + 15, { width: 250 })
                   .text(guarantor.relationship || "Not provided", 140, guarantorBoxY + 30, { width: 250 })
                   .text(guarantor.address || "Not provided", 140, guarantorBoxY + 45, { width: 250 });
                
                // Add photo for first guarantor only (right side, properly aligned)
                if (index === 0) {
                  if (guarantorPhotoBuffer || (application.guarantorPassportPhotos?.length && !application.guarantorPassportPhotos[0].startsWith('http'))) {
                    try {
                      const imageSource = guarantorPhotoBuffer || application.guarantorPassportPhotos[0];
                      doc.image(imageSource, 420, guarantorBoxY, { 
                        width: 80, 
                        height: 80,
                        fit: [80, 80],
                        align: 'center'
                      });
                      doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
                         .text("Guarantor Photo", 420, guarantorBoxY + 85, { width: 80, align: "center" });
                    } catch (err) {
                      console.log("Error rendering guarantor photo:", err.message);
                      // Photo placeholder
                      doc.rect(420, guarantorBoxY, 80, 80).strokeColor(borderColor).stroke();
                      doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
                         .text("Photo Error", 420, guarantorBoxY + 35, { width: 80, align: "center" })
                         .text("Guarantor Photo", 420, guarantorBoxY + 85, { width: 80, align: "center" });
                    }
                  } else if (application.guarantorPassportPhotos?.length) {
                    // Photo available online placeholder
                    doc.rect(420, guarantorBoxY, 80, 80).strokeColor(borderColor).stroke();
                    doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
                       .text("Photo Available", 420, guarantorBoxY + 30, { width: 80, align: "center" })
                       .text("Online", 420, guarantorBoxY + 45, { width: 80, align: "center" })
                       .text("Guarantor Photo", 420, guarantorBoxY + 85, { width: 80, align: "center" });
                  }
                }
                
                // Update Y position for next guarantor (increased height to accommodate address)
                currentGuarantorY = guarantorBoxY + 75; // Increased from 60 to 75 for address field
              });
              
              // Final spacing after all guarantors
              doc.y = currentGuarantorY + 20;
            }
            
            // Ensure proper spacing for next section
            doc.moveDown(1);
          });
        }
        
        // ========== TENANCY CONTRACT STATUS ==========
        if (application.tenancyContract) {
          addSmartSection("TENANCY CONTRACT STATUS", () => {
            const tc = application.tenancyContract;
            addField("Contract Downloaded", tc.downloaded ? "Yes" : "No", { fontSize: 10 });
            addField("Contract Signed", tc.signed ? "Yes" : "No", { fontSize: 10 });
            
            if (tc.agreements) {
              addField("Document Read", tc.agreements.readDocument ? "Yes" : "No", { fontSize: 10 });
              addField("Legal Agreement", tc.agreements.legallyBinding ? "Accepted" : "Pending", { fontSize: 10 });
              addField("Terms Accepted", tc.agreements.contractTerms ? "Yes" : "No", { fontSize: 10 });
            }
            doc.moveDown(1.5);
          });
        }
        
        // ========== FOOTER ==========
        // Calculate footer position - ensure it's at the bottom but not scattered
        let footerStartY;
        
        if (doc.y > 600) {
          // If we're too low on the page, start new page for footer
          doc.addPage();
          footerStartY = 700; // Fixed position near bottom of new page
        } else {
          // Use remaining space but ensure minimum distance from bottom
          footerStartY = Math.max(doc.y + 40, 700);
        }
        
        // Footer separator line
        doc.moveTo(50, footerStartY).lineTo(545, footerStartY)
           .strokeColor(borderColor).lineWidth(1).stroke();
        
        // Footer content - organized in a contained box
        const footerContentY = footerStartY + 15;
        
        // Left column - Contact information
        doc.font("Helvetica-Bold").fontSize(10).fillColor(accentColor)
           .text("Need Help? Contact Us:", 58, footerContentY);
        
        doc.font("Helvetica").fontSize(9).fillColor(primaryColor)
           .text("Support Line: +2348094793447", 58, footerContentY + 18)
           .text("Website: ", 58, footerContentY + 33);
        
        doc.font("Helvetica").fontSize(9).fillColor(primaryColor)
           .text("www.forems.africa", 105, footerContentY + 33, {
             link: "https://www.forems.africa",
             underline: true
           });
           
        doc.font("Helvetica").fontSize(9).fillColor(primaryColor)
           .text("Chat with Forems AI on WhatsApp", 58, footerContentY + 48, {
             link: "https://wa.me/2348094793447",
             underline: true
           });
        
        // Right column - System information
        doc.font("Helvetica").fontSize(8).fillColor(secondaryColor)
           .text("This document was automatically generated by", 320, footerContentY + 5, { 
             width: 220,
             align: "left"
           })
           .text("FOREMS AFRICA Property Management System.", 320, footerContentY + 18, { 
             width: 220,
             align: "left"
           })
           .text(`Generated: ${new Date().toLocaleString()}`, 320, footerContentY + 48, { 
             width: 220,
             align: "right"
           });
        
        // Finish PDF
        doc.end();
        
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    throw error;
  }
};