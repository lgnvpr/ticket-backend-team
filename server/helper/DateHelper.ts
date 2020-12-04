export class DateHelper{
    public static removeToDDMMYYY(date: Date): Date{
        var getDate: Date =new Date();
		getDate.setHours(0);
		getDate.setMinutes(0);
		getDate.setSeconds(0);
		getDate.setMilliseconds(0);
		return getDate;
    }
}