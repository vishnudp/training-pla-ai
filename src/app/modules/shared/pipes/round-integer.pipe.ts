import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filterRoundInteger',
})
export class PipeFilterRoundInteger implements PipeTransform {

  transform(data: any, limit: number = 5): any {
    let digits = 0

    if (!data) {
      return data
    }
    if (!isNaN(data)) {
      let  rounder = Math.pow(10, digits);
      return (Math.round(data * rounder) / rounder).toFixed(digits);
    } 

    return data
  }

}
