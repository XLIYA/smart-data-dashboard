// src/lib/pdf-export.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import type { ColumnMeta } from '@/stores/dataStore'
import {
  calculateStatistics,
  calculateColumnStats,
  calculateCorrelations,
  detectOutliers,
} from './data-mining'

interface ExportPDFOptions {
  data: any[]
  columns: ColumnMeta[]  // ✅ تایپ صحیح
  charts?: HTMLElement[]
  fileName?: string
  title?: string
}

export const exportToPDF = async ({
  data,
  columns,
  charts = [],
  fileName = 'report',
  title = 'Data Analysis Report',
}: ExportPDFOptions) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Calculate all statistics
  const stats = calculateStatistics(data, columns)
  const columnStats = calculateColumnStats(data, columns)
  const correlations = calculateCorrelations(data, columns).slice(0, 5)
  const outliers = detectOutliers(data, columns)

  // ============ PAGE 1: COVER ============
  pdf.setFillColor(6, 182, 212)
  pdf.rect(0, 0, pageWidth, 60, 'F')

  pdf.setFontSize(28)
  pdf.setTextColor(255, 255, 255)
  pdf.text(title, pageWidth / 2, 35, { align: 'center' })

  pdf.setFontSize(12)
  pdf.setTextColor(240, 240, 240)
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 45, {
    align: 'center',
  })

  // Company/Project Info
  yPosition = 80
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text('BluViz Smart Dashboard', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 6
  pdf.text('Advanced Data Analysis & Visualization Platform', pageWidth / 2, yPosition, {
    align: 'center',
  })

  // Dataset Summary Box
  yPosition = 110
  pdf.setDrawColor(6, 182, 212)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(14, yPosition, pageWidth - 28, 60, 3, 3)

  yPosition += 10
  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Dataset Summary', pageWidth / 2, yPosition, { align: 'center' })

  yPosition += 15
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)

  const summaryData = [
    ['Total Rows', stats.totalRows.toLocaleString()],
    ['Total Columns', stats.totalColumns.toString()],
    ['Numeric Columns', stats.numericColumns.toString()],
    ['Categorical Columns', stats.categoricalColumns.toString()],
    ['Missing Values', stats.missingValues.toString()],
    ['Duplicate Rows', stats.duplicateRows.toString()],
  ]

  const colWidth = (pageWidth - 40) / 2
  summaryData.forEach((item, index) => {
    const row = Math.floor(index / 2)
    const col = index % 2
    const x = 20 + col * colWidth
    const y = yPosition + row * 10

    pdf.setFont('helvetica', 'bold')
    pdf.text(item[0] + ':', x, y)
    pdf.setFont('helvetica', 'normal')
    pdf.text(item[1], x + 50, y)
  })

  // ============ PAGE 2: COLUMN STATISTICS ============
  pdf.addPage()
  yPosition = 20

  pdf.setFontSize(18)
  pdf.setTextColor(6, 182, 212)
  pdf.text('Column Statistics', 14, yPosition)
  yPosition += 10

  columnStats.slice(0, 10).forEach((col) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage()
      yPosition = 20
    }

    // Column name with type badge
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text(col.name, 14, yPosition)

    // Type badge
    pdf.setFontSize(8)
    pdf.setFillColor(59, 130, 246)
    pdf.roundedRect(14 + pdf.getTextWidth(col.name) + 3, yPosition - 3, 20, 5, 1, 1, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.text(col.type, 14 + pdf.getTextWidth(col.name) + 5, yPosition)

    yPosition += 8

    // Stats
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(60, 60, 60)

    const colStats = [
      `Count: ${col.count}`,
      `Unique: ${col.unique}`,
      `Missing: ${col.missing}`,
    ]

    if (col.mean !== undefined) {
      colStats.push(`Mean: ${col.mean.toFixed(2)}`)
    }
    if (col.median !== undefined) {
      colStats.push(`Median: ${col.median.toFixed(2)}`)
    }
    if (col.std !== undefined) {
      colStats.push(`Std: ${col.std.toFixed(2)}`)
    }
    if (col.min !== undefined) {
      colStats.push(`Min: ${col.min.toFixed(2)}`)
    }
    if (col.max !== undefined) {
      colStats.push(`Max: ${col.max.toFixed(2)}`)
    }

    pdf.text(colStats.join(' | '), 14, yPosition)
    yPosition += 8

    // Distribution (top 5)
    if (col.distribution && col.distribution.length > 0) {
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text('Top Values:', 14, yPosition)
      yPosition += 5

      col.distribution.slice(0, 5).forEach((dist) => {
        const percent = ((dist.count / col.count) * 100).toFixed(1)
        pdf.text(
          `  • ${String(dist.value).substring(0, 30)}: ${dist.count} (${percent}%)`,
          14,
          yPosition
        )
        yPosition += 4
      })
    }

    yPosition += 5
    pdf.setDrawColor(220, 220, 220)
    pdf.line(14, yPosition, pageWidth - 14, yPosition)
    yPosition += 8
  })

  // ============ PAGE 3: CORRELATIONS ============
  if (correlations.length > 0) {
    pdf.addPage()
    yPosition = 20

    pdf.setFontSize(18)
    pdf.setTextColor(6, 182, 212)
    pdf.text('Correlation Analysis', 14, yPosition)
    yPosition += 15

    correlations.forEach((corr) => {
      const absCorr = Math.abs(corr.correlation)
      let color: [number, number, number] = [100, 100, 100]
      let strength = 'Weak'

      if (absCorr > 0.7) {
        color = [34, 197, 94] // green
        strength = 'Strong'
      } else if (absCorr > 0.4) {
        color = [234, 179, 8] // yellow
        strength = 'Moderate'
      } else {
        color = [156, 163, 175] // gray
      }

      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${corr.col1} ↔ ${corr.col2}`, 14, yPosition)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(60, 60, 60)
      yPosition += 6
      pdf.text(`Correlation: ${corr.correlation.toFixed(3)} (${strength})`, 14, yPosition)

      // Progress bar
      yPosition += 6
      const barWidth = 100
      pdf.setDrawColor(220, 220, 220)
      pdf.setLineWidth(0.5)
      pdf.rect(14, yPosition - 3, barWidth, 4)

      pdf.setFillColor(...color)
      pdf.rect(14, yPosition - 3, barWidth * absCorr, 4, 'F')

      yPosition += 12
    })
  }

  // ============ PAGE 4: OUTLIERS ============
  if (outliers.length > 0) {
    pdf.addPage()
    yPosition = 20

    pdf.setFontSize(18)
    pdf.setTextColor(6, 182, 212)
    pdf.text('Outlier Detection', 14, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Statistical outliers detected using IQR method', 14, yPosition)
    yPosition += 15

    outliers.forEach((out) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'bold')
      pdf.text(out.column, 14, yPosition)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(60, 60, 60)
      yPosition += 6

      pdf.text(`Outliers Found: ${out.count}`, 14, yPosition)
      yPosition += 5
      pdf.text(
        `Range: ${Math.min(...out.outliers).toFixed(2)} to ${Math.max(...out.outliers).toFixed(2)}`,
        14,
        yPosition
      )

      // Show some outlier values
      yPosition += 5
      const sampleOutliers = out.outliers.slice(0, 10)
      pdf.text(
        `Sample: ${sampleOutliers.map((v) => v.toFixed(2)).join(', ')}${
          out.count > 10 ? '...' : ''
        }`,
        14,
        yPosition
      )

      yPosition += 12
    })
  }

  // ============ PAGES 5+: CHARTS ============
  if (charts.length > 0) {
    pdf.addPage()
    yPosition = 20

    pdf.setFontSize(18)
    pdf.setTextColor(6, 182, 212)
    pdf.text('Visualizations', 14, yPosition)
    yPosition += 15

    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i]

      if (yPosition > pageHeight - 100) {
        pdf.addPage()
        yPosition = 20
      }

      try {
        const canvas = await html2canvas(chart, {
          backgroundColor: '#ffffff',
          scale: 2,
        })
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = pageWidth - 28
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 14, yPosition, imgWidth, imgHeight)
        yPosition += imgHeight + 15
      } catch (error) {
        console.error('Error converting chart:', error)
      }
    }
  }

  // ============ LAST PAGE: DATA TABLE ============
  pdf.addPage()
  yPosition = 20

  pdf.setFontSize(18)
  pdf.setTextColor(6, 182, 212)
  pdf.text('Data Sample', 14, yPosition)
  pdf.setFontSize(9)
  pdf.setTextColor(100, 100, 100)
  pdf.text('(First 100 rows)', 14, yPosition + 6)
  yPosition += 15

  const headers = columns.map((c) => c.name)
  const rows = data.slice(0, 100).map((row) =>
    columns.map((c) => {
      const val = row[c.name]
      if (val == null) return '-'
      if (typeof val === 'number') return val.toFixed(2)
      return String(val).substring(0, 30)
    })
  )

  autoTable(pdf, {
    head: [headers],
    body: rows,
    startY: yPosition,
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [6, 182, 212],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: columns.reduce((acc, col, index) => {
      acc[index] = {
        cellWidth: 'auto',
        halign: col.type === 'number' ? 'right' : 'left',
      }
      return acc
    }, {} as any),
    margin: { left: 14, right: 14 },
  })

  // ============ FOOTER ON ALL PAGES ============
  const totalPages = (pdf as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)

    // Page number
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
      align: 'center',
    })

    // Footer line
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.5)
    pdf.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)

    // Company name
    pdf.setFontSize(7)
    pdf.text('BluViz Analytics', 14, pageHeight - 10)
    pdf.text(new Date().toLocaleDateString(), pageWidth - 14, pageHeight - 10, {
      align: 'right',
    })
  }

  // Save PDF
  pdf.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`)
}