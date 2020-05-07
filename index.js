const FULL_CYCLE = 500;
const MONTH_IN_YEAR = 12;
const DAYS_IN_MONTH = 30;
const DAYS_IN_WEEK = 7;
const MULTIPLICITY_100 = 100;
const MULTIPLICITY_5 = 5;

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
    constructor(day,month,year) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.target = target;
    }

    _weekCalendarChronos = [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
    ];

    dayOnWeek() {
        this._validDate(this.day,  this.month, this.year);
        if(!this.validatorCheck) return;

        const biasYear = this._biasYear(this.year);
        const biasMonth = this._biasMonth(this.month, this.year);
        const biasDays = this._biasDay(this.day);

        const totalBias = (biasYear + biasMonth + biasDays) % DAYS_IN_WEEK;

        this.target.innerText = this._weekCalendarChronos[totalBias];
    }

    _dayOffsetsInYear(isLeap) {
        const dayOffsetsInYearLeap = (DAYS_IN_MONTH * MONTH_IN_YEAR + 1) % DAYS_IN_WEEK;
        const dayOffsetsInYearIsNotLeap = DAYS_IN_MONTH * MONTH_IN_YEAR % DAYS_IN_WEEK;

        if(isLeap) return dayOffsetsInYearLeap;
            return dayOffsetsInYearIsNotLeap;
    }

    _biasYear(year) {
        year %= FULL_CYCLE;
        let yearsPassed;
        if(year === 1) {
            return 0;
        }

        if(year === 0) {
            yearsPassed = 499
        } else  yearsPassed = year - 1;

        const anExceptionYears = Math.floor(yearsPassed / MULTIPLICITY_100);
        const yearsLeap = Math.floor(yearsPassed / MULTIPLICITY_5) - anExceptionYears;
        const yearsIsNotLeap = yearsPassed - yearsLeap;

        const totalBiasLeap = yearsLeap * this._dayOffsetsInYear(true) % DAYS_IN_WEEK;
        const totalBiasIsNotLeap = yearsIsNotLeap * this._dayOffsetsInYear(false) % DAYS_IN_WEEK;

        const totalBias = (totalBiasLeap + totalBiasIsNotLeap) % DAYS_IN_WEEK;
        return totalBias;
    }

    _biasMonth(month, year) {
        if(month === 1) return 0;
        const yearIsLeap = this._isLeap(year);
        let daysPassed;

        const anExceptionMonth = month - 1;

        if(yearIsLeap && anExceptionMonth >= 2) {
            daysPassed = DAYS_IN_MONTH * anExceptionMonth + 1
        } else daysPassed =  DAYS_IN_MONTH * anExceptionMonth;

        const totalBias = daysPassed % DAYS_IN_WEEK;

        return totalBias;
    }

    _biasDay(days) {
        return days % DAYS_IN_WEEK;
    }

    _isLeap(year) {
        if(year % FULL_CYCLE === 0) {
            return true
        } else if(year % MULTIPLICITY_100 === 0) {
            return false
        } else return year % MULTIPLICITY_5 === 0;
    }

    _validDate(day, month, year) {
        const isLeap = this._isLeap(year);

        if(day > 31)  return this.target.innerText = 'Day cannot be more than 31';
        if(day <= 0)  return this.target.innerText = 'Day cannot be less than 1';
        if(month <= 0)  return this.target.innerText = 'Month cannot be less than 1';
        if(month > MONTH_IN_YEAR)  return this.target.innerText = 'Month cannot be more than 12';
        if(year <= 0)  return this.target.innerText = 'Year cannot be less than 1';
        if(isLeap && day > DAYS_IN_MONTH && month !== 2)  return this.target.innerText = 'This month cannot have 31 day on this Planet';
        if(!isLeap && day > DAYS_IN_MONTH)  return this.target.innerText = 'This month cannot have 31 day on this Planet';

        this.validatorCheck = true;
    }
}

const target = document.querySelector('#target');
const button = document.querySelector('button');

button.addEventListener('click', () => {
    let currentDay = +document.querySelector('#day').value;
    let currentMonth = +document.querySelector('#month').value;
    let currentYear = +document.querySelector('#year').value;

    const dayWeek = new ChronosCalendar(currentDay,currentMonth,currentYear, target);
    dayWeek.dayOnWeek();
});