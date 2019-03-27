Bootstrap's card is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options. If you’re familiar with Bootstrap 3, cards replace our old panels, wells, and thumbnails. Similar functionality to those components is available as modifier classes for cards.
           
#### Example Usage

```html
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
```

#### Content Types

##### Body
The building block of a card is the `.card-body`. Use it whenever you need a padded section within a card.

##### Titles
Card titles are used by adding `.card-title` to a <h*> tag. In the same way, links are added and placed next to each other by adding `.card-link` to an <a> tag.

##### Subtitles
Subtitles are used by adding a `.card-subtitle` to a <h*> tag. If the .card-title and the `.card-subtitle` items are placed in a `.card-body` item, the card title and subtitle are aligned nicely.

##### Images
`.card-img-top` places an image to the top of the card. With `.card-text`, text can be added to the card. Text within `.card-text` can also be styled with the standard HTML tags.

##### List Groups
`.list-group` creates lists of content in a card with a flush list group.
              
##### Card Headers
Card headers can be styled by adding `.card-header` to <h*> elements.
