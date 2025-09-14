import { Injectable } from '@angular/core'
import { filter } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { Router, NavigationStart } from '@angular/router'
import { WsEvents } from './events'
import { EventService } from './event.service'
import { ChatbotService } from 'src/app/components/app-chatbot/chatbot.service'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare var $t: any

@Injectable({
  providedIn: 'root',
})

export class TelemetryService {
  previousUrl: string | null = null
  telemetryConfig: any = null
  pData: any = null
  contextCdata = []
  isAnonymousTelemetry = true
  telArray: any = []
  externalApps: any = {
    RBCP: 'rbcp-web-ui',
  }
  instanceConfig: any
  configDetails: any
  telConfig: any
  constructor(
    private eventsSvc: EventService,
    private router: Router,
    private http: HttpClient
  ) {
    this.getConfigDetails().subscribe((response: any) => {
      this.configDetails = response
      this.telConfig = response.telemetryConfig
      this.telConfig.endpoint = response.telmetryUrl + this.telConfig.endpoint
      this.telConfig.publicEndpoint = response.telmetryUrl + this.telConfig.publicEndpoint
      this.telConfig.protectedEndpoint = response.telmetryUrl + this.telConfig.protectedEndpoint
      this.instanceConfig = this.telConfig
      this.navigationStart()
      this.initializeConfig(this.instanceConfig)
      this.addCustomListener()
      this.addCustomImpressionListener()
   
    })
  }

  getConfigDetails(): Observable<any> {
    if (this.configDetails) {
      return this.configDetails as Observable<any>
    }
    return this.http.get<any>('assets/jsonfiles/configurations.json');
  }

