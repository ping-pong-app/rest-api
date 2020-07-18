import { CronJob } from "cron";

export class CronConfig {
    
    private static CRON_DAILY_AT_3_15_AM= "15 3 * * *";
    
    public static initialize() {
        const cronJob = new CronJob(CronConfig.CRON_DAILY_AT_3_15_AM, () => {
            // cleanup old invites
        });
        // cronJob.start();
    }
    
}
