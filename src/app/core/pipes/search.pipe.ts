import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(list: any[], searchTerm: string): any[] {
    if (!list || !searchTerm) {
      return list || [];
    }
    return list.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

}
