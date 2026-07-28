import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class DownloadService {
  constructor() {}

    // content is assumed to be in CSV string format, as returned by supabase's .csv() method
    downloadFile(csvContent: string, filename = 'download.csv'): void {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.saveBlob(blob, filename);
    }

    // Credit for saveBlob method goes to Łukasz Holeczek
    // https://coreui.io/answers/how-to-download-files-in-angular/
    private saveBlob(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        anchor.click()
        URL.revokeObjectURL(url)
    }
}