  private navigationStart() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('/public/') || event.url.includes('&preview=true') || event.url.includes('/certs')) {
          this.isAnonymousTelemetry = true
          this.updateTelemetryConfig()
          this.initializeConfig(this.instanceConfig)
        }
      }
    })
  }

  get isAnonymousTelemetryRequired(): boolean {
    return this.isAnonymousTelemetry
  }

  private updateTelemetryConfig() {
    if (this.instanceConfig) {
      if (this.isAnonymousTelemetryRequired) {
        this.instanceConfig.endpoint = this.instanceConfig.publicEndpoint
      } else {
        this.instanceConfig.endpoint = this.instanceConfig.protectedEndpoint
      }
    }
  }

  private initializeConfig(instanceConfig: any | null) {
    if (instanceConfig) {
      this.telemetryConfig = instanceConfig
      this.telemetryConfig = {
        ...this.telemetryConfig,
        pdata: {
          ...this.telemetryConfig.pdata,
          // pid: navigator.userAgent,
          id: `${environment.name}.${this.telemetryConfig.pdata.id}`,
        },
        uid: 'anonymous',
        channel: this.telemetryConfig.channel,
        sid: this.getTelemetrySessionId,
      }
      this.pData = this.telemetryConfig.pdata
    }
  }

  get getTelemetrySessionId(): string {
    return localStorage.getItem('telemetrySessionId') || ''
  }

  start(edata: any, data: any, pageContext?: WsEvents.ITelemetryPageContext) {
    try {
      if (this.telemetryConfig) {
        $t.start(
          this.telemetryConfig,
          (pageContext && pageContext.pageId) ?
            pageContext.pageId
            : '',
          '1.0',
          {
            // id,
            type: edata.type,
            mode: edata.mode,
            pageid: (pageContext && pageContext.pageId) ?
              pageContext.pageId
              : '',
            duration: 1,
          },
          {
            context: {
              pdata: {
                ...this.pData,
                id: this.pData.id,
              },
              ...(pageContext && pageContext.module ? { env: pageContext.module } : null),
            },
            object: {
              ...(data || {}),
            },
            actor: {id: 'non-loggedin', type: "AnonymousUser"}
          },
        )
      } else {
        //this.logger.error('Error Initializing Telemetry. Config missing.')
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in telemetry start', e)
    }
  }

  end(edata: any, data: any, pageContext?: WsEvents.ITelemetryPageContext) {
    try {
      $t.end(
        {
          type: edata.type,
          mode: edata.mode,
          pageid: (pageContext && pageContext.pageId) ?
            pageContext.pageId
            : '',
        },
        {
          context: {
            pdata: {
              ...this.pData,
              id: this.pData.id,
            },
            ...(pageContext && pageContext.module ? { env: pageContext.module } : null),
          },
          object: {
            ...(data || {}),
          },
          actor: {id: 'non-loggedin', type: "AnonymousUser"}
        },
      )
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in telemetry end', e)
    }
  }

  addCustomListener() {

    this.eventsSvc.chatbotEvents$
      .pipe(
        filter(
          event =>
            event &&
            event.eventType === WsEvents.WsEventType.Telemetry &&
            event.data.eventSubType ===  WsEvents.EnumTelemetrySubType.cardContent || event.data.eventSubType  === WsEvents.EnumTelemetrySubType.Chatbot &&
            event.data.mode &&
            event.data,
        ),
      )
      .subscribe(event => {
        console.log("Event from telemetry ", event)
        if (event.data.state === WsEvents.EnumTelemetrySubType.Loaded) {
          this.start(
            {
              type: event.data.type || WsEvents.WsTimeSpentType.Player,
              mode: event.data.mode || WsEvents.WsTimeSpentMode.Play,
            },
            event.data && event.data.object || {},
            event.pageContext
          )
        }
        if (
          event.data.state === WsEvents.EnumTelemetrySubType.Unloaded
        ) {
          this.end({
            type: event.data.type || WsEvents.WsTimeSpentType.Player,
            mode: event.data.mode || WsEvents.WsTimeSpentMode.Play,
          },
          event.data && event.data.object || {},
                   event.pageContext
          )
        }
        if (
          event.data.state === WsEvents.EnumTelemetrySubType.Interact
        ) {
          $t.interact(
            {
              type: event.data.edata.type,
              subtype: event.data.edata.subType,
              id: (event.data.edata && event.data.edata.id) ?
                event.data.edata.id
                : '',
              pageid: event.pageContext && event.pageContext.pageId || '',
            },
            {
              context: {
                pdata: {
                  ...this.pData,
                  id: this.pData.id,
                },
                ...(event.pageContext && event.pageContext.module ? { env: event.pageContext.module } : null),
              },
              object: {
                ...event.data.object,
              },
              actor: {id: 'non-loggedin', type: "AnonymousUser"}
            },
          )
        }

      })
  }

  addCustomImpressionListener() {
    this.eventsSvc.events$
      .pipe(
        filter(
          (event: WsEvents.WsEventTelemetryImpression) =>
            event &&
            event.data &&
            event.eventType === WsEvents.WsEventType.Telemetry &&
            event.data.eventSubType === WsEvents.EnumTelemetrySubType.Impression,
        ),
      )
      .subscribe(event => {
        try {
          // console.log('event.data::', event.data)
          this.impression(event.data)
        } catch (e) {
          // tslint:disable-next-line: no-console
          console.log('Error in telemetry impression', e)
        }
      })
  }

  impression(data?: any) {
    try {
      const page = this.getPageDetails()
      if (data && data.pageContext) {
        page.pageid = data.pageContext.pageId
        page.module = data.pageContext.module
      }
      const edata = {
        pageid: page.pageid, // Required. Unique page id
        type: page.pageUrlParts[0], // Required. Impression type (list, detail, view, edit, workflow, search)
        uri: page.pageUrl,
      }
      if (page.objectId) {
        const config = {
          context: {
            pdata: {
              ...this.pData,
              id: this.pData.id,
            },
            env: page.module || (this.telemetryConfig && this.telemetryConfig.env),
          },
          object: {
            id: page.objectId,
            // This will override above id if the data has object in it.
            ...((data) ? data.object : {}),
          },
        }
        $t.impression(edata, config)
      } else {
        $t.impression(edata, {
          context: {
            pdata: {
              ...this.pData,
              id: this.pData.id,
            },
            env: page.module || '',
          },
          object: {
            ...((data) ? data.object : {}),
          },
        })
      }
      this.previousUrl = page.pageUrl
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in telemetry impression', e)
    }
  }
  getPageDetails() {
    const path = window.location.pathname.replace('/', '')
    const url = path + window.location.search
    return {
      pageid: path,
      pageUrl: url,
      pageUrlParts: path.split('/'),
      refferUrl: this.previousUrl,
      objectId: this.extractContentIdFromUrlParts(path.split('/')),
      module: '',
    }
  }
  extractContentIdFromUrlParts(urlParts: string[]) {
    // TODO: pick toc and viewer url from some configuration
    const tocIdx = urlParts.indexOf('toc')
    const viewerIdx = urlParts.indexOf('viewer')

    if (tocIdx === -1 && viewerIdx === -1) {
      return null
    }

    if (tocIdx !== -1 && tocIdx < urlParts.length - 1) {
      return urlParts[tocIdx + 1] // e.g. url /app/toc/<content_id>
    }

    if (viewerIdx !== -1 && viewerIdx < urlParts.length - 2) {
      return urlParts[viewerIdx + 2] // e.g. url /app/viewer/<content_type>/<content_id>
    }

    return null
  }
}
