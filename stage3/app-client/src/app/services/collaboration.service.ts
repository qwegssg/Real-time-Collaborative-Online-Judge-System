import { Injectable } from '@angular/core';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  collaboration_socket: any;

  constructor() { }

  // listen to the change from server side, apply the change:
  init(editor: any, sessionId: string): void {
    this.collaboration_socket = io(window.location.origin, { query: 'sessionId= ' + sessionId });
    this.collaboration_socket.on('change', (delta: string) => {
      console.log('collaborative editor changed: ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });


    // this.collaboration_socket.on('message', (message) => {
    //   console.log('received: ' + message);
    // });
  }

  // send change delta to server:
  change(delta: string): void {
    this.collaboration_socket.emit('change', delta);
  }

}
