import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addDays',
})
export class AddDaysPipe implements PipeTransform {
  transform(date: Date | string, days: number): Date {
    if (!date) return new Date(); // Nếu ngày bị null hoặc undefined, trả về ngày hiện tại
    if (!days || isNaN(days)) days = 0; // Nếu days không hợp lệ, đặt về 0

    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
