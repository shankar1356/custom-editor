import { Injectable } from "@angular/core";
import { EditorData } from "../models/editor.model";

@Injectable({
    providedIn: 'root',
  })

export class EdiotorService{
    private editorData: EditorData={
        content:'',
        youtubeUrl:'',
        linkedinUrl:'',
    };

    getEditorData():EditorData{
        return this.editorData;
    }

    updateContent(content:string):void{
        this.editorData.content= content;
    }

    updateYouTubeUrl(url:string):void{
        this.editorData.youtubeUrl = url;
    }

    updateLinkedinUrl(url:string):void{
        this.editorData.linkedinUrl= url;
    }


}  
