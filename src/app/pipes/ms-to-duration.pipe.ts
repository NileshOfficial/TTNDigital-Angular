import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class MsToDurationPipe implements PipeTransform {

  limit = [60, 3600, 86400, 604800, 2419200, 29030400]
  durationType = ['min', 'h', 'd', 'w', 'm', 'y'];

  transform(value: number): string {
    let seconds = value / 1000;
    let duration = 'now';
    let durationQty: number = 0;

    if (seconds > 29030400) {
      return `${Math.floor(seconds / 29030400)}y ago`
    }

    for (let idx = 0; idx < this.limit.length - 1; idx++) {
      if (seconds > this.limit[idx] && seconds < this.limit[idx + 1]) {
        durationQty = seconds / this.limit[idx];
        duration = this.durationType[idx];
        break;
      }
    }
    return duration === 'now' ? duration : `${Math.floor(durationQty)}${duration} ago`;
  }

}
