import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CognitivePrediction,
  MedicationsStatistics,
  MindGamesStatistics,
  RoutinesStatistics,
  TelemetryStatistics,
} from 'src/app/core/interfaces/report';
import { MainService } from 'src/app/context/main.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { CleanDatePipe } from 'src/app/core/pipelines/clean-date.pipe';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, CleanDatePipe],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  cognitivePrediction: CognitivePrediction = {} as CognitivePrediction;
  mindGamesStatistics: MindGamesStatistics = {} as MindGamesStatistics;
  routinesStatistics: RoutinesStatistics = {} as RoutinesStatistics;
  medicationsStatistics: MedicationsStatistics = {} as MedicationsStatistics;
  telemetryStatistics: TelemetryStatistics = {} as TelemetryStatistics;
  patientId: number = 0;

  constructor(
    private _mainService: MainService,
    private _doctorervice: DoctorService,
  ) {}

  ngOnInit(): void {
    this._mainService.currentPatientID.subscribe((patientID) => {
      this.patientId = Number(patientID);
      this.getPatientReport();
    });
  }

  getPatientReport(): void {
    this._doctorervice.getPatientReport(this.patientId).subscribe({
      next: (response) => {
        this.cognitivePrediction = response.cognitive_prediction;
        this.mindGamesStatistics = response.mind_games_statistics;
        this.routinesStatistics = response.routines_statistics;
        this.medicationsStatistics = response.medications_statistics;
        this.telemetryStatistics = response.telemetry_statistics;
      },
      error: (err) => {
        console.log('There is error', err);
      },
    });
  }

  @ViewChild('reportSection') reportSection!: ElementRef;

  async downloadPDF(): Promise<void> {
    const element = this.reportSection.nativeElement;

    const allElements = element.querySelectorAll('*');
    const originalStyles: { el: HTMLElement; shadow: string }[] = [];

    allElements.forEach((el: HTMLElement) => {
      const shadow = el.style.boxShadow;
      if (shadow) {
        originalStyles.push({ el, shadow });
        el.style.boxShadow = 'none';
      }
    });

    const tabContents = element.querySelectorAll('.tab-content');
    const tabOriginals: { el: HTMLElement; shadow: string }[] = [];
    tabContents.forEach((el: HTMLElement) => {
      tabOriginals.push({ el, shadow: el.style.boxShadow });
      el.style.boxShadow = 'none';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    originalStyles.forEach(({ el, shadow }) => (el.style.boxShadow = shadow));
    tabOriginals.forEach(({ el, shadow }) => (el.style.boxShadow = shadow));

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = { top: 28, bottom: 18, left: 10, right: 10 };
    const headerHeight = 20;
    const footerHeight = 10;

    const contentWidth = pdfWidth - margin.left - margin.right;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    const usableHeight = pdfHeight - margin.top - margin.bottom;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const totalPages = Math.ceil(contentHeight / usableHeight);

    const drawHeader = (pageNum: number) => {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

      const logo = new Image();
      logo.src = './assets/images/Nesyan.png';
      pdf.addImage(logo, 'PNG', margin.left, 4, 12, 12);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(21, 93, 252);
      pdf.text('Nesyan', margin.left + 13, headerHeight / 2 + 1.5);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(21, 93, 252);
      pdf.text('Patient Report', margin.left + 13, headerHeight / 2 + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(21, 93, 252);
      pdf.text(
        `${dateStr}  ${timeStr}`,
        pdfWidth - margin.right,
        headerHeight / 2 + 6,
        { align: 'right' },
      );

      pdf.setFontSize(8);
      pdf.setTextColor(21, 93, 252);
      pdf.text(
        'Extracted at',
        pdfWidth - margin.right,
        headerHeight / 2 + 1.5,
        {
          align: 'right',
        },
      );
    };

    const drawFooter = (pageNum: number) => {
      pdf.setDrawColor(21, 93, 252);
      pdf.setLineWidth(0.5);
      pdf.line(
        margin.left,
        pdfHeight - footerHeight,
        pdfWidth - margin.right,
        pdfHeight - footerHeight,
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Page ${pageNum} of ${totalPages}`,
        pdfWidth / 2,
        pdfHeight - footerHeight + 6,
        { align: 'center' },
      );

      pdf.setTextColor(21, 93, 252);
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        'Nesyan',
        pdfWidth - margin.right,
        pdfHeight - footerHeight + 6,
        { align: 'right' },
      );
    };

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();

      drawHeader(i + 1);
      drawFooter(i + 1);

      const sourceY = i * usableHeight * (canvas.height / contentHeight);
      const sourceHeight = usableHeight * (canvas.height / contentHeight);

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;

      const ctx = pageCanvas.getContext('2d')!;
      ctx.drawImage(canvas, 0, -sourceY);

      const pageImgData = pageCanvas.toDataURL('image/png');
      pdf.addImage(
        pageImgData,
        'PNG',
        margin.left,
        margin.top,
        contentWidth,
        usableHeight,
      );
    }

    pdf.save('patient-report.pdf');
  }
}
