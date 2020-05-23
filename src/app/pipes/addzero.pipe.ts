import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addzero'
})
export class AddZeroPipe implements PipeTransform {

  transform(value: number): string {
    let num = '' + value;
    if(num.length < 2)
      return '0' + num;
    return num;
  }
}
