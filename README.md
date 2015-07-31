scroll-view
===========

Keep track of whether an element is in view or out of view.

Depends on jQuery.

```js
// these options are the default options so this wouldn't be necessary.
var options = {
    percentInView: 0.75,
    attr: 'data-view',
    lock: '' // 'in' or 'out'
};

// Add items
VIEW.add('.section', options); // first parameter is anything jQuery accepts
```

Now when 75% of a "section" is in view, the attribute `data-view` will change from 'out' to 'in'.

If lock is set to 'in', an item is automatically removed when the status changes to 'in'.

### Additional methods

```js
// re-measure the window and items position
VIEW.measure();

// re-calculate the views based on scrollTop
// (this is automatically called with `measure`)
VIEW.scroll();

// unbind the events attached to the window
VIEW.unbindWindow();

// re-bind the events to the window
VIEW.bindWindow();

// listen to changes in an items status
VIEW.onChange(function (item) {

    if (item.$el.hasClass('section') && item.status === 'on') {

        // remove an item or an array of items
        VIEW.remove(item);
    }
});

// remove all items
VIEW.remove();
```
