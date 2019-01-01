import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Script } from '../../script.model';

@Injectable({providedIn: 'root'})
export class MessageService {
  private scripts: Script[] = [];
  private scriptsUpdated = new Subject<Script[]>();

  constructor(private http: HttpClient) {}

  getScripts() {

    this.http.get<{message:string, scripts: Script[]}>('http://localhost:3000/api/scripts').subscribe((scriptData) => {

      this.scripts = scriptData.scripts;
      this.scriptsUpdated.next([...this.scripts]);

    });

  }

  getScriptUpdateListener() {
    return this.scriptsUpdated.asObservable();
  }

  addScript(sentence: string, paragraph: string) {
    const script: Script = { _id: null, sentence: sentence, paragraph: paragraph};
    this.http.post<{message: string, scriptId: string}>('http://localhost:3000/api/scripts', script)
      .subscribe(responseData =>{

        const scriptId = responseData.scriptId;
        script._id = scriptId;
        this.scripts.push(script);
        this.scriptsUpdated.next([...this.scripts]);

    });

  }

  deleteScript(scriptId: string) {
    this.http.delete("http://localhost:3000/api/scripts/" + scriptId)
      .subscribe(() => {
        const updatedScripts = this.scripts.filter( tile => tile._id !== scriptId);
        this.scripts = updatedScripts;
        this.scriptsUpdated.next([...this.scripts]);
      });
    console.log("http://localhost:3000/api/scripts/" + scriptId);
  }

}
