import * as html2pdf from 'html2pdf.js';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';  // Correct import for FileSaver
import { EdiotorService } from 'src/app/services/editor.service';  // Correct spelling for EditorService
import { YouTubeService } from 'src/app/services/youtube.service';
import { EditorData } from 'src/app/models/editor.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editorData: EditorData = {
    content: '',
    youtubeUrl: '',
    linkedinUrl: ''
  };

  selectedFiles: string[] = [];
  youtubeVideoId: string | null = null; 
  youtubeEmbedUrl: SafeResourceUrl | null = null; 
  linkedinEmbedUrl: SafeResourceUrl | null = null; 

  constructor(
    private editorService: EdiotorService,  
    private youtubeService: YouTubeService,
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    this.editorData = this.editorService.getEditorData();
  }

  onContentChange(event: any): void {
    this.editorData.content = event.target.innerHTML;
    this.editorService.updateContent(this.editorData.content); 
  }

  formatText(command: string): void {
    document.execCommand(command, false, undefined); 
  }

  onFileAttach(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push(e.target.result);
      };
      reader.readAsDataURL(file); 
    }
  }

  insertImage(imageUrl: string | null): void {
    const imgMarkdown = `<img src="${imageUrl?.toString()}" alt="Image" />`;
    this.editorData.content += imgMarkdown;
  }

  checkYouTubeAccess(url: string): void {
    const result = this.youtubeService.checkYouTubeAccess(url);
    if (result.accessible) {
      this.youtubeVideoId = this.extractVideoId(url); 
      this.youtubeEmbedUrl = this.getYoutubeEmbedUrl(this.youtubeVideoId); 
      alert(`YouTube video with ID ${result.videoId} is accessible.`);
    } else {
      alert('Invalid YouTube URL');
      this.youtubeVideoId = null; 
      this.youtubeEmbedUrl = null; 
    }
  }

  checkLinkedInPost(url: string): void {
    if (this.isValidLinkedInUrl(url)) {
      this.linkedinEmbedUrl = this.getLinkedInEmbedUrl(url); 
      alert('LinkedIn post is accessible.');
    } else {
      alert('Invalid LinkedIn URL');
      this.linkedinEmbedUrl = null; 
    }
  }

  private isValidLinkedInUrl(url: string): boolean {
    const regex = /^(https?:\/\/)?(www\.)?(linkedin\.com\/posts\/)/;
    return regex.test(url);
  }

  getLinkedInEmbedUrl(postUrl: string): SafeResourceUrl | null {
    return postUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(postUrl) : null;
  }

  updateLinkedinEmbed(): void {
    const url = this.editorData.linkedinUrl; 
    this.linkedinEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extractVideoId(url: string): string | null {
    const regex = /[?&]v=([^&#]*)/; 
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  getYoutubeEmbedUrl(videoId: string | null): SafeResourceUrl | null {
    return videoId ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`) : null;
  }

  saveAsPDF(): void {
    const options = {
      filename: 'article.pdf',
      html2canvas: {},
      jsPDF: { orientation: 'portrait' }
    };

    const content: HTMLElement = document.getElementById('editor-content') as HTMLElement;

    html2pdf()
      .from(content)  
      .set(options)
      .save();
  }

  
  saveAsHTML(): void {
    const content = document.getElementById('editor-content')?.innerHTML;
    const blob = new Blob([content || ''], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'article.html');  
  }
}
