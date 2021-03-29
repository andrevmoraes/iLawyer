import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  public feed: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.feed = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
