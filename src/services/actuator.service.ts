import { HealthCheck, HealthcheckReport } from "../lib";
import { PersistenceManager } from "../config";


export class ActuatorService {
    
    public static async readinessCheck(): Promise<HealthcheckReport> {
        const report = new HealthcheckReport();
        
        report.checks.push(await ActuatorService.databaseCheck());
        
        report.status = report.checks.filter(check => check.status === "UP").length === report.checks.length ? "UP" : "DOWN";
        return report;
    }
    
    public static async livenessCheck(): Promise<HealthcheckReport> {
        return HealthcheckReport.noChecks();
    }
    
    private static async databaseCheck(): Promise<HealthCheck> {
        const check = new HealthCheck("DataSourceHealthCheck");
        try {
            await PersistenceManager.getInstance().query("SELECT NOW()");
            check.up();
        } catch (err) {
            console.error(err);
            check.down();
        }
        return check;
    }
    
}
