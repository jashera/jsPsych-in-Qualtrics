
*The original version of this tutorial is hosted at <a href="https://github.com/janakl4us/flanker/blob/master/tutorial.md">https://github.com/janakl4us/flanker</a>. 
This tutorial has been updated to be in sync with the `demo-flanker.html` in [the jsPsych repository](https://github.com/jspsych/jsPsych/blob/master/examples/demo-flanker.html).*

# Eriksen Flanker Task

The flanker task is a popular task to measure response inhibition. In the variant presented here, participants are
required to judge whether an arrow presented between four other arrows is pointing in the same or the opposite
direction by pressing a key on the keyboard. We will create a 16-trial long version of this task which provides
feedback on the participant's performance at the end of the experiment.

## Part 1: Setting up the HTML file

As always, we need to create an HTML file which references the Javascript plugins and CSS required. 
For this experiment, we will only use the [jspsych-html-keyboard-response](https://github.com/jspsych/jsPsych/blob/master/plugins/jspsych-html-keyboard-response.js)
 and [jspsych-image-keyboard-response](https://github.com/jspsych/jsPsych/blob/master/plugins/jspsych-image-keyboard-response.js)
plugins which can be specified in the `<head>` of the file.

```html
<!DOCTYPE html>
<html>

<head>
  <title>Flanker Task</title>
  <script src="jspsych-6.1.0/jspsych.js"></script>
  <script src="jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js"></script>
  <script src="jspsych-6.1.0/plugins/jspsych-image-keyboard-response.js"></script>
  <link rel="stylesheet" href="jspsych-6.1.0/css/jspsych.css">
</head>

<body>
</body>
</html>
```

## Part 2: Adding welcome and instructions blocks and starting the experiment

This is also very straightforward. We present a welcome message as well as the instructions in two separate blocks. 
Of course, this text can be adapted according to what you want to focus on. 
Here, we're just saying that the task is to press one of two buttons in response to the middle arrow displayed on the screen. 
Note that after the participants read the instructions, they can start the experiment by pressing any key. 
The first trial then starts 1000 ms after that button press, as defined in `post_trial_gap`. 
These options obviously can be changed as well.

```javascript
/*set up welcome block*/
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};

/*set up instructions block*/
var instructions = {
  type: "html-keyboard-response",
  stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
    "<img src='img/inc1.png'></img>" +
    "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
    "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
    "<p>Press any key to begin.</p>",
  post_trial_gap: 1000
};
```

Both blocks need to be added to the timeline of the experiment.

```javascript
var timeline = [];
timeline.push(welcome);
timeline.push(instructions);
```

Finally, we need to initiate the experiment by adding this piece of code at the bottom:

```javascript
jsPsych.init({
    timeline: timeline,
    on_finish: function() {
        jsPsych.data.displayData();
    }
);
```

If you are unsure about any of this, go back to the [tutorial for running a simple reaction time task](https://www.jspsych.org/tutorials/rt-task/).

### The code so far:

```html
<!DOCTYPE html>
<html>

<head>
    <title>Flanker Task</title>
    <script src="jspsych-6.1.0/jspsych.js"></script>
    <script src="jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js"></script>
    <script src="jspsych-6.1.0/plugins/jspsych-image-keyboard-response.js"></script>
    <link rel="stylesheet" href="jspsych-6.1.0/css/jspsych.css">
</head>

<body>
</body>

<script>
    /*set up welcome block*/
    var welcome = {
        type: "html-keyboard-response",
        stimulus: "Welcome to the experiment. Press any key to begin."
    };

    /*set up instructions block*/
    var instructions = {
        type: "html-keyboard-response",
        stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
            "<img src='img/inc1.png'></img>" +
            "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
            "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
            "<p>Press any key to begin.</p>",
        post_trial_gap: 1000
    };

    /*set up experiment structure*/
    var timeline = [];
    timeline.push(welcome);
    timeline.push(instructions);

    /*start experiment*/
    jsPsych.init({
        timeline: timeline,
        on_finish: function () {
            jsPsych.data.displayData();
        }
    });
</script>

</html>
```

If you run this code in your browser, you should see the welcome message as well as the instructions. Next, we need to
define which stimuli we are going to use for the experiment.

## Part 3: Defining the stimuli

For this experiment we are using four image files which are stored in the `img` folder. 
First, we need to define them as being the `test_stimuli` we want to use. 
At the same time, we can also define specific attributes per stimulus. 
For instance, we might want to keep track of the congruency of the stimuli, regardless of the direction in which they are pointing. 
To do this, we don't just define the location of the stimulus image in the `stimulus`, but also an additional attribute in the `data` line. 
Note that this information will automatically be stored in your result file. 
You can add whatever extra information you might need here.
For example, `stim_type` and `direction` are added here to make the analysis easier.

```javascript
/*defining stimuli*/
var test_stimuli = [
  {
    stimulus: "img/con1.png",
    data: { stim_type: 'congruent', direction: 'left'}
  },
  {
    stimulus: "img/con2.png",
    data: { stim_type: 'congruent', direction: 'right'}
  },
  {
    stimulus: "img/inc1.png",
    data: { stim_type: 'incongruent', direction: 'right'}
  },
  {
    stimulus: "img/inc2.png",
    data: { stim_type: 'incongruent', direction: 'left'}
  }
];
```

## Part 4: Creating an experimental block

So far, we have set up a welcome message, an instructions block, and the stimuli for our experiment. 
**Now comes the most important part, that is, creating the `timeline` in the `test` block.**
As you can see, there is a LOT packed in here.

* `type`: It is supported by the `image-keyboard-response` plugin, so this information needs to go in first.
* `choices`: Then, we defined the left and right arrow of the keyboard as our response keys, so their keycodes (37 and 39; look up your required keycodes 
[here](http://www.asquare.net/javascript/tests/KeyCode.html)) need to be defined here. 
* `trial_duration`: We want each stimulus to be presented for 1500 ms at most, which should be defined here in ms. 
* `stimulus` and `data`: The `test_stimuli` defined above is referenced in the `timeline_variables`, 
and the `stimulus` and `data` defined in the `test_stimuli` are fed into the plugin via the `jsPsych.timelineVariable` function 
(see [the tutorial](https://www.jspsych.org/overview/timeline/#timeline-variables)).
* `sample`: Now that we have defined our stimuli, we want them to be displayed and repeated in a random order. 
This can easily be done via `sample` (see [the jsPsych tutorial on sampling](https://www.jspsych.org/overview/timeline/#repeating-each-trial-a-fixed-number-of-times-in-a-random-order)). This timeline contains 4 repetitions (as defined in `reps_per_trial_type`) of 4 different trials types (as defined in `test_stimuli`), resulting in 16 trials.
* `on_finish`: When a trial finishes, its `data` is passed to be examined right away. 
Here, the code compares the response (`data.key_press` and `data.rt`) with the stimulus (`data.direction`) and records `data.correct` variable.
For example, whenever a congruent stimulus was displayed and the left arrow key was pressed <em>or</em> 
an incongruent stimulus was displayed and the right arrow key was pressed (and neither of those reactions was later than the 1500 ms limit we defined earlier), 
the program returns the information that these are correct trials.
* `post_trial_gap`: We also want the inter-stimulus interval to be variable. This code will use a random value between 500 and 2000 ms, with uniform sampling from the range. Again, you can modify these parameters as you please.

```javascript
/* experiment parameters */
var reps_per_trial_type = 4;

/* defining test timeline */
var test = {
  timeline: [{
    type: 'image-keyboard-response',
    choices: [37, 39],
    trial_duration: 1500,
    stimulus: jsPsych.timelineVariable('stimulus'),
    data: jsPsych.timelineVariable('data'),
    on_finish: function (data) {
      var correct = false;
      if (data.direction == 'left' && data.key_press == 37 && data.rt > -1) {
        correct = true;
      } else if (data.direction == 'right' && data.key_press == 39 && data.rt > -1) {
        correct = true;
      }
      data.correct = correct;
    },
    post_trial_gap: function () {
      return Math.floor(Math.random() * 1500) + 500;
    }
  }],
  timeline_variables: test_stimuli,
  sample: {
    type: 'fixed-repetitions',
    size: reps_per_trial_type
  }
};
```

Of course, this block also needs to be added to the experiment's timeline:

```javascript
timeline.push(test);
```

### The code so far:

```html
<!DOCTYPE html>
<html>

<head>
  <title>Flanker Task</title>
  <script src="jspsych-6.1.0/jspsych.js"></script>
  <script src="jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js"></script>
  <script src="jspsych-6.1.0/plugins/jspsych-image-keyboard-response.js"></script>
  <link rel="stylesheet" href="jspsych-6.1.0/css/jspsych.css">
</head>

<body>
</body>
<script>
  /* experiment parameters */
  var reps_per_trial_type = 4;

  /*set up welcome block*/
  var welcome = {
    type: "html-keyboard-response",
    stimulus: "Welcome to the experiment. Press any key to begin."
  };

  /*set up instructions block*/
  var instructions = {
    type: "html-keyboard-response",
    stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
      "<img src='img/inc1.png'></img>" +
      "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
      "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
      "<p>Press any key to begin.</p>",
    post_trial_gap: 1000
  };

  /*defining stimuli*/
  var test_stimuli = [
    {
      stimulus: "img/con1.png",
      data: { stim_type: 'congruent', direction: 'left'}
    },
    {
      stimulus: "img/con2.png",
      data: { stim_type: 'congruent', direction: 'right'}
    },
    {
      stimulus: "img/inc1.png",
      data: { stim_type: 'incongruent', direction: 'right'}
    },
    {
      stimulus: "img/inc2.png",
      data: { stim_type: 'incongruent', direction: 'left'}
    }
  ];

  /* defining test timeline */
  var test = {
    timeline: [{
      type: 'image-keyboard-response',
      choices: [37, 39],
      trial_duration: 1500,
      stimulus: jsPsych.timelineVariable('stimulus'),
      data: jsPsych.timelineVariable('data'),
      on_finish: function (data) {
        var correct = false;
        if (data.direction == 'left' && data.key_press == 37 && data.rt > -1) {
          correct = true;
        } else if (data.direction == 'right' && data.key_press == 39 && data.rt > -1) {
          correct = true;
        }
        data.correct = correct;
      },
      post_trial_gap: function () {
        return Math.floor(Math.random() * 1500) + 500;
      }
    }],
    timeline_variables: test_stimuli,
    sample: {
      type: 'fixed-repetitions',
      size: reps_per_trial_type
    }
  };

  /*set up experiment structure*/
  var timeline = [];
  timeline.push(welcome);
  timeline.push(instructions);
  timeline.push(test);

  /*start experiment*/
  jsPsych.init({
    timeline: timeline,
    on_finish: function () {
      jsPsych.data.displayData();
    }
  });
</script>

</html>
```

## Part 5: Presenting feedback to the participants

Running the experiment now will provide you with a welcome message, instructions, and 16 trials. We would like to give
the participants feedback about their performance at the end of the experiment. 
[The jsPsych Reaction Time task also does this](https://www.jspsych.org/tutorials/rt-task/#part-11-data-aggregation),
and the tutorial explains in detail in the [Part 11: Data aggregation](https://www.jspsych.org/tutorials/rt-task/#part-11-data-aggregation).

This debriefing block shows the accuracy, mean RT for congruent trials, and mean RT for incongruent trials.

```javascript
/*defining debriefing block*/
var debrief = {
  type: "html-keyboard-response",
  stimulus: function () {
    var total_trials = jsPsych.data.get().filter({
      trial_type: 'image-keyboard-response'
    }).count();
    var accuracy = Math.round(jsPsych.data.get().filter({
      correct: true
    }).count() / total_trials * 100);
    var congruent_rt = Math.round(jsPsych.data.get().filter({
      correct: true,
      stim_type: 'congruent'
    }).select('rt').mean());
    var incongruent_rt = Math.round(jsPsych.data.get().filter({
      correct: true,
      stim_type: 'incongruent'
    }).select('rt').mean());
    return "<p>You responded correctly on <strong>" + accuracy + "%</strong> of the trials.</p> " +
      "<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>" +
      "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>" +
      "<p>Press any key to complete the experiment. Thank you!</p>";
  }
};
```

Don't forget to add this block to the timeline as well!
```javascript
timeline.push(debrief);
```

### [The final code](demo-flanker.html):
```html
<!DOCTYPE html>
<html>

<head>
  <title>Flanker Task</title>
  <script src="jspsych-6.1.0/jspsych.js"></script>
  <script src="jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js"></script>
  <script src="jspsych-6.1.0/plugins/jspsych-image-keyboard-response.js"></script>
  <link rel="stylesheet" href="jspsych-6.1.0/css/jspsych.css">
</head>

<body>
</body>
<script>
  /* experiment parameters */
  var reps_per_trial_type = 4;

  /*set up welcome block*/
  var welcome = {
    type: "html-keyboard-response",
    stimulus: "Welcome to the experiment. Press any key to begin."
  };

  /*set up instructions block*/
  var instructions = {
    type: "html-keyboard-response",
    stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
      "<img src='img/inc1.png'></img>" +
      "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
      "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
      "<p>Press any key to begin.</p>",
    post_trial_gap: 1000
  };

  /*defining stimuli*/
  var test_stimuli = [
    {
      stimulus: "img/con1.png",
      data: { stim_type: 'congruent', direction: 'left'}
    },
    {
      stimulus: "img/con2.png",
      data: { stim_type: 'congruent', direction: 'right'}
    },
    {
      stimulus: "img/inc1.png",
      data: { stim_type: 'incongruent', direction: 'right'}
    },
    {
      stimulus: "img/inc2.png",
      data: { stim_type: 'incongruent', direction: 'left'}
    }
  ];

  /* defining test timeline */
  var test = {
    timeline: [{
      type: 'image-keyboard-response',
      choices: [37, 39],
      trial_duration: 1500,
      stimulus: jsPsych.timelineVariable('stimulus'),
      data: jsPsych.timelineVariable('data'),
      on_finish: function (data) {
        var correct = false;
        if (data.direction == 'left' && data.key_press == 37 && data.rt > -1) {
          correct = true;
        } else if (data.direction == 'right' && data.key_press == 39 && data.rt > -1) {
          correct = true;
        }
        data.correct = correct;
      },
      post_trial_gap: function () {
        return Math.floor(Math.random() * 1500) + 500;
      }
    }],
    timeline_variables: test_stimuli,
    sample: {
      type: 'fixed-repetitions',
      size: reps_per_trial_type
    }
  };

  /*defining debriefing block*/
  var debrief = {
    type: "html-keyboard-response",
    stimulus: function () {
      var total_trials = jsPsych.data.get().filter({
        trial_type: 'image-keyboard-response'
      }).count();
      var accuracy = Math.round(jsPsych.data.get().filter({
        correct: true
      }).count() / total_trials * 100);
      var congruent_rt = Math.round(jsPsych.data.get().filter({
        correct: true,
        stim_type: 'congruent'
      }).select('rt').mean());
      var incongruent_rt = Math.round(jsPsych.data.get().filter({
        correct: true,
        stim_type: 'incongruent'
      }).select('rt').mean());
      return "<p>You responded correctly on <strong>" + accuracy + "%</strong> of the trials.</p> " +
        "<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>" +
        "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>" +
        "<p>Press any key to complete the experiment. Thank you!</p>";
    }
  };

  /*set up experiment structure*/
  var timeline = [];
  timeline.push(welcome);
  timeline.push(instructions);
  timeline.push(test);
  timeline.push(debrief);

  /*start experiment*/
  jsPsych.init({
    timeline: timeline,
    on_finish: function () {
      jsPsych.data.displayData();
    }
  });
</script>

</html>
```
