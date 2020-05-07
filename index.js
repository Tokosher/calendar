const FULL_CYCLE = 500;
const MONTH_IN_YEAR = 12;
const DAYS_IN_MONTH = 30;
const DAYS_IN_WEEK = 7;
const IMPLICIT_EXCEPTION = 100;
const IMPLICIT_YEAR = 5;
const WEEK_CALENDAR_CHRONOS = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
];

/* During the calculations I calculated, that every 500 years day in the week does not shift
* In every 500 years we have 96 leap years and 404 not leap years
* If we multiply leap years on DAYS_IN_MONTH * MONTH_IN_YEAR % DAYS_IN_WEEK;
* And our non-leap years on (DAYS_IN_MONTH * MONTH_IN_YEAR + 1) % DAYS_IN_WEEK;
* We will have next next numbers --> 384 % DAYS_IN_WEEK = 6 AND 1212 % 7 = 1
* (6 + 1) % 7 = 0 --> day in the week does not shift
*
*
* Calculation for week
* 24/08/1001 is Tuesday
* 1001 year is not-leap year
* let start from 01/01/01 and we will know in what day of the week did Chronos year begin?
* 01/01/01 is what day of week?
* We have 7*30 + 24 = 234 days left from 01/01/01
* 234 % 7 = 3, that means, that the calendar start from Saturday!
*/

class ChronosCalendar {
    constructor(day, month, year, target) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.target = target;
    }

    totalDayOfWeek() {
        if (!this._isValidDate(this.day, this.month, this.year)) return;

        const biasYear = this._countDisplaceYears(this.year);
        const biasMonth = this.month === 1 ? 0 : this._countDisplaceMonths(this.month, this.year);
        const biasDays = this._countDisplaceDays(this.day);

        const totalBias = (biasYear + biasMonth + biasDays) % DAYS_IN_WEEK;

        this.target.innerText = WEEK_CALENDAR_CHRONOS[totalBias];
    }

    _dayOffsetsInYear(isLeap) {
        const dayOffsetsInYearLeap = (DAYS_IN_MONTH * MONTH_IN_YEAR + 1) % DAYS_IN_WEEK;
        const dayOffsetsInYearIsNotLeap = DAYS_IN_MONTH * MONTH_IN_YEAR % DAYS_IN_WEEK;

        return isLeap ? dayOffsetsInYearLeap : dayOffsetsInYearIsNotLeap;
    }

    _countDisplaceYears(year) {
        year %= FULL_CYCLE;

        let yearsPassed = (year) ? year - 1 : 499;

        const anExceptionYears = Math.floor(yearsPassed / IMPLICIT_EXCEPTION);
        const yearsLeap = Math.floor(yearsPassed / IMPLICIT_YEAR) - anExceptionYears;
        const leapYearsQuantity = yearsPassed - yearsLeap;

        const totalBiasLeap = yearsLeap * this._dayOffsetsInYear(true) % DAYS_IN_WEEK;
        const totalBiasIsNotLeap = leapYearsQuantity * this._dayOffsetsInYear(false) % DAYS_IN_WEEK;

        const totalBias = (totalBiasLeap + totalBiasIsNotLeap) % DAYS_IN_WEEK;
        return totalBias;
    }

    _countDisplaceMonths(month, year) {
        const yearIsLeap = this._isLeap(year);
        let daysPassed;

        const anExceptionMonth = month - 1;

        if (yearIsLeap && anExceptionMonth >= 2) {
            daysPassed = DAYS_IN_MONTH * anExceptionMonth + 1
        } else daysPassed = DAYS_IN_MONTH * anExceptionMonth;

        const totalBias = daysPassed % DAYS_IN_WEEK;

        return totalBias;
    }

    _countDisplaceDays(days) {
        return days % DAYS_IN_WEEK;
    }

    _isLeap(year) {
        if (year % 100 === 0 && year % FULL_CYCLE !== 0) return false;

        return year % FULL_CYCLE === 0 || year % IMPLICIT_YEAR === 0;
    }

    _wrongMessage(day, month, year) {
        const isLeap = this._isLeap(year);
        const errorMessage = {
            dayMore: 'Day cannot be more than 31',
            dayLess: 'Day cannot be less than 1',
            monthMore: 'Month cannot be more than 12',
            monthLess: 'Month cannot be less than 1',
            yearLess: 'Year cannot be less than 1',
            wrongMonthDays: 'This month cannot have 31 day',
            wrongMonth: '31 days can only be in February'
        };

        if (day > 31) return errorMessage.dayMore;

        if (day <= 0) return errorMessage.dayLess;

        if (month <= 0) return errorMessage.monthLess;

        if (month > MONTH_IN_YEAR) return errorMessage.monthMore;

        if (year <= 0) return errorMessage.yearLess;

        if (!isLeap && day > DAYS_IN_MONTH) return errorMessage.wrongMonthDays;

        if (isLeap && day > DAYS_IN_MONTH && month !== 2) return errorMessage.wrongMonth;
    }

    _isValidDate(day, month, year) {
        let message = this._wrongMessage(day, month, year);

        if (message) {
            this.target.innerText = message;

            return false;
        }

        return true;
    }
}

const target = document.querySelector('#target');
const button = document.querySelector('button');

button.addEventListener('click', () => {
    let currentDay = +document.querySelector('#day').value;
    let currentMonth = +document.querySelector('#month').value;
    let currentYear = +document.querySelector('#year').value;

    const weekDay = new ChronosCalendar(currentDay, currentMonth, currentYear, target);
    weekDay.totalDayOfWeek();
});