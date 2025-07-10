"use client"

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { format } from "date-fns"

interface Result {
  interestRate: number
  premium1Value: number
  premium2Value: number
  futureValueA: number
  inflationAdjustedValueA: number
  futureValueB: number
  inflationAdjustedValueB: number
  incomeA45?: number
  incomeA51?: number
  incomeB45?: number
  incomeB51?: number
}

interface CalculatorPDFProps {
  premium1: number
  premium2: number
  frequency1?: string
  frequency2?: string
  yearsOfFunding: number
  currentAge?: number
  retirementAge?: number
  faceAmount: number
  faceAmountB: number
  inflationRate: number
  agentName: string
  clientName?: string
  results: Result[]
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: "#15803d", // green-700
    paddingBottom: 15,
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 15,
  },
  headerText: {
    marginLeft: 5,
    flexGrow: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#15803d", // green-700
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: "#92400e", // amber-700
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#15803d", // green-700
  },
  infoTable: {
    marginBottom: 15,
    flexDirection: "row",
  },
  infoColumn: {
    width: "50%",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    width: "40%",
    fontWeight: "bold",
    paddingRight: 5,
  },
  infoValue: {
    width: "60%",
  },
  greenBackground: {
    backgroundColor: "#f0fdf4", // green-50
  },
  amberBackground: {
    backgroundColor: "#fffbeb", // amber-50
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: "#f0fdf4", // green-50
    padding: 5,
    borderWidth: 1,
    borderColor: "#15803d", // green-700
    color: "#15803d", // green-700
  },
  resultsTable: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb", // gray-50
  },
  tableHeader: {
    backgroundColor: "#15803d", // green-700
    color: "white",
    padding: 6,
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  tableHeaderGreen: {
    backgroundColor: "#166534", // green-800
    color: "white",
    padding: 6,
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "center",
  },
  tableHeaderAmber: {
    backgroundColor: "#92400e", // amber-700
    color: "white",
    padding: 6,
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "center",
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    textAlign: "center",
  },
  colRate: {
    width: "16%",
  },
  colOption: {
    width: "42%",
  },
  colBasic: {
    width: "33%",
  },
  colLabel: {
    width: "25%",
    textAlign: "left",
  },
  colValue: {
    width: "25%",
    textAlign: "right",
  },
  colSmall: {
    width: "20%",
    textAlign: "center",
  },
  bottomSection: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  signature: {
    flexDirection: "row",
    marginBottom: 15,
  },
  signatureBox: {
    width: "50%",
    paddingRight: 10,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#15803d", // green-700
    marginTop: 25,
    marginBottom: 5,
    width: "70%",
  },
  signatureText: {
    fontSize: 8,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    fontSize: 8,
    marginBottom: 10,
  },
  footerLeft: {
    width: "60%",
  },
  footerRight: {
    width: "40%",
    textAlign: "right",
  },
  disclaimer: {
    fontSize: 7,
    color: "#6b7280", // gray-500
    lineHeight: 1.4,
  },
})

