import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportReportToPDF(elementId, filename) {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 10

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20
    }

    // Check if running in Electron
    if (window.electronAPI) {
      const buffer = pdf.output('arraybuffer')
      await window.electronAPI.savePDF(buffer, filename)
    } else {
      pdf.save(filename)
    }

    return true
  } catch (err) {
    console.error('PDF export failed:', err)
    return false
  }
}

export async function exportAllReportsToPDF(reports) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()

  // Cover page
  pdf.setFillColor(15, 31, 61)
  pdf.rect(0, 0, pageWidth, 297, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(22)
  pdf.text('Medical Hazardous Waste Survey', pageWidth / 2, 80, { align: 'center' })
  pdf.setFontSize(16)
  pdf.text('Honiara Referral Hospital', pageWidth / 2, 95, { align: 'center' })
  pdf.setFontSize(12)
  pdf.text('Solomon Islands', pageWidth / 2, 108, { align: 'center' })
  pdf.setFontSize(10)
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, 240, { align: 'center' })
  pdf.text(`Total Respondents: ${reports.demographic?.total || 0}`, pageWidth / 2, 252, { align: 'center' })

  const reportIds = [
    'report-demographic', 'report-training', 'report-disposal',
    'report-disease', 'report-environmental', 'report-policy',
    'report-challenges', 'report-composite'
  ]

  for (const id of reportIds) {
    const element = document.getElementById(id)
    if (!element) continue

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pageHeight = pdf.internal.pageSize.getHeight() - 20

    pdf.addPage()
    let heightLeft = imgHeight
    let position = 10

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, Math.min(imgHeight, pageHeight))
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      pdf.addPage()
      position = -(imgHeight - heightLeft) + 10
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
  }

  const filename = `AnisaSurvey_AllReports_${new Date().toISOString().split('T')[0]}.pdf`

  if (window.electronAPI) {
    const buffer = pdf.output('arraybuffer')
    await window.electronAPI.savePDF(buffer, filename)
  } else {
    pdf.save(filename)
  }
}
