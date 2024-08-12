import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable()
@Pipe({
  name: 'yN',
  pure: true,
  standalone: true,
})
export class YesNoPipe implements PipeTransform {
  // Convert boolean value to yes or no transalation value
  transform(value: boolean) {
    return value === true ? 'app.strings.yes' : 'app.strings.no';
  }
}
