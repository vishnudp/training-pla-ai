import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WsEvents } from './events'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsChatbotSubject = new Subject<WsEvents.IWsEvents<any>>()
  public chatbotEvents$ = this.eventsChatbotSubject.asObservable()
  private eventsSubject = new Subject<WsEvents.IWsEvents<any>>()
  public events$ = this.eventsSubject.asObservable()

  dispatchChatbotEvent<T>(event: WsEvents.IWsEvents<T>) {
    console.log("event ", event)
    this.eventsChatbotSubject.next(event)
  }
}
