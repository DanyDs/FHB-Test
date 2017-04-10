var childSelector = 'img';

$('#slider').each(function() {
  var slider = $(this),
      slides,
      wrapper = $('<figure class="rc-wrapper"></figure>'),
      numChildren, maxWidth,
      keyframes = $('<style type="text/css"></style>');
  
  // Find child elements
  if (!$.trim(childSelector)) {
    slides = slider.children();
  } else {
    slides = slider.find(childSelector);
  }
  numChildren = slides.length;
  
  // Limit slider max-width to largest slide
  slider.css({
    'max-width': maxWidth
  });
  
  slides.each(function() {
    var slide = $(this);
    
    // Set slider `max-width` to largest child width
    if (slide.width() > maxWidth) {
      maxWidth = slide.width();
    }
    
    // Set child css
    slide.css({
      'width': (100 / numChildren) + '%'
    });
    
    slide.addClass('rc-slide');
  });
  
  wrapper.css({
    'width': (numChildren * 100 + '%')
  });
  
  
  var step = (100 / (numChildren + 1));
  var keyframe = 0;
  var deltaStep = 5; // 5% delta
  var slide = 0;
  var keyframesDef = '';
  
  keyframesDef = '@keyframes rc-slide {\n';
  while (slide < numChildren) {
    keyframesDef += '\t' + keyframe + '% { left: ' + (slide * -100) + '%; }\n';
    if (keyframe + step < 95) {
      keyframe += step;
    } else {
      break;
    }
    keyframesDef += '\t' + keyframe + '% { left: ' + (slide * -100) + '%; }\n';
    slide++;
    keyframe += deltaStep;
  }
  keyframesDef += '\t95% { left: ' + ((numChildren - 1) * -100) + '%; }\n';
  keyframesDef += '\t100% { left: 0%; }\n';
  keyframesDef += '}';
  keyframes.html(keyframesDef);
  slider.append(keyframes);
  
  // Reparent slides to the wrapper and add the wrapper
  wrapper.append(slides);
  slider.append(wrapper);
});