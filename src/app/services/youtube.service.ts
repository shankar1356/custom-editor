
import { Injectable } from '@angular/core';
import { YouTubeData } from '../models/youtube.model';

@Injectable({
  providedIn: 'root',
})
export class YouTubeService {
  checkYouTubeAccess(videoUrl: string): YouTubeData {
    
    const videoId = this.extractVideoId(videoUrl);
    const accessible = videoId ? true : false; 
    return { videoId, accessible };
  }

  private extractVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
