import { CronJob } from "cron";
import { DatabaseUtil, FirebaseService, TimeUtil } from "../services";
import { InvitationEntity } from "../persistence";

export class CronConfig {
    
    private static readonly CRON_DAILY_AT_3_15_AM = "15 3 * * *";
    private static readonly HOURS_72 = 72;
    private static readonly MINUTES_30_MILLIS = 30 * 60 * 1000;
    
    public static initialize() {
        CronConfig.scheduleInvitationCleanup();
    }
    
    private static scheduleInvitationCleanup() {
        const cronJob = new CronJob(CronConfig.CRON_DAILY_AT_3_15_AM, async () => {
            try {
                const threeDaysBack = TimeUtil.getNHoursBack(CronConfig.HOURS_72);
                
                const invitesRef = await FirebaseService.getDatabase()
                    .collection(InvitationEntity.TABLE_NAME)
                    .where("createdAt", "<", threeDaysBack)
                    .get();
                
                await DatabaseUtil.deleteQuery(invitesRef);
                console.log(`Cron jon 'INVITE_CLEANUP' ran successfully at ${new Date().toISOString()}`);
            } catch (err) {
                console.error("Cron job 'INVITE_CLEANUP' has failed!");
            }
        });
        
        const startTime = new Date();
        startTime.setMilliseconds(startTime.getMilliseconds() + CronConfig.MINUTES_30_MILLIS);
        
        console.log(`Cron job 'INVITE_CLEANUP' will start at '${startTime.toISOString()}' and will use pattern '${CronConfig.CRON_DAILY_AT_3_15_AM}'`);
        setTimeout(() => {
            cronJob.start();
        }, CronConfig.MINUTES_30_MILLIS);
    }
    
}
