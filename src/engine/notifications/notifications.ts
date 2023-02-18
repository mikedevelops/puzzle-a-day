import { ui } from "../global";
import { createPanel, Panel, Position } from "../ui/panel";
import { clamp } from "../maths";

export function createNotifications(): Notifications {
  return new Notifications();
}

export interface NotificationTransport {
  log: (msg: string) => void;
}

interface Notification {
  content: string;
}

const NOTIFICATION_DURATION = 10_000;
const MAX_VISIBLE_NOTIFICATIONS = 7;

class Notifications {
  private notifications: Set<Notification & { created: number }> = new Set();
  private panel: Panel;

  constructor(private transport: NotificationTransport = console) {
    this.panel = createPanel("", Position.BottomRight);
    ui.addPanel(this.panel);
  }

  public createNotification(notification: Notification): void {
    this.notifications.add({ ...notification, created: Date.now() });
    this.transport.log(notification.content);
  }

  public update(): void {
    // // TODO (refactor): use the engine delta instead of Date here?
    // const now = Date.now();
    // for (const notification of this.notifications) {
    //   if (now - notification.created >= NOTIFICATION_DURATION) {
    //     this.notifications.delete(notification);
    //   }
    // }
  }

  public draw(): void {
    const notifications = [...this.notifications]
      .sort((a, b) => a.created - b.created)
      .slice(
        clamp(
          this.notifications.size - MAX_VISIBLE_NOTIFICATIONS,
          0,
          this.notifications.size
        )
      )
      .map((n) => n.content)
      .join("\n");

    this.panel.setContent(notifications);
  }
}
