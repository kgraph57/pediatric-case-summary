import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import type { CaseSummaryResult } from '../types'

export async function downloadWord(result: CaseSummaryResult) {
  const lines = result.summary.split('\n').filter((line) => line.trim())

  const paragraphs = lines.map((line) => {
    const isHeader = line.startsWith('症例番号:') || 
                     line.startsWith('分野番号:') ||
                     line.startsWith('患者ID:') ||
                     line.startsWith('入院・外来:') ||
                     line.startsWith('受け持ち期間:') ||
                     line.startsWith('年齢:') ||
                     line.startsWith('性別:') ||
                     line.startsWith('転帰:') ||
                     line.match(/^【.+】$/)

    const isSectionHeader = line.match(/^【.+】$/)

    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          font: isSectionHeader ? 'MS Mincho' : 'MS Mincho',
          size: isHeader ? 22 : 20,
          bold: isSectionHeader,
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: {
        after: isSectionHeader ? 240 : 120,
      },
    })
  })

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const fileName = `症例要約_${result.caseNumber}_分野${result.fieldNumber}.docx`
  saveAs(blob, fileName)
}
