import Api from "../Api";
import {Report} from "../../types/ReportTypes";

class ReportService extends Api {
    constructor() {
        super('/reports')
    }

    create(report: Report): Promise<boolean> {
        return this.http.post(this.getUrl(), report)
    }

}

export default ReportService
