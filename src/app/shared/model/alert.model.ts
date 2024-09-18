import { AlertType } from 'src/app/shared/enum/alert.enum';

export class Alert {
    type: AlertType;
    message: string;
    alertId: string;
    keepAfterRouteChange: boolean;

    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}