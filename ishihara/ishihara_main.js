// Use JSDELIVR to get the files from a GitHub repository
// https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/
var repo_site = "https://cdn.jsdelivr.net/gh/jashera/jsPsych-in-Qualtrics/ishihara/";


/*set up experiment structure*/
var timeline = [];


  /* experiment parameters */
  var reps_per_trial_type = 1;

  /*set up welcome block*/
  var welcome = {
    type: "html-keyboard-response",
    stimulus: "Press any key to begin."
  };

  /*set up instructions block*/
  var instructions = {
    type: "html-keyboard-response",
    stimulus: "<p>In this task, you will see a circle comprised of dots on the screen, like the example below.</p>" +
      "<img src='Images/Ish_Brief96.png'></img>" +
      "<p>Press the button that matches the number you see, or Nothing if there is no number</p>" +
      "<p>Press any key to start.</p>",
    post_trial_gap: 1000
  };


  
  /*defining stimuli*/
  var test_stimuli = [
    {
      stimulus: "Images/Ish_1_12.png",
      data: { Normal: 2, RedGreen: 2, ClrBlind: 2 }, /* button code */
      choices: ['Nothing', '9', '12'], /* 0,1,2 */       
    },
    {
      stimulus: "Images/Ish_2_8.png",
      data: { Normal: 1, RedGreen: 0, ClrBlind: 2 },
      choices: ['3', '8', 'Nothing'], /* 0,1,2 */
    },
    {
      stimulus: "Images/Ish_3_29.png",
      data: { Normal: 0, RedGreen: 2, ClrBlind: 1 },
      choices: ['29', 'Nothing', '70'], /* 0,1,2 */
    },
    {
      stimulus: "Images/Ish_4_5.png",
      data: { Normal: 0, RedGreen: 1, ClrBlind: 2 },
      choices: ['5', '2', 'Nothing'],  /* 0,1,2 */
    },
    {
      stimulus: "Images/Ish_5_3.png",
      data: { Normal: 2, RedGreen: 0, ClrBlind: 1},
      choices: ['5', 'Nothing', '3'],  /* 0,1,2 */
    },
    {
      stimulus: "Images/Ish_7_74.png",
      data: { Normal: 2, RedGreen: 1, ClrBlind: 0},
      choices: ['Nothing','21', '74',],  /* 0,1,2 */
    }
  ];


  


  /* defining test timeline */
  var test = {
    timeline: [{
      type: 'image-button-response',
      stimulus_duration: 3000,
      stimulus: jsPsych.timelineVariable('stimulus'),
      data: jsPsych.timelineVariable('data'),
      choices: jsPsych.timelineVariable('choices'),
      stimulus_height: 300,
      prompt: "<p>What number did you see?</p><p>(image disappears after 3s)</p>",
      on_finish: function (data) {
        var correct = 0;
        if (data.button_pressed == data.Normal ) {
          correct = 1;
        } else if (data.button_pressed == data.RedGreen) {
          correct = -1;
         }  else if (data.button_pressed == data.ClrBlind){
          correct = 0;
        }
        data.correct = correct;
      },
      post_trial_gap: 500
    }],
    timeline_variables: test_stimuli,
  };

  /*defining debriefing block*/
  var debrief = {
    type: "html-keyboard-response",
    stimulus: "<p>Thats it.</p>" +
          "<p>Press the key to continue</p>"
    };

    /*defining debriefing block*/
    var debrief = {
    type: "html-keyboard-response",
    stimulus: function () {
      var total_trials = jsPsych.data.get().filter({trial_type: 'image-button-response'}).count();
      var countNorm = jsPsych.data.get().filter({correct: 1}).count();
      var countRGB = jsPsych.data.get().filter({correct: -1}).count();
      var countCLB = jsPsych.data.get().filter({correct: 0}).count();
      return "<p>Normal colour vision on <strong>" + countNorm + "</strong>/6 trials.</p> " +
      "<p>Red/Green colour blind on <strong>" + countRGB + "</strong>/6 trials.</p> " +
      "<p> Colour blind <strong>" + countCLB + "</strong>/6 trials.</p> ";
    }
  }; 
  
  
  /*set up experiment structure*/
  //var timeline = [];
  timeline.push(welcome);
  timeline.push(instructions);
  timeline.push(test);
  timeline.push(debrief);

  /*start experiment*/
