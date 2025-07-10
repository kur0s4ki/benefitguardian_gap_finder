"use server"

import nodemailer from "nodemailer"

interface EmailData {
  to: string
  premium1: number
  premium2: number
  yearsOfFunding: number
  faceAmount: number
  inflationRate: number
  agentName: string
  results: {
    rate: number
    premium1Value: number
    premium2Value: number
  }[]
}

export async function sendCalculationEmail(data: EmailData) {
  // In a real application, you would use environment variables for these
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: "user@example.com",
      pass: "password",
    },
  })

  const resultsTable = data.results
    .map(
      (result) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${result.rate}%</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${result.premium1Value.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${result.premium2Value.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("")

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #15803d; text-align: center;">Premium Calculator Results</h1>
      
      <h2>Input Parameters</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="font-weight: bold; width: 50%;">Premium 1:</td>
          <td>$${data.premium1}/month</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Premium 2:</td>
          <td>$${data.premium2}/month</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Years of Funding:</td>
          <td>${data.yearsOfFunding} years</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Face Amount:</td>
          <td>$${data.faceAmount}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Inflation Rate:</td>
          <td>${data.inflationRate}%</td>
        </tr>
      </table>
      
      <h2>Projection Results</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f0fdf4;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Interest Rate</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Premium 1 ($${data.premium1})</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Premium 2 ($${data.premium2})</th>
          </tr>
        </thead>
        <tbody>
          ${resultsTable}
        </tbody>
      </table>
      
      <p>Prepared by: ${data.agentName}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      
      <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
        <strong>DISCLAIMER:</strong> This calculator provides hypothetical projections based on the inputs provided. 
        Actual results may vary. The projections are for illustrative purposes only and 
        do not guarantee future performance. Please consult with a financial advisor 
        before making any investment decisions.
      </p>
    </div>
  `

  // For development purposes, we'll just log the email content
  console.log(`Email would be sent to ${data.to} with the following content:`)
  console.log(html)

  // In production, uncomment this to actually send the email
  /*
  await transporter.sendMail({
    from: '"Premium Calculator" <calculator@example.com>',
    to: data.to,
    subject: "Premium Calculator Results",
    html,
  });
  */

  return { success: true }
}
