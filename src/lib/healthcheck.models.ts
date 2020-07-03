export type HealthStatus = "UP" | "DOWN";

export class HealthCheck {
    public status: HealthStatus;
    public name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    public up() {
        this.status = "UP";
    }
    
    public down() {
        this.status = "DOWN";
    }
}

export class HealthcheckReport {
    public status: HealthStatus;
    public checks: HealthCheck[];
    
    constructor() {
        this.checks = [];
    }
    
    public static noChecks(): HealthcheckReport {
        const report = new HealthcheckReport();
        report.status = "UP";
        report.checks = [];
        return report;
    }
}
