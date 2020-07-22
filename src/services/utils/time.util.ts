
export class TimeUtil {
    
    public static getNHoursBack(hours: number): Date {
        const time = new Date();
        time.setHours(time.getHours() - hours);
        return time;
    }
    
}
