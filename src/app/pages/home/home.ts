import { Component } from '@angular/core';
import { FileExplorer } from '../../components/file-explorer/file-explorer';

@Component({
  selector: 'app-home',
  imports: [FileExplorer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
