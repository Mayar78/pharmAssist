import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

   transform(data:any[], value:string): any[] {
    return data.filter( current => current.name.toLowerCase().includes(value.toLowerCase()));
  }

}
