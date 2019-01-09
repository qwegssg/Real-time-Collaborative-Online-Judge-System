import { Injectable } from '@angular/core';

import { COLORS } from '../../assets/colors';

declare var io: any;
declare var ace: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  collaboration_socket: any;
  clientsInfo: Object = {};
  clientNum = 0;

  constructor() { }

  // listen to the change from server side, apply the change:
  init(editor: any, sessionId: string): void {
    this.collaboration_socket = io(window.location.origin, { query: 'sessionId= ' + sessionId });

    // listen to the change from server side:
    this.collaboration_socket.on('change', (delta: string) => {
      console.log('collaborative editor changed: ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    // listen to the cursor move from server side:
    this.collaboration_socket.on('cursorMove', (cursor) => {
      console.log('cursor move: ' + cursor);
      const session = editor.getSession();
      cursor = JSON.parse(cursor);
      const x = cursor['row'];
      const y = cursor['column'];
      const changeClientId = cursor['socketId'];
      console.log(x + ' ' + y + ' ' + changeClientId);

      // if the moved cursor's client id is already stored:
      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      } else {
        this.clientsInfo[changeClientId] = {};

        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changeClientId
          + ' { position: absolute; background: ' + COLORS[this.clientNum] + ';'
          + 'z-index: 100; width: 3px !important; }';

        document.body.appendChild(css);
        this.clientNum++;
      }

      const Range = ace.require('ace/range').Range;
      const newMarker = session.addMarker(
        new Range(x, y, x, y + 1), 'editor_cursor_' + changeClientId, true);
      this.clientsInfo[changeClientId]['marker'] = newMarker;
    });

    // for test:
    // this.collaboration_socket.on('message', (message) => {
    //   console.log('received: ' + message);
    // });
  }

  // send change delta to server:
  change(delta: string): void {
    this.collaboration_socket.emit('change', delta);
  }

  // send cursor move to server:
  cursorMove(cursor: string): void {
    this.collaboration_socket.emit('cursorMove', cursor);
  }

  restoreBuffer(): void {
    this.collaboration_socket.emit('restoreBuffer');
  }

}