export function CalculatorPDF({
  premium1,
  premium2,
  frequency1 = 'annual',
  frequency2 = 'annual',
  yearsOfFunding,
  currentAge,
  retirementAge,
  faceAmount,
  faceAmountB,
  inflationRate,
  agentName,
  clientName = "Client",
  results,
}: CalculatorPDFProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  const formatDate = () => {
    return format(new Date(), "MMMM dd, yyyy");
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image src="/logo.jpeg" style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.companyName}>Freedom 2 Retire Calculator</Text>
            <Text style={styles.tagline}>Professional Premium Projection Report</Text>
            <Text style={styles.reportTitle}>Investment Comparison Analysis</Text>
          </View>
        </View>
        
        {/* Client and Report Information */}
        <View style={styles.infoTable}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client Name:</Text>
              <Text style={styles.infoValue}>{clientName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Report Date:</Text>
              <Text style={styles.infoValue}>{formatDate()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prepared By:</Text>
              <Text style={styles.infoValue}>{agentName}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Years of Funding:</Text>
              <Text style={styles.infoValue}>{yearsOfFunding} years</Text>
            </View>
            {currentAge && retirementAge && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Current Age:</Text>
                  <Text style={styles.infoValue}>{currentAge}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Retirement Age:</Text>
                  <Text style={styles.infoValue}>{retirementAge}</Text>
                </View>
              </>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Face Amount-Living Benefits A:</Text>
              <Text style={styles.infoValue}>{formatCurrency(faceAmount)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Face Amount-Living Benefits B:</Text>
              <Text style={styles.infoValue}>{formatCurrency(faceAmountB)}</Text>
            </View>
          </View>
        </View>
        
        {/* Premium Options Summary */}
        <Text style={styles.sectionTitle}>Premium Options</Text>
        <View style={styles.resultsTable}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeader, { flex: 1 }]}>
              <Text>Option</Text>
            </View>
            <View style={[styles.tableHeader, { flex: 1 }]}>
              <Text>Premium Amount</Text>
            </View>
            <View style={[styles.tableHeader, { flex: 1 }]}>
              <Text>Payment Frequency</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#f0fdf4" }]}>
              <Text>Option A</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#f0fdf4" }]}>
              <Text>{formatCurrency(premium1)}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#f0fdf4" }]}>
              <Text>{frequency1.charAt(0).toUpperCase() + frequency1.slice(1)}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#fffbeb" }]}>
              <Text>Option B</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#fffbeb" }]}>
              <Text>{formatCurrency(premium2)}</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#fffbeb" }]}>
              <Text>{frequency2.charAt(0).toUpperCase() + frequency2.slice(1)}</Text>
            </View>
          </View>
        </View>
        
        {/* Detailed Results */}
        <Text style={styles.sectionTitle}>Projection Results</Text>
        <View style={styles.resultsTable}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeader, styles.colRate]}>
              <Text>Interest Rate</Text>
            </View>
            <View style={[styles.tableHeaderGreen, styles.colOption]}>
              <Text>Option A - {formatCurrency(premium1)}/{frequency1}</Text>
            </View>
            <View style={[styles.tableHeaderAmber, styles.colOption]}>
              <Text>Option B - {formatCurrency(premium2)}/{frequency2}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.colRate, { backgroundColor: "#f3f4f6" }]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, styles.colOption, styles.greenBackground, { textAlign: "center" }]}>
              <Text>POTENTIAL TAX-FREE VALUE</Text>
            </View>
            <View style={[styles.tableCell, styles.colOption, styles.amberBackground, { textAlign: "center" }]}>
              <Text>POTENTIAL TAX-FREE VALUE</Text>
            </View>
          </View>
          
          {results.map((result, index) => (
            <View key={result.interestRate} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <View style={[styles.tableCell, styles.colRate]}>
                <Text>{result.interestRate}%</Text>
              </View>
              <View style={[styles.tableCell, styles.colOption, { textAlign: "right", paddingRight: 20 }]}>
                <Text>{formatCurrency(result.inflationAdjustedValueA)}</Text>
              </View>
              <View style={[styles.tableCell, styles.colOption, { textAlign: "right", paddingRight: 20 }]}>
                <Text>{formatCurrency(result.inflationAdjustedValueB)}</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Bottom Section with Signatures, Footer and Disclaimer */}
        <View style={styles.bottomSection}>
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text>Freedom 2 Retire Calculator</Text>
            </View>
            <View style={styles.footerRight}>
              <Text>Page 1 of 2</Text>
            </View>
          </View>
          
          <View style={styles.disclaimer}>
            <Text>
              DISCLAIMER: This calculator provides hypothetical projections based on the inputs provided. Actual results
              may vary. The projections are for illustrative purposes only and do not guarantee future performance.
              This report does not constitute an offer or solicitation to buy any securities or financial products.
              The information presented is not designed to provide tax, legal, or investment advice. 
              Please consult with a qualified professional before making any investment decisions.
            </Text>
          </View>
        </View>
      </Page>
      
      {/* Second Page with Retirement Income Information */}
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image src="/logo.jpeg" style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.companyName}>Freedom 2 Retire Calculator</Text>
            <Text style={styles.tagline}>Professional Premium Projection Report</Text>
            <Text style={styles.reportTitle}>Retirement Income Analysis</Text>
          </View>
        </View>
        
        {/* Retirement Income Section */}
        <Text style={styles.sectionTitle}>Monthly Tax-Free Retirement Income</Text>
        <View style={styles.resultsTable}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeader, styles.colRate]}>
              <Text>Interest Rate</Text>
            </View>
            <View style={[styles.tableHeaderGreen, styles.colOption]}>
              <Text>Option A - {formatCurrency(premium1)}/{frequency1}</Text>
            </View>
            <View style={[styles.tableHeaderAmber, styles.colOption]}>
              <Text>Option B - {formatCurrency(premium2)}/{frequency2}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.colRate, { backgroundColor: "#f3f4f6" }]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#f0fdf4", textAlign: "center" }]}>
              <Text>Income @4.5%</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#f0fdf4", textAlign: "center" }]}>
              <Text>Income @5.1%</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#fffbeb", textAlign: "center" }]}>
              <Text>Income @4.5%</Text>
            </View>
            <View style={[styles.tableCell, { flex: 1, backgroundColor: "#fffbeb", textAlign: "center" }]}>
              <Text>Income @5.1%</Text>
            </View>
          </View>
          
          {results.map((result, index) => (
            <View key={`income-${result.interestRate}`} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <View style={[styles.tableCell, styles.colRate]}>
                <Text>{result.interestRate}%</Text>
              </View>
              <View style={[styles.tableCell, { flex: 1, textAlign: "right", paddingRight: 10 }]}>
                <Text>{formatCurrency(result.incomeA45 || 0)}/mo</Text>
              </View>
              <View style={[styles.tableCell, { flex: 1, textAlign: "right", paddingRight: 10 }]}>
                <Text>{formatCurrency(result.incomeA51 || 0)}/mo</Text>
              </View>
              <View style={[styles.tableCell, { flex: 1, textAlign: "right", paddingRight: 10 }]}>
                <Text>{formatCurrency(result.incomeB45 || 0)}/mo</Text>
              </View>
              <View style={[styles.tableCell, { flex: 1, textAlign: "right", paddingRight: 10 }]}>
                <Text>{formatCurrency(result.incomeB51 || 0)}/mo</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 12, marginBottom: 10, fontWeight: 'bold', color: "#15803d"}}>About Tax-Free Retirement Income</Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563"}}>
            This calculator estimates your potential monthly tax-free income starting at desired age inputted, 
            funded exclusively through policy loans from your insurance carrier. While future inflation rates 
            cannot be predicted, all projections automatically account for a 2% inflation factor to provide 
            more realistic, long-term estimates.
          </Text>
          
          <Text style={{fontSize: 10, lineHeight: 1.5, marginTop: 8, fontWeight: 'bold', color: "#4b5563"}}>
            Withdrawal Rate Options:
          </Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563", marginLeft: 10}}>
            • 4.5% Withdrawal Rate: Designed for long-term sustainability, providing reliable income through age 100.
          </Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563", marginLeft: 10}}>
            • 5.1% Withdrawal Rate: Optimized for a 20-year income horizon—this higher withdrawal rate may not sustain payouts beyond 25 years.
          </Text>
          
          <Text style={{fontSize: 10, lineHeight: 1.5, marginTop: 8, fontWeight: 'bold', color: "#4b5563"}}>
            Key Features:
          </Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563", marginLeft: 10}}>
            • Tax-free retirement income via policy loans (no taxable events)
          </Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563", marginLeft: 10}}>
            • Inflation-adjusted projections (2% assumed for long-term planning)
          </Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563", marginLeft: 10}}>
            • Flexible withdrawal strategies for short- or long-term needs
          </Text>
          <Text style={{fontSize: 10, lineHeight: 1.5, color: "#4b5563", marginLeft: 10}}>
            • Growth potential persists even after withdrawals begin
          </Text>
          
          <Text style={{fontSize: 10, lineHeight: 1.5, marginTop: 8, color: "#4b5563"}}>
            This tool helps you evaluate how your policy can deliver potential, tax-advantaged income throughout retirement.
          </Text>
        </View>
        
        {/* Bottom Section with Footer and Disclaimer */}
        <View style={styles.bottomSection}>
          {/* Signatures section now moved to page 2 and positioned lower */}
          <View style={{marginBottom: 30}}>
            <View style={styles.signature}>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Client Signature</Text>
              </View>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Date</Text>
              </View>
            </View>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text>Freedom 2 Retire Calculator</Text>
            </View>
            <View style={styles.footerRight}>
              <Text>Page 2 of 2</Text>
            </View>
          </View>
          
          <View style={styles.disclaimer}>
            <Text>
              DISCLAIMER: This calculator provides hypothetical projections based on the inputs provided. Actual results
              may vary. The projections are for illustrative purposes only and do not guarantee future performance.
              This report does not constitute an offer or solicitation to buy any securities or financial products.
              The information presented is not designed to provide tax, legal, or investment advice. 
              Please consult with a qualified professional before making any investment decisions.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
