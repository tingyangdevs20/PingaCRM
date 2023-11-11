import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'million'
})
export class MillionPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {

  }
  transform(value: any, digits?: any): any {
    return this.decimalPipe.transform(value/1000000, digits)
  }

}

@Pipe({
  name:'INRCurrency'
})
export class INRCurrencyPipe implements PipeTransform {
  transform(value: number): string {

    //value = Math.round(value);
    var result = value.toString().split('.');
    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != '' && otherNumbers != '-')
      lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (result.length > 1) {
      output += "." + result[1];
    }

    return output;

  }
}
