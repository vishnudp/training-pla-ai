import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByName'
})
export class OrderByNamePipe implements PipeTransform {
  transform(value: any[], property: string = 'name'): any[] {
    
    if (!Array.isArray(value)) {
      return value;
    }
    return value.slice().sort((a, b) => {
      const nameA = a[property]?.toLowerCase();
      const nameB = b[property]?.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }
}
