import { Component } from "@angular/core";
import { VIDEO_CONF } from "../shared/constant/app.constant";

@Component({
  selector: "app-public-maintenance",
  templateUrl: "./public-maintenance.component.html",
  styleUrls: ["./public-maintenance.component.scss"],
})
export class PublicMaintenanceComponent {
  videoConf: any = VIDEO_CONF;

  videoTunbnails = [
    {
      image: "/assets/maintenance/karmayogi-talk.svg",
      url: "https://www.youtube.com/playlist?list=PLMzVnzbHaB8tpuYUiTTITmSgMfH8uZWMN",
    },
    {
      image: "/assets/maintenance/Course-preview.svg",
      url: "https://www.youtube.com/playlist?list=PLMzVnzbHaB8uqc3APlK_oXkDaOhmMmrrY",
    },
  ];

  redirectTo(url: any) {
    window.location.href = url;
  }
}
