var VIEW = require('../../cjs/in-scroll-view');

VIEW.add('.section', {
    percentInView: .5
});

VIEW.onChange(function (item) {
    console.log(item.$el);
    console.log(item.status);
    // VIEW.remove(item);
});